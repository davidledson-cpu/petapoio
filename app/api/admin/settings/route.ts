import { NextResponse } from 'next/server'

function validateAdmin(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  if (authHeader === `Bearer ${adminPassword}`) return true
  // Also support basic password or query
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

