'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { isSplitConfigured, isSupabaseConfigured } from '@/lib/env'
import { createPreference, getSellerToken } from '@/lib/mercadopago'
import { fail, NOT_CONFIGURED, type FormState } from '@/lib/form-state'
import type { Appointment } from '@/types/db'

const bookSchema = z.object({
  psychologist_id: z.uuid(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  starts_at: z.iso.datetime({ offset: true, error: 'Escolha um horário.' }),
})

/** Reserva o horário (no banco) e leva ao pagamento no Mercado Pago com split. */
export async function bookSession(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = bookSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return fail('Escolha um horário para continuar.')
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const { psychologist_id, slug, starts_at } = parsed.data

  const session = await getSession()
  if (!session) {
    redirect(`/entrar?next=${encodeURIComponent(`/psicologos/${slug}?horario=${starts_at}`)}`)
  }
  if (!isSplitConfigured()) {
    return fail('Os pagamentos online estão sendo ativados. Em breve você poderá agendar por aqui.')
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('book_appointment', { p_psychologist: psychologist_id, p_starts_at: starts_at })
  if (error) return fail(error.message)
  const appt = data as Appointment

  const url = await startPayment(appt, session.email)
  if (!url) return fail('Não conseguimos abrir o pagamento agora. Seu horário fica reservado por alguns minutos; tente de novo em "Minhas sessões".')
  redirect(url)
}

/** Gera (ou gera de novo) a cobrança de uma sessão reservada. */
export async function payAppointment(appointmentId: string) {
  const session = await getSession()
  if (!session) redirect('/entrar?next=/painel/sessoes')
  const supabase = await createClient()
  const { data: appt } = await supabase.from('appointments').select('*').eq('id', appointmentId).single<Appointment>()
  if (!appt || appt.patient_id !== session.userId || appt.status !== 'aguardando_pagamento') {
    redirect('/painel/sessoes')
  }
  if (appt.hold_expires_at && new Date(appt.hold_expires_at) < new Date()) {
    redirect('/painel/sessoes?erro=expirada')
  }
  const url = await startPayment(appt, session.email)
  redirect(url ?? '/painel/sessoes?erro=pagamento')
}

async function startPayment(appt: Appointment, email: string) {
  try {
    const admin = createAdminClient()
    const { data: ps } = await admin
      .from('psychologist_directory')
      .select('full_name, session_minutes')
      .eq('id', appt.psychologist_id)
      .single<{ full_name: string; session_minutes: number }>()
    const token = await getSellerToken(appt.psychologist_id)
    const pref = await createPreference({
      accessToken: token,
      externalReference: `appointment:${appt.id}`,
      title: `Sessão de ${ps?.session_minutes ?? 50} min com ${ps?.full_name ?? 'psicólogo'} — PetApoio`,
      amountCents: appt.price_cents,
      marketplaceFeeCents: appt.platform_fee_cents,
      payerEmail: email,
      expiresAt: appt.hold_expires_at ? new Date(appt.hold_expires_at) : undefined,
      backPath: `/painel/sessoes?sessao=${appt.id}`,
      notificationQuery: `kind=appointment&id=${appt.id}`,
    })
    await admin.from('appointments').update({ mp_preference_id: pref.id }).eq('id', appt.id)
    return pref.url
  } catch (err) {
    console.error('startPayment failed', appt.id, err)
    return null
  }
}
