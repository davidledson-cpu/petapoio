'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isMercadoPagoConfigured, isSupabaseConfigured } from '@/lib/env'
import { createPreference } from '@/lib/mercadopago'
import { fail, invalid, NOT_CONFIGURED } from '@/lib/form-state'
import { UFS } from '@/lib/ufs'
import type { CheckoutState } from '@/lib/loja/checkout-state'
import type { Order } from '@/types/db'

const PHOTO_PATH = /^pendentes\/[0-9a-f-]{36}\.(jpg|png|webp|heic)$/

const itemsSchema = z
  .array(
    z.object({
      product_id: z.uuid(),
      quantity: z.number().int().min(1).max(10),
      name: z.string().trim().max(60).optional(),
      photo: z.string().regex(PHOTO_PATH).optional(),
    }),
  )
  .min(1, { error: 'Seu carrinho está vazio.' })
  .max(20)

const checkoutSchema = z.object({
  full_name: z.string().trim().min(3, { error: 'Informe o nome completo de quem vai receber.' }).max(120),
  email: z.email({ error: 'Confira o e-mail.' }).max(254).trim().toLowerCase(),
  phone: z.string().trim().max(30).optional(),
  cep: z.string().trim().regex(/^\d{5}-?\d{3}$/, { error: 'Use o formato 00000-000.' }),
  street: z.string().trim().min(2, { error: 'Informe a rua.' }).max(120),
  number: z.string().trim().min(1, { error: 'Informe o número (ou "s/n").' }).max(20),
  complement: z.string().trim().max(60).optional(),
  district: z.string().trim().min(2, { error: 'Informe o bairro.' }).max(80),
  city: z.string().trim().min(2, { error: 'Informe a cidade.' }).max(80),
  state: z.enum(UFS, { error: 'Escolha o estado.' }),
  consent: z.literal('on', { error: 'Para continuar, aceite os termos e a política de privacidade.' }),
})

/** Cria a preferência de pagamento do pedido e grava o id. Retorna a URL do Mercado Pago. */
async function startPayment(order: Pick<Order, 'id' | 'code' | 'email' | 'total_cents'>) {
  const pref = await createPreference({
    accessToken: process.env.MP_ACCESS_TOKEN!,
    externalReference: `order:${order.id}`,
    notificationQuery: `kind=order&id=${order.id}`,
    backPath: `/loja/pedido/${order.code}?ref=${order.id}`,
    title: `Pedido PetApoio ${order.code}`,
    amountCents: order.total_cents,
    payerEmail: order.email,
  })
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    await createAdminClient().from('orders').update({ mp_preference_id: pref.id }).eq('id', order.id)
  }
  return pref.url
}

export async function placeOrder(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)

  let rawItems: unknown
  try {
    rawItems = JSON.parse(String(form.get('items') ?? '[]'))
  } catch {
    rawItems = []
  }
  const items = itemsSchema.safeParse(rawItems)
  if (!items.success) return fail('Não encontramos os itens do carrinho. Volte ao carrinho e tente de novo.')
  if (!isSupabaseConfigured()) return NOT_CONFIGURED

  const d = parsed.data
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('create_order', {
    p_items: items.data,
    p_email: d.email,
    p_full_name: d.full_name,
    p_phone: d.phone ?? '',
    p_address: {
      cep: d.cep,
      street: d.street,
      number: d.number,
      complement: d.complement ?? '',
      district: d.district,
      city: d.city,
      state: d.state,
    },
  })
  if (error || !data) {
    console.error('create_order failed', error?.message)
    // As mensagens da função são escritas para a pessoa (ex.: produto indisponível).
    return fail(error?.message && /[áéíóúãõç]/i.test(error.message) ? error.message : 'Não conseguimos registrar o pedido. Tente de novo.')
  }
  const order = data as Order
  const orderPage = `/loja/pedido/${order.code}?ref=${order.id}`

  if (!isMercadoPagoConfigured()) return { status: 'success', redirectTo: orderPage }

  try {
    return { status: 'success', redirectTo: await startPayment(order) }
  } catch {
    // O pedido existe; a pessoa pode tentar pagar de novo pela página do pedido.
    return { status: 'success', redirectTo: `${orderPage}&pagamento=erro` }
  }
}

/** "Pagar agora" na página do pedido: gera uma nova preferência e redireciona. */
export async function payOrder(form: FormData) {
  const id = String(form.get('id') ?? '')
  const code = String(form.get('code') ?? '')
  if (!z.uuid().safeParse(id).success || !process.env.SUPABASE_SERVICE_ROLE_KEY || !isMercadoPagoConfigured()) {
    redirect('/loja')
  }
  const { data } = await createAdminClient()
    .from('orders')
    .select('id, code, email, total_cents, status')
    .eq('id', id)
    .eq('code', code)
    .maybeSingle()
  if (!data || data.status !== 'aguardando_pagamento') redirect(`/loja/pedido/${code}?ref=${id}`)
  let url: string
  try {
    url = await startPayment(data)
  } catch {
    redirect(`/loja/pedido/${code}?ref=${id}&pagamento=erro`)
  }
  redirect(url)
}
