'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth'
import { fail, invalid, type FormState } from '@/lib/form-state'

const time = z.string().regex(/^\d{2}:\d{2}$/, { error: 'Use o formato 09:00.' })

const slotSchema = z
  .object({
    weekday: z.coerce.number().int().min(0).max(6),
    start_time: time,
    end_time: time,
  })
  .refine((v) => v.end_time > v.start_time, { error: 'O fim precisa ser depois do início.', path: ['end_time'] })

export async function addSlot(_prev: FormState, form: FormData): Promise<FormState> {
  const session = await requireSession(['psicologo'], '/painel/psicologo/horarios')
  const parsed = slotSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  const { weekday, start_time, end_time } = parsed.data

  const supabase = await createClient()
  const { data: sameDay } = await supabase
    .from('availability')
    .select('start_time, end_time')
    .eq('psychologist_id', session.userId)
    .eq('weekday', weekday)
  const overlaps = (sameDay ?? []).some((s) => start_time < s.end_time.slice(0, 5) && end_time > s.start_time.slice(0, 5))
  if (overlaps) return fail('Esse horário se sobrepõe a outro já cadastrado no mesmo dia.')

  const { error } = await supabase.from('availability').insert({ psychologist_id: session.userId, weekday, start_time, end_time })
  if (error) {
    console.error('addSlot failed', error.code, error.message)
    return fail('Não conseguimos salvar o horário. Seu perfil profissional já foi criado? Abra a visão geral e tente de novo.')
  }
  revalidatePath('/painel/psicologo', 'layout')
  return { status: 'success', message: 'Horário adicionado.' }
}

export async function removeSlot(form: FormData) {
  const session = await requireSession(['psicologo'], '/painel/psicologo/horarios')
  const id = Number(form.get('id'))
  if (!Number.isInteger(id)) return
  const supabase = await createClient()
  await supabase.from('availability').delete().eq('id', id).eq('psychologist_id', session.userId)
  revalidatePath('/painel/psicologo', 'layout')
}

/** Converte "2026-11-20T09:00" (hora de São Paulo) em ISO. O Brasil não tem horário de verão desde 2019. */
function spToIso(local: string) {
  return new Date(`${local}:00-03:00`).toISOString()
}

const offSchema = z
  .object({
    starts_at: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, { error: 'Informe data e hora de início.' }),
    ends_at: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, { error: 'Informe data e hora de fim.' }),
    reason: z.string().trim().max(120).optional(),
  })
  .refine((v) => v.ends_at > v.starts_at, { error: 'O fim precisa ser depois do início.', path: ['ends_at'] })

export async function addTimeOff(_prev: FormState, form: FormData): Promise<FormState> {
  const session = await requireSession(['psicologo'], '/painel/psicologo/horarios')
  const parsed = offSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  const supabase = await createClient()
  const { error } = await supabase.from('time_off').insert({
    psychologist_id: session.userId,
    starts_at: spToIso(parsed.data.starts_at),
    ends_at: spToIso(parsed.data.ends_at),
    reason: parsed.data.reason || null,
  })
  if (error) {
    console.error('addTimeOff failed', error.code, error.message)
    return fail('Não conseguimos salvar o bloqueio. Tente de novo.')
  }
  revalidatePath('/painel/psicologo', 'layout')
  return {
    status: 'success',
    message: 'Bloqueio salvo. Sessões já confirmadas nesse período continuam valendo: cancele pela agenda, se precisar.',
  }
}

export async function removeTimeOff(form: FormData) {
  const session = await requireSession(['psicologo'], '/painel/psicologo/horarios')
  const id = Number(form.get('id'))
  if (!Number.isInteger(id)) return
  const supabase = await createClient()
  await supabase.from('time_off').delete().eq('id', id).eq('psychologist_id', session.userId)
  revalidatePath('/painel/psicologo', 'layout')
}
