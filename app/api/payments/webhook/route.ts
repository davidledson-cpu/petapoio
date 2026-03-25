import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const { appointmentId } = pi.metadata

      if (appointmentId) {
        await supabase
          .from('appointments')
          .update({ payment_status: 'paid', status: 'confirmed' })
          .eq('id', appointmentId)

        // Create Daily.co room for the appointment
        const { data: apt } = await supabase
          .from('appointments')
          .select('scheduled_at')
          .eq('id', appointmentId)
          .single()

        if (apt) {
          try {
            const roomRes = await fetch('https://api.daily.co/v1/rooms', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
              },
              body: JSON.stringify({
                name: `petapoio-${appointmentId}`,
                properties: {
                  exp: Math.floor(new Date(apt.scheduled_at).getTime() / 1000) + 3 * 3600,
                  max_participants: 2,
                  enable_recording: false,
                },
              }),
            })
            const room = await roomRes.json()

            await supabase
              .from('appointments')
              .update({
                video_room_url: room.url,
                video_room_id: room.name,
              })
              .eq('id', appointmentId)
          } catch (e) {
            console.error('Daily.co room creation failed:', e)
          }
        }
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      const { appointmentId } = pi.metadata
      if (appointmentId) {
        await supabase
          .from('appointments')
          .update({ status: 'cancelled', payment_status: 'failed' })
          .eq('id', appointmentId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
