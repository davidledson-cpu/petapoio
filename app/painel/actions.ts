'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireSession } from '@/lib/auth'
import { getSellerToken, refundPayment } from '@/lib/mercadopago'
import { fail, invalid, type FormState } from '@/lib/form-state'
import type { Appointment } from '@/types/db'

/** Paciente cancela. Se pagou e falta 24h ou mais (configurável), devolve o valor. */
export async function cancelMySession(form: FormData) {
  const id = z.uuid().parse(form.get('id'))
  await requireSession(undefined, '/painel/sessoes')
  const supabase = await createClient()
  const { data: before } = await supabase.from('appointments').select('*').eq('id', id).single<Appointment>()
  const { error } = await supabase.rpc('cancel_appointment', { p_id: id })
  if (error) redirect(`/painel/sessoes?erro=${encodeURIComponent(error.message)}`)

  if (before?.status === 'confirmado' && before.mp_payment_id) {
    const { data: cfg } = await supabase.from('platform_settings').select('cancel_refund_hours').single<{ cancel_refund_hours: number }>()
    const hoursLeft = (new Date(before.starts_at).getTime() - Date.now()) / 3600_000
    if (hoursLeft >= (cfg?.cancel_refund_hours ?? 24)) {
      let refunded = false
      try {
        await refundPayment(before.mp_payment_id, await getSellerToken(before.psychologist_id))
        await createAdminClient().from('appointments').update({ refunded_at: new Date().toISOString() }).eq('id', id)
        refunded = true
      } catch (err) {
        console.error('refund failed', id, err)
      }
      redirect(refunded ? '/painel/sessoes?ok=reembolso' : '/painel/sessoes?erro=reembolso')
    }
    redirect('/painel/sessoes?ok=sem-reembolso')
  }
  revalidatePath('/painel/sessoes')
  redirect('/painel/sessoes?ok=cancelada')
}

export async function markNotificationsRead() {
  const { userId } = await requireSession()
  const supabase = await createClient()
  await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', userId).is('read_at', null)
  revalidatePath('/painel/notificacoes')
}

const profileSchema = z.object({
  full_name: z.string().trim().min(3, { error: 'Informe seu nome.' }).max(120),
  phone: z.string().trim().max(30).transform((v) => v || null),
})

export async function updateMyProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  const { userId } = await requireSession()
  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update(parsed.data).eq('id', userId)
  if (error) return fail('Não conseguimos salvar. Tente de novo.')
  revalidatePath('/painel', 'layout')
  return { status: 'success', message: 'Dados salvos.' }
}
