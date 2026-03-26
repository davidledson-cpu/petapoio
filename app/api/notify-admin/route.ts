import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'david.ledson@gmail.com'

export async function POST(request: NextRequest) {
    try {
          const body = await request.json()
          const { name, email, role, petName, petSpecies, lossType, crp } = body

          const roleLabel = role === 'professional' ? '🩺 Psicólogo(a)' : '🐾 Paciente'
          const speciesMap: Record<string, string> = {
                  dog: 'Cão', cat: 'Gato', bird: 'Pássaro', other: 'Outro',
                }
          const lossMap: Record<string, string> = {
                  death: 'Falecimento', disappearance: 'Desaparecimento',
                  separation: 'Separação familiar', other: 'Outro motivo',
                }

          const resendKey = process.env.RESEND_API_KEY
          if (!resendKey) {
                  console.log(`[PetApoio] Novo cadastro (sem Resend): ${name} <${email}> — ${roleLabel}`)
                  return NextResponse.json({ ok: true, note: 'RESEND_API_KEY not configured' })
                }

          const { Resend } = await import('resend')
          const resend = new Resend(resendKey)

          const fromEmail = process.env.RESEND_FROM_EMAIL || 'PetApoio <onboarding@resend.dev>'

          const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px;">
        <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
          <div style="background:linear-gradient(135deg,#2C5F7A,#6BA3BE);padding:28px 32px;">
            <p style="color:#fff;font-size:22px;font-weight:bold;margin:0;">🐾 PetApoio — Novo Cadastro</p>
          </div>
          <div style="padding:32px;">
            <p style="color:#444;margin-top:0;">Olá, David! Um novo usuário se cadastrou na plataforma:</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr style="background:#f0f7fb;">
                <td style="padding:10px 14px;font-weight:bold;color:#2C5F7A;width:40%;">Tipo</td>
                <td style="padding:10px 14px;">${roleLabel}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;font-weight:bold;color:#2C5F7A;">Nome</td>
                <td style="padding:10px 14px;">${name}</td>
              </tr>
              <tr style="background:#f0f7fb;">
                <td style="padding:10px 14px;font-weight:bold;color:#2C5F7A;">E-mail</td>
                <td style="padding:10px 14px;"><a href="mailto:${email}" style="color:#4d87a5;">${email}</a></td>
              </tr>
              ${crp ? `<tr><td style="padding:10px 14px;font-weight:bold;color:#2C5F7A;">CRP</td><td style="padding:10px 14px;">${crp}</td></tr>` : ''}
              ${petName ? `<tr style="background:#f0f7fb;"><td style="padding:10px 14px;font-weight:bold;color:#2C5F7A;">Pet</td><td style="padding:10px 14px;">${petName} (${speciesMap[petSpecies] || petSpecies})</td></tr>` : ''}
              ${lossType ? `<tr><td style="padding:10px 14px;font-weight:bold;color:#2C5F7A;">Perda</td><td style="padding:10px 14px;">${lossMap[lossType] || lossType}</td></tr>` : ''}
              <tr style="background:#f0f7fb;">
                <td style="padding:10px 14px;font-weight:bold;color:#2C5F7A;">Data</td>
                <td style="padding:10px 14px;">${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
              </tr>
            </table>
            <div style="margin-top:24px;padding:16px;background:#fff3cd;border-radius:8px;border-left:4px solid #f0a500;">
              <p style="margin:0;font-size:13px;color:#856404;">
                O usuário já tem acesso à plataforma. Para visualizar todos os cadastros, acesse o painel de admin.
              </p>
            </div>
            <a href="https://petapoio.vercel.app/dashboard/admin" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#2C5F7A;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">
              Ver Painel Admin
            </a>
          </div>
          <div style="padding:16px 32px;background:#f9f9f9;text-align:center;">
            <p style="margin:0;font-size:11px;color:#999;">© 2026 PetApoio · petapoio.vercel.app</p>
          </div>
        </div>
      </body>
      </html>`

          await resend.emails.send({
                  from: fromEmail,
                  to: ADMIN_EMAIL,
                  subject: `🐾 Novo cadastro PetApoio: ${name} (${role === 'professional' ? 'Psicólogo' : 'Paciente'})`,
                  html,
                })

          return NextResponse.json({ ok: true })
        } catch (err) {
          console.error('[notify-admin] error:', err)
          return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
        }
  }
