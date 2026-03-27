import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendAppointmentNotification } from '@/lib/email/send-appointment-notification'

// POST /api/appointments — create appointment after payment
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { professionalId, scheduledAt, durationMin, paymentIntentId, amountPaid } = body

  // Get professional profile for commission calculation
  const { data: pro } = await supabase
    .from('professional_profiles')
    .select('session_price')
    .eq('id', professionalId)
    .single()

  if (!pro) return NextResponse.json({ error: 'Professional not found' }, { status: 404 })

  const platformFeePercent = Number(process.env.STRIPE_PLATFORM_FEE_PERCENT || 20) / 100
  const platformFee = amountPaid * platformFeePercent
  const professionalAmount = amountPaid - platformFee

  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      patient_id: user.id,
      professional_id: professionalId,
      scheduled_at: scheduledAt,
      duration_min: durationMin,
      status: 'confirmed',
      payment_intent_id: paymentIntentId,
      amount_paid: amountPaid,
      platform_fee: platformFee,
      professional_amount: professionalAmount,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Award points for booking
  await supabase.rpc('award_points', { p_user_id: user.id, p_points: 5 })

    // Send email notification to admin (non-blocking)
  const { data: patientProfile } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: professionalUser } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', professionalId)
    .single()

  sendAppointmentNotification({
    patientName: patientProfile?.full_name || 'Paciente',
    professionalName: professionalUser?.full_name || 'Profissional',
    scheduledAt,
    durationMin,
    amountPaid,
  }).catch(console.error)

  return NextResponse.json({ appointment })
}

// GET /api/appointments — list patient's appointments
export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let query = supabase
    .from('appointments')
    .select(`
      *,
      professional:professional_id(id, full_name, avatar_url, professional_profiles(specialty))
    `)
    .eq('patient_id', user.id)
    .order('scheduled_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ appointments: data })
}

