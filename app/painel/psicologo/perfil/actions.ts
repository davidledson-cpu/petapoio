'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth'
import { fail, invalid, type FormState } from '@/lib/form-state'
import { UFS } from '@/lib/ufs'

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Use no máximo ${max} caracteres.` })
    .transform((v) => (v ? v : null))

const list = (maxItems: number) =>
  z
    .string()
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.slice(0, 40)),
    )
    .refine((arr) => arr.length <= maxItems, { error: `Use no máximo ${maxItems} itens.` })

const checkbox = z
  .literal('on')
  .optional()
  .transform((v) => v === 'on')

const schema = z
  .object({
    headline: text(140),
    bio: text(3000),
    education: text(1500),
    approach: text(120),
    specialties: list(10),
    languages: list(5),
    serves_children: checkbox,
    serves_families: checkbox,
    pet_grief_experience: checkbox,
    modality: z.enum(['online', 'presencial', 'ambos'], { error: 'Escolha a modalidade.' }),
    city: text(80),
    state: z
      .string()
      .optional()
      .transform((v) => (v && (UFS as readonly string[]).includes(v) ? v : null)),
    price: z
      .string()
      .trim()
      .transform((v, ctx) => {
        if (!v) return null
        const n = Number(v.replace(/\./g, '').replace(',', '.'))
        if (!Number.isFinite(n) || n < 50 || n > 1000) {
          ctx.addIssue({ code: 'custom', message: 'Informe um valor entre R$ 50 e R$ 1.000.' })
          return z.NEVER
        }
        return Math.round(n * 100)
      }),
    session_minutes: z.coerce.number().int().min(30, { error: 'Mínimo de 30 minutos.' }).max(120, { error: 'Máximo de 120 minutos.' }),
    meeting_url: z
      .string()
      .trim()
      .transform((v) => (v ? v : null))
      .refine((v) => v === null || /^https:\/\/\S+\.\S+/.test(v), { error: 'Use um link completo, começando com https://' }),
  })
  .refine((v) => v.modality === 'online' || (v.city && v.state), {
    error: 'Para atendimento presencial, informe cidade e estado.',
    path: ['city'],
  })

export async function saveProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const session = await requireSession(['psicologo'], '/painel/psicologo/perfil')
  const parsed = schema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)

  const { price, ...rest } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase
    .from('psychologists')
    .update({ ...rest, languages: rest.languages.length ? rest.languages : ['Português'], session_price_cents: price })
    .eq('id', session.userId)

  if (error) {
    console.error('saveProfile failed', error.code, error.message)
    return fail('Não conseguimos salvar. Tente de novo em alguns minutos.')
  }

  const name = String(form.get('full_name') ?? '').trim()
  if (name.length >= 3 && name !== session.profile.full_name) {
    await supabase.from('profiles').update({ full_name: name.slice(0, 120) }).eq('id', session.userId)
  }

  revalidatePath('/painel/psicologo', 'layout')
  return { status: 'success', message: 'Perfil salvo.' }
}
