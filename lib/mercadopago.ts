import 'server-only'
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { decrypt, encrypt } from '@/lib/crypto'
import { site } from '@/lib/site'

/**
 * Mercado Pago — Checkout Pro com split (modelo marketplace).
 *
 * Sessões: a preferência é criada com o token do PSICÓLOGO (obtido por OAuth) e um
 * `marketplace_fee` com a comissão da PetApoio. O dinheiro cai direto na conta do
 * psicólogo, e a comissão na conta da PetApoio, no momento do pagamento.
 *
 * Loja: a preferência é criada com o token da própria PetApoio (MP_ACCESS_TOKEN).
 */

const API = 'https://api.mercadopago.com'

type PreferenceInput = {
  accessToken: string
  externalReference: string
  title: string
  amountCents: number
  quantity?: number
  payerEmail?: string
  marketplaceFeeCents?: number
  expiresAt?: Date
  backPath: string
  notificationQuery: string
}

export async function createPreference(input: PreferenceInput) {
  const back = `${site.url}${input.backPath}`
  const body: Record<string, unknown> = {
    items: [
      {
        id: input.externalReference,
        title: input.title,
        quantity: input.quantity ?? 1,
        unit_price: Number((input.amountCents / 100).toFixed(2)),
        currency_id: 'BRL',
      },
    ],
    external_reference: input.externalReference,
    notification_url: `${site.url}/api/webhooks/mercadopago?${input.notificationQuery}`,
    back_urls: { success: back, pending: back, failure: back },
    auto_return: 'approved',
    statement_descriptor: 'PETAPOIO',
    payment_methods: { installments: 6 },
  }
  if (input.payerEmail) body.payer = { email: input.payerEmail }
  if (input.marketplaceFeeCents != null) body.marketplace_fee = Number((input.marketplaceFeeCents / 100).toFixed(2))
  if (input.expiresAt) {
    body.expires = true
    body.expiration_date_to = input.expiresAt.toISOString()
    body.date_of_expiration = input.expiresAt.toISOString() // vale também para o Pix
  }

  const res = await fetch(`${API}/checkout/preferences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${input.accessToken}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': randomUUID(),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    console.error('mp preference failed', res.status, await res.text())
    throw new Error('Não foi possível iniciar o pagamento.')
  }
  const data = (await res.json()) as { id: string; init_point: string }
  return { id: data.id, url: data.init_point }
}

export type MpPayment = {
  id: number
  status: 'approved' | 'pending' | 'in_process' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back' | string
  external_reference: string | null
  transaction_amount: number
}

export async function getPayment(paymentId: string, accessToken: string): Promise<MpPayment> {
  const res = await fetch(`${API}/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Pagamento ${paymentId} não encontrado (${res.status}).`)
  return res.json()
}

export async function refundPayment(paymentId: string, accessToken: string) {
  const res = await fetch(`${API}/v1/payments/${encodeURIComponent(paymentId)}/refunds`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'X-Idempotency-Key': `refund-${paymentId}` },
  })
  if (!res.ok) throw new Error(`Reembolso falhou (${res.status}).`)
}

/** Verifica a assinatura x-signature enviada pelo Mercado Pago. */
export function verifyWebhookSignature(req: Request, dataId: string) {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) return process.env.NODE_ENV !== 'production'
  const header = req.headers.get('x-signature') ?? ''
  const requestId = req.headers.get('x-request-id') ?? ''
  const parts = Object.fromEntries(header.split(',').map((p) => p.trim().split('=') as [string, string]))
  if (!parts.ts || !parts.v1) return false
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(parts.v1)
  return a.length === b.length && timingSafeEqual(a, b)
}

// ─── OAuth do split: conectar a conta do psicólogo ───────────────────────────

export function oauthRedirectUri() {
  return `${site.url}/api/mercadopago/oauth/callback`
}

export function oauthAuthorizeUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.MP_CLIENT_ID ?? '',
    response_type: 'code',
    platform_id: 'mp',
    state,
    redirect_uri: oauthRedirectUri(),
  })
  return `https://auth.mercadopago.com.br/authorization?${params}`
}

type TokenResponse = { access_token: string; refresh_token: string; user_id: number; expires_in: number }

async function tokenRequest(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(`${API}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.MP_CLIENT_ID,
      client_secret: process.env.MP_CLIENT_SECRET,
      ...body,
    }),
  })
  if (!res.ok) {
    console.error('mp oauth failed', res.status, await res.text())
    throw new Error('Não foi possível conectar a conta do Mercado Pago.')
  }
  return res.json()
}

export async function connectSellerAccount(psychologistId: string, code: string) {
  const token = await tokenRequest({ grant_type: 'authorization_code', code, redirect_uri: oauthRedirectUri() })
  const admin = createAdminClient()
  const { error } = await admin.from('psychologist_payment_accounts').upsert({
    psychologist_id: psychologistId,
    mp_user_id: String(token.user_id),
    access_token_enc: encrypt(token.access_token),
    refresh_token_enc: encrypt(token.refresh_token),
    expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
    connected_at: new Date().toISOString(),
  })
  if (error) throw error
  await admin.from('psychologists').update({ mp_connected: true }).eq('id', psychologistId)
}

/** Token válido do psicólogo, renovado automaticamente quando faltar menos de 7 dias. */
export async function getSellerToken(psychologistId: string) {
  const admin = createAdminClient()
  const { data: acc } = await admin
    .from('psychologist_payment_accounts')
    .select('*')
    .eq('psychologist_id', psychologistId)
    .single()
  if (!acc) throw new Error('Conta do Mercado Pago não conectada.')

  if (new Date(acc.expires_at).getTime() - Date.now() > 7 * 86400_000) return decrypt(acc.access_token_enc)

  const token = await tokenRequest({ grant_type: 'refresh_token', refresh_token: decrypt(acc.refresh_token_enc) })
  await admin
    .from('psychologist_payment_accounts')
    .update({
      access_token_enc: encrypt(token.access_token),
      refresh_token_enc: encrypt(token.refresh_token),
      expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
    })
    .eq('psychologist_id', psychologistId)
  return token.access_token
}

export async function disconnectSellerAccount(psychologistId: string) {
  const admin = createAdminClient()
  await admin.from('psychologist_payment_accounts').delete().eq('psychologist_id', psychologistId)
  await admin.from('psychologists').update({ mp_connected: false }).eq('id', psychologistId)
}
