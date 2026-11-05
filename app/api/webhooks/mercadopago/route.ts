import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPayment, getSellerToken, verifyWebhookSignature } from '@/lib/mercadopago'

/**
 * Notificações de pagamento do Mercado Pago.
 * A URL carrega ?kind=appointment&id=<uuid> ou ?kind=order&id=<uuid>, definida ao criar a preferência.
 * Nunca confiamos no corpo da notificação: consultamos o pagamento na API com o token certo.
 */
export async function POST(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const kind = params.get('kind')
  const refId = params.get('id')
  const body = (await req.json().catch(() => ({}))) as { type?: string; data?: { id?: string | number } }
  const paymentId = String(params.get('data.id') ?? body.data?.id ?? '')
  const type = params.get('type') ?? body.type

  if (type && type !== 'payment') return NextResponse.json({ ignored: true })
  if (!paymentId || !refId || (kind !== 'appointment' && kind !== 'order')) {
    return NextResponse.json({ ignored: true })
  }
  if (!verifyWebhookSignature(req, paymentId)) {
    return NextResponse.json({ error: 'assinatura inválida' }, { status: 401 })
  }

  const admin = createAdminClient()

  try {
    if (kind === 'appointment') {
      const { data: appt } = await admin.from('appointments').select('*').eq('id', refId).single()
      if (!appt) return NextResponse.json({ ignored: true })
      const token = await getSellerToken(appt.psychologist_id)
      const payment = await getPayment(paymentId, token)
      if (payment.external_reference !== `appointment:${refId}`) {
        return NextResponse.json({ error: 'referência não confere' }, { status: 400 })
      }

      if (payment.status === 'approved' && appt.status !== 'confirmado' && appt.status !== 'concluido') {
        // Pagou depois de a reserva expirar: confirma se o horário continua livre.
        const { error } = await admin
          .from('appointments')
          .update({ status: 'confirmado', paid_at: new Date().toISOString(), mp_payment_id: String(payment.id), hold_expires_at: null })
          .eq('id', refId)
        if (error) {
          console.error('appointment confirm failed; manual refund needed', refId, error.message)
          await admin.from('notifications').insert({
            user_id: appt.patient_id,
            title: 'Precisamos falar sobre seu pagamento',
            body: 'O horário escolhido não estava mais livre. Nossa equipe vai devolver o valor ou remarcar com você.',
            link: '/painel/sessoes',
          })
        }
      } else if (['refunded', 'charged_back'].includes(payment.status)) {
        await admin
          .from('appointments')
          .update({ status: 'cancelado', cancelled_by: 'sistema', cancelled_at: new Date().toISOString(), refunded_at: new Date().toISOString() })
          .eq('id', refId)
      }
      return NextResponse.json({ ok: true })
    }

    // Pedido da loja: token da própria PetApoio.
    const token = process.env.MP_ACCESS_TOKEN
    if (!token) return NextResponse.json({ error: 'MP_ACCESS_TOKEN ausente' }, { status: 500 })
    const payment = await getPayment(paymentId, token)
    if (payment.external_reference !== `order:${refId}`) {
      return NextResponse.json({ error: 'referência não confere' }, { status: 400 })
    }
    if (payment.status === 'approved') {
      await admin
        .from('orders')
        .update({ status: 'pago', paid_at: new Date().toISOString(), mp_payment_id: String(payment.id) })
        .eq('id', refId)
        .eq('status', 'aguardando_pagamento')
    } else if (['refunded', 'charged_back', 'cancelled'].includes(payment.status)) {
      await admin.from('orders').update({ status: 'cancelado' }).eq('id', refId)
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('webhook failed', kind, refId, err)
    // 500 faz o Mercado Pago tentar de novo mais tarde.
    return NextResponse.json({ error: 'erro ao processar' }, { status: 500 })
  }
}
