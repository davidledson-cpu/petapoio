import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const {
      professionalId,
      professionalName,
      professionalEmail,
      patientName,
      patientEmail,
      date,
      time,
      notes,
    } = await request.json()

    if (!professionalEmail || !patientEmail || !date || !time) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    const fromEmail = 'PetApoio <noreply@petapoio.com.br>'

    const formattedDate = new Date(`${date}T${time}:00`).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const professionalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 24px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">🐾 PetApoio</h1>
              <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Plataforma de Apoio ao Luto Pet</p>
            </div>
            <div style="padding:32px 24px;">
              <h2 style="color:#1f2937;margin:0 0 8px;">Nova Solicitação de Sessão</h2>
              <p style="color:#6b7280;margin:0 0 24px;font-size:15px;">
                Olá, <strong>${professionalName}</strong>! Você recebeu uma nova solicitação de agendamento.
              </p>

              <div style="background:#f3f4f6;border-radius:10px;padding:20px;margin-bottom:24px;">
                <h3 style="color:#374151;margin:0 0 16px;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">📅 Detalhes do Agendamento</h3>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0;color:#6b7280;font-size:14px;width:40%;">Paciente:</td>
                    <td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:600;">${patientName}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#6b7280;font-size:14px;">E-mail:</td>
                    <td style="padding:8px 0;color:#1f2937;font-size:14px;">${patientEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#6b7280;font-size:14px;">Data e hora:</td>
                    <td style="padding:8px 0;color:#6366f1;font-size:14px;font-weight:600;">${formattedDate}</td>
                  </tr>
                  ${notes ? `<tr>
                    <td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top;">Mensagem:</td>
                    <td style="padding:8px 0;color:#1f2937;font-size:14px;">${notes}</td>
                  </tr>` : ''}
                </table>
              </div>

              <div style="background:#ede9fe;border-radius:10px;padding:16px;margin-bottom:24px;">
                <p style="color:#5b21b6;margin:0;font-size:14px;">
                  💌 Entre em contato com o paciente pelo e-mail <strong>${patientEmail}</strong> para confirmar ou reagendar a sessão.
                </p>
              </div>

              <p style="color:#9ca3af;font-size:13px;margin:0;">
                Esta solicitação foi enviada pela plataforma <a href="https://petapoio.vercel.app" style="color:#6366f1;">PetApoio</a>.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const patientHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 24px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">🐾 PetApoio</h1>
              <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Sua jornada de cura começa aqui</p>
            </div>
            <div style="padding:32px 24px;">
              <h2 style="color:#1f2937;margin:0 0 8px;">Solicitação Enviada com Sucesso! ✅</h2>
              <p style="color:#6b7280;margin:0 0 24px;font-size:15px;">
                Olá, <strong>${patientName}</strong>! Sua solicitação de sessão foi enviada ao profissional.
              </p>

              <div style="background:#f3f4f6;border-radius:10px;padding:20px;margin-bottom:24px;">
                <h3 style="color:#374151;margin:0 0 16px;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">📅 Resumo do Agendamento</h3>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0;color:#6b7280;font-size:14px;width:40%;">Profissional:</td>
                    <td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:600;">${professionalName}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#6b7280;font-size:14px;">Data e hora:</td>
                    <td style="padding:8px 0;color:#6366f1;font-size:14px;font-weight:600;">${formattedDate}</td>
                  </tr>
                  ${notes ? `<tr>
                    <td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top;">Sua mensagem:</td>
                    <td style="padding:8px 0;color:#1f2937;font-size:14px;">${notes}</td>
                  </tr>` : ''}
                </table>
              </div>

              <div style="background:#dcfce7;border-radius:10px;padding:16px;margin-bottom:24px;">
                <p style="color:#166534;margin:0;font-size:14px;">
                  🕐 O profissional entrará em contato em breve para confirmar o horário. Fique atento ao seu e-mail.
                </p>
              </div>

              <p style="color:#9ca3af;font-size:13px;margin:0;">
                Dúvidas? Fale conosco em <a href="mailto:contato@petapoio.com.br" style="color:#6366f1;">contato@petapoio.com.br</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    if (!resendKey) {
      console.log('[book-session] RESEND_API_KEY not set — logging booking:', {
        professionalName,
        patientName,
        date,
        time,
      })
      return NextResponse.json({ ok: true, dev: true })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(resendKey)

    // Send invite to professional
    await resend.emails.send({
      from: fromEmail,
      to: professionalEmail,
      subject: `📅 Nova solicitação de sessão — ${patientName} (${date} às ${time})`,
      html: professionalHtml,
    })

    // Send confirmation to patient
    await resend.emails.send({
      from: fromEmail,
      to: patientEmail,
      subject: `✅ Solicitação enviada para ${professionalName} — PetApoio`,
      html: patientHtml,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[book-session] Error:', error)
    return NextResponse.json({ error: 'Erro ao enviar solicitação' }, { status: 500 })
  }
}
