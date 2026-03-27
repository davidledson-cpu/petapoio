interface AppointmentNotificationData {
  patientName: string
  professionalName: string
  scheduledAt: string
  durationMin: number
  amountPaid: number
}

export async function sendAppointmentNotification(data: AppointmentNotificationData) {
  try {
    // Read notification email from environment variable
    const notificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL
    if (!notificationEmail) {
      console.log('[Email] No ADMIN_NOTIFICATION_EMAIL configured')
      return
    }

    const emails = notificationEmail.split(',').map((e: string) => e.trim()).filter(Boolean)
    if (emails.length === 0) return

    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'no-reply@petapoio.com.br'
    if (!resendApiKey) { console.warn('[Email] RESEND_API_KEY not configured'); return }

    const scheduledDate = new Date(data.scheduledAt)
    const dateFormatted = scheduledDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
    const timeFormatted = scheduledDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const amountFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.amountPaid)

    const htmlBody = `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px;">
  <div style="background: white; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0;">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 32px;">&#x1F43E;</span>
      <h1 style="font-size: 20px; color: #1e293b; margin: 8px 0 4px;">Nova Consulta Agendada</h1>
      <p style="color: #64748b; font-size: 14px; margin: 0;">PetApoio - Notificacao de Agendamento</p>
    </div>
    <div style="background: #f0f9ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Paciente:</td><td style="padding: 8px 0; color: #1e293b;">${data.patientName}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Profissional:</td><td style="padding: 8px 0; color: #1e293b;">${data.professionalName}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Data:</td><td style="padding: 8px 0; color: #1e293b;">${dateFormatted}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Horario:</td><td style="padding: 8px 0; color: #1e293b;">${timeFormatted}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Duracao:</td><td style="padding: 8px 0; color: #1e293b;">${data.durationMin} minutos</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Valor:</td><td style="padding: 8px 0; color: #059669; font-weight: 700;">${amountFormatted}</td></tr>
      </table>
    </div>
    <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">Notificacao automatica da plataforma PetApoio.</p>
  </div>
</div>`
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `PetApoio <${fromEmail}>`,
        to: emails,
        subject: `Nova consulta agendada - ${data.patientName} com ${data.professionalName}`,
        html: htmlBody,
      }),
    })

    if (!response.ok) { const err = await response.json(); console.error('[Email] Failed:', err) }
    else { console.log('[Email] Sent to:', emails.join(', ')) }
  } catch (error) {
    console.error('[Email] Error:', error)
  }
}

