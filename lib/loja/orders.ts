import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { getSession } from '@/lib/auth'
import type { Order, OrderItem, OrderStatus } from '@/types/db'

export const ORDER_STEPS: { status: OrderStatus; label: string; text: string }[] = [
  { status: 'aguardando_pagamento', label: 'Pedido registrado', text: 'Recebemos seu pedido.' },
  { status: 'pago', label: 'Pagamento aprovado', text: 'O Mercado Pago confirmou o pagamento.' },
  { status: 'em_producao', label: 'Em produção', text: 'Sua peça está sendo feita com cuidado.' },
  { status: 'enviado', label: 'Enviado', text: 'O pedido saiu para entrega.' },
  { status: 'entregue', label: 'Entregue', text: 'O pedido chegou ao destino.' },
]

/**
 * Carrega um pedido para a página de acompanhamento. Pode ver: quem tem o link com ?ref=<id>,
 * o dono logado ou a administração. Retorna null se não houver permissão.
 */
export async function loadOrderForTracking(code: string, ref: string | undefined) {
  if (!isSupabaseConfigured() || !/^[A-F0-9]{8}$/.test(code)) return null

  type Row = Order & { order_items: OrderItem[] }
  const select = '*, order_items(*)'

  // 1. Dono ou admin, pela RLS.
  const session = await getSession()
  if (session) {
    const supabase = await createClient()
    const { data } = await supabase.from('orders').select(select).eq('code', code).maybeSingle()
    if (data) return data as Row
  }

  // 2. Link do e-mail/retorno do pagamento: exige o id completo do pedido.
  if (ref && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data } = await createAdminClient().from('orders').select(select).eq('code', code).eq('id', ref).maybeSingle()
    if (data) return data as Row
  }
  return null
}
