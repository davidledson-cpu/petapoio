'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth'
import { fail, invalid, type FormState } from '@/lib/form-state'

const optionalText = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null)
const optionalDate = z.union([z.iso.date(), z.literal('')]).optional().transform((v) => v || null)

const petSchema = z.object({
  name: z.string().trim().min(1, { error: 'Qual o nome do seu pet?' }).max(60),
  species: z.enum(['cao', 'gato', 'outros']),
  breed: optionalText(60),
  birth_date: optionalDate,
  weight_kg: z
    .string()
    .trim()
    .optional()
    .transform((v, ctx) => {
      if (!v) return null
      const n = Number(v.replace(',', '.'))
      if (!Number.isFinite(n) || n <= 0 || n > 150) {
        ctx.addIssue({ code: 'custom', message: 'Informe o peso em kg, por exemplo 12,5.' })
        return z.NEVER
      }
      return n
    }),
  notes: optionalText(1000),
})

export async function addPet(_prev: FormState, form: FormData): Promise<FormState> {
  await requireSession(undefined, '/painel/pets')
  const parsed = petSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  const supabase = await createClient()
  const { data, error } = await supabase.from('pets').insert(parsed.data).select('id').single()
  if (error) {
    console.error('add pet failed', error.code, error.message)
    return fail('Não conseguimos salvar agora. Tente de novo em alguns minutos.')
  }
  revalidatePath('/painel', 'layout')
  redirect(`/painel/pets/${data.id}`)
}

const eventSchema = z
  .object({
    pet_id: z.guid(),
    kind: z.enum(['vacina', 'vermifugo', 'consulta', 'exame', 'medicamento', 'outro']),
    title: z.string().trim().min(2, { error: 'Descreva em poucas palavras, ex.: V10, check-up.' }).max(120),
    occurred_on: z.iso.date({ error: 'Informe a data.' }),
    next_due_on: optionalDate,
    notes: optionalText(1000),
  })
  .refine((v) => !v.next_due_on || v.next_due_on >= v.occurred_on, {
    error: 'O próximo lembrete deve ser depois da data do registro.',
    path: ['next_due_on'],
  })

export async function addHealthEvent(_prev: FormState, form: FormData): Promise<FormState> {
  await requireSession(undefined, '/painel/pets')
  const parsed = eventSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  const supabase = await createClient()
  const { error } = await supabase.from('pet_health_events').insert(parsed.data)
  if (error) {
    console.error('add event failed', error.code, error.message)
    return fail('Não conseguimos salvar o registro.')
  }
  revalidatePath(`/painel/pets/${parsed.data.pet_id}`)
  revalidatePath('/painel')
  return { status: 'success', message: 'Registro salvo.' }
}

export async function deleteHealthEvent(form: FormData) {
  await requireSession(undefined, '/painel/pets')
  const id = z.coerce.number().int().parse(form.get('id'))
  const petId = z.guid().parse(form.get('pet_id'))
  const supabase = await createClient()
  await supabase.from('pet_health_events').delete().eq('id', id)
  revalidatePath(`/painel/pets/${petId}`)
}

export async function deletePet(form: FormData) {
  await requireSession(undefined, '/painel/pets')
  const id = z.guid().parse(form.get('id'))
  const supabase = await createClient()
  await supabase.from('pets').delete().eq('id', id)
  revalidatePath('/painel', 'layout')
  redirect('/painel/pets')
}
