'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth'
import { fail, invalid, type FormState } from '@/lib/form-state'

const reais = (min: number, max: number) =>
  z.coerce.number({ error: 'Informe um número.' }).min(min).max(max).transform((v) => Math.round(v * 100))

const settingsSchema = z.object({
  platform_fee_percent: z.coerce.number().min(0, { error: 'Mínimo 0%.' }).max(50, { error: 'Máximo 50%.' }),
  care_fee_percent: z.coerce.number().min(0, { error: 'Mínimo 0%.' }).max(40, { error: 'Máximo 40%.' }),
  booking_hold_minutes: z.coerce.number().int().min(5).max(120),
  min_notice_hours: z.coerce.number().int().min(0).max(168),
  cancel_refund_hours: z.coerce.number().int().min(0).max(168),
  shipping_flat_cents: reais(0, 500),
  free_shipping_from_cents: reais(0, 5000),
})

export async function saveSettings(_prev: FormState, form: FormData): Promise<FormState> {
  await requireSession(['admin'], '/admin/configuracoes')
  const parsed = settingsSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  const supabase = await createClient()
  const { error } = await supabase.from('platform_settings').update({ ...parsed.data, updated_at: new Date().toISOString() }).eq('id', true)
  if (error) return fail('Não conseguimos salvar as configurações.')
  revalidatePath('/', 'layout')
  return { status: 'success', message: 'Configurações salvas. Valem para novos agendamentos e pedidos.' }
}

export async function setRole(form: FormData) {
  await requireSession(['admin'], '/admin/usuarios')
  const id = z.uuid().parse(form.get('id'))
  const role = z.enum(['paciente', 'psicologo', 'admin']).parse(form.get('role'))
  const supabase = await createClient()
  await supabase.from('profiles').update({ role }).eq('id', id)
  revalidatePath('/admin/usuarios')
}

export async function adminCancelSession(form: FormData) {
  await requireSession(['admin'], '/admin/sessoes')
  const id = z.uuid().parse(form.get('id'))
  const supabase = await createClient()
  await supabase.rpc('cancel_appointment', { p_id: id })
  revalidatePath('/admin/sessoes')
}
