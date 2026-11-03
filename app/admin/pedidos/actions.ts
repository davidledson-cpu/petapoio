'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { fail, invalid, type FormState } from '@/lib/form-state'

const schema = z.object({
  id: z.uuid(),
  status: z.enum(['aguardando_pagamento', 'pago', 'em_producao', 'enviado', 'entregue', 'cancelado'], { error: 'Escolha o status.' }),
  tracking_code: z.string().trim().max(60).optional(),
})

export async function updateOrder(_prev: FormState, form: FormData): Promise<FormState> {
  await requireSession(['admin'], '/admin/pedidos')
  const parsed = schema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  const { id, status, tracking_code } = parsed.data
  if (status === 'enviado' && !tracking_code) {
    return { status: 'error', message: 'Informe o código de rastreio para marcar como enviado.', fieldErrors: { tracking_code: 'Obrigatório ao enviar.' } }
  }

  const supabase = await createClient()
  const patch: Record<string, unknown> = { status, tracking_code: tracking_code || null, updated_at: new Date().toISOString() }
  if (status === 'pago') patch.paid_at = new Date().toISOString()
  const { data, error } = await supabase.from('orders').update(patch).eq('id', id).select('id, user_id, code').single()
  if (error || !data) {
    console.error('order update failed', error?.message)
    return fail('Não conseguimos atualizar o pedido.')
  }
  revalidatePath('/admin/pedidos')
  revalidatePath(`/admin/pedidos/${id}`)
  return { status: 'success', message: 'Pedido atualizado.' }
}
