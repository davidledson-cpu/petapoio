import { NextResponse } from 'next/server'

function validateAdmin(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  if (authHeader === `Bearer ${adminPassword}`) return true
  // Also support basic password in body or query
  return false
}

export async function GET(request: Request) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const notificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL || ''

  return NextResponse.json({
    settings: {
      notification_email_appointments: notificationEmail,
    }
  })
}

export async function PUT(request: Request) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    message: 'Para atualizar o email de notificacao, altere a variavel ADMIN_NOTIFICATION_EMAIL nas configuracoes do Vercel.',
    currentEmail: process.env.ADMIN_NOTIFICATION_EMAIL || '',
  })
}
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/admin/settings
export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  let query = supabase.from('platform_settings').select('*')
  if (key) query = query.eq('key', key)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ settings: data })
}

// PUT /api/admin/settings
export async function PUT(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { key, value } = body

  if (!key) return NextResponse.json({ error: 'Key is required' }, { status: 400 })

  if (key.includes('email') && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const emails = value.split(',').map((e: string) => e.trim())
    for (const email of emails) {
      if (email && !emailRegex.test(email)) {
        return NextResponse.json({ error: 'Email invalido: ' + email }, { status: 400 })
      }
    }
  }

  const { data, error } = await supabase
    .from('platform_settings')
    .upsert({
      key,
      value,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ setting: data })
          }
