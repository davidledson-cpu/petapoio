'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireSession } from '@/lib/auth'
import { getSellerToken, refundPayment } from '@/lib/mercadopago'
import type { Appointment } from '@/types/db'

function back(params: Record<string, string>): never {
  redirect(`/painel/psicologo/agenda?${new URLSearchParams(params)}`)
}

/** Cancelamento pelo psicólogo: o paciente sempre recebe o valor integral de volta. */
export async function cancelByPsychologist(form: FormData) {
  const session = await requireSession(['psicologo'], '/painel/psicologo/agenda')
  const id = String(form.get('id') ?? '')
  const supabase = await createClient()

  const { data: appt, error } = await supabase.rpc('cancel_appointment', { p_id: id }).single<Appointment>()
  if (error || !appt) back({ erro: error?.message ?? 'Não foi possível cancelar.' })

  revalidatePath('/painel/psicologo', 'layout')
  if (appt.paid_at && appt.mp_payment_id && !appt.refunded_at) {
    try {
      await refundPayment(appt.mp_payment_id, await getSellerToken(session.userId))
      await createAdminClient().from('appointments').update({ refunded_at: new Date().toISOString() }).eq('id', appt.id)
    } catch (e) {
      console.error('refund failed', appt.id, e)
      back({
        aviso:
          'Sessão cancelada, mas o reembolso automático falhou. Escreva para contato@petapoio.com.br para concluirmos a devolução ao paciente.',
      })
    }
    back({ ok: 'Sessão cancelada. O valor foi devolvido ao paciente.' })
  }
  back({ ok: 'Sessão cancelada.' })
}

export async function finishSession(form: FormData) {
  await requireSession(['psicologo'], '/painel/psicologo/agenda')
  const id = String(form.get('id') ?? '')
  const status = form.get('status') === 'nao_compareceu' ? 'nao_compareceu' : 'concluido'
  const supabase = await createClient()
  const { error } = await supabase.rpc('finish_appointment', { p_id: id, p_status: status })
  if (error) back({ erro: error.message })
  revalidatePath('/painel/psicologo', 'layout')
  back({ ok: status === 'concluido' ? 'Sessão registrada como realizada.' : 'Ausência registrada.' })
}
