'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { getSession } from '@/lib/auth'
import { fail, invalid, NOT_CONFIGURED, type FormState } from '@/lib/form-state'
import { NEIGHBORHOODS } from '@/lib/cuida-shared'

const optionalText = (max: number) =>
  z.string().trim().max(max, { error: `Use no máximo ${max} caracteres.` }).optional().transform((v) => (v ? v : null))

const optionalPrice = z
  .string()
  .trim()
  .optional()
  .transform((v, ctx) => {
    if (!v) return null
    const n = Number(v.replace(/\./g, '').replace(',', '.'))
    if (!Number.isFinite(n) || n < 10 || n > 1000) {
      ctx.addIssue({ code: 'custom', message: 'Informe um valor entre R$ 10 e R$ 1.000.' })
      return z.NEVER
    }
    return Math.round(n * 100)
  })

const checkbox = z.literal('on').optional().transform((v) => v === 'on')

const SERVICE_PRICE = {
  hospedagem: 'price_hosting_cents',
  visita: 'price_visit_cents',
  passeio: 'price_walk_cents',
  creche: 'price_daycare_cents',
} as const

const applySchema = z
  .object({
    full_name: z.string().trim().min(3, { error: 'Informe seu nome completo.' }).max(120),
    email: z.email({ error: 'Confira o e-mail.' }).max(254).trim().toLowerCase(),
    phone: z.string().trim().min(10, { error: 'Informe um telefone com DDD.' }).max(30),
    neighborhood: z.string().refine((v) => v in NEIGHBORHOODS, { error: 'Escolha o bairro onde você atende.' }),
    radius_km: z.coerce.number().int().min(1).max(30),
    services: z.array(z.enum(['hospedagem', 'visita', 'passeio', 'creche', 'especiais'])).min(1, { error: 'Escolha pelo menos um serviço.' }),
    species: z.array(z.enum(['cao', 'gato', 'outros'])).min(1, { error: 'Escolha com quais pets você convive bem.' }),
    pet_sizes: z.array(z.enum(['pequeno', 'medio', 'grande'])).min(1, { error: 'Escolha pelo menos um porte.' }),
    headline: optionalText(160),
    experience: z.string().trim().min(40, { error: 'Conte um pouco mais sobre sua experiência (mínimo de 40 caracteres).' }).max(2000),
    qualifications: optionalText(1000),
    price_hosting_cents: optionalPrice,
    price_visit_cents: optionalPrice,
    price_walk_cents: optionalPrice,
    price_daycare_cents: optionalPrice,
    gives_medication: checkbox,
    accepts_seniors: checkbox,
    accepts_puppies: checkbox,
    has_yard: checkbox,
    consent: z.literal('on', { error: 'Para continuar, aceite os termos e a política de privacidade.' }),
  })
  .superRefine((v, ctx) => {
    for (const s of v.services) {
      const key = s === 'especiais' ? null : SERVICE_PRICE[s]
      if (key && v[key] === null) {
        ctx.addIssue({ code: 'custom', path: [key], message: 'Informe o preço deste serviço.' })
      }
    }
  })

export async function applyCaregiver(_prev: FormState, form: FormData): Promise<FormState> {
  const raw = {
    ...Object.fromEntries(form),
    services: form.getAll('services'),
    species: form.getAll('species'),
    pet_sizes: form.getAll('pet_sizes'),
  }
  const parsed = applySchema.safeParse(raw)
  if (!parsed.success) return invalid(parsed.error)
  const ok: FormState = {
    status: 'success',
    message:
      'Recebemos sua candidatura. Nos próximos dias úteis a equipe entra em contato para a verificação de identidade e a entrevista. Seu perfil só aparece na busca depois disso.',
  }
  if (form.get('website_confirm')) return ok
  if (!isSupabaseConfigured()) return NOT_CONFIGURED

  const { consent: _consent, experience, ...data } = parsed.data
  void _consent
  const supabase = await createClient()
  const { error } = await supabase.from('caregivers').insert({ ...data, experience, bio: experience })
  if (error) {
    console.error('caregiver apply failed', error.code, error.message)
    return fail('Não conseguimos enviar sua candidatura agora. Tente de novo em alguns minutos.')
  }
  revalidatePath('/admin', 'layout')
  return ok
}

const todayIso = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10)

const requestSchema = z
  .object({
    caregiver_id: z.guid(),
    slug: z.string().max(80),
    service: z.enum(['hospedagem', 'visita', 'passeio', 'creche', 'especiais'], { error: 'Escolha o serviço.' }),
    start_date: z.iso.date({ error: 'Escolha a data de início.' }),
    end_date: z.iso.date({ error: 'Escolha a data de fim.' }),
    pet_name: z.string().trim().min(1, { error: 'Qual o nome do seu pet?' }).max(60),
    species: z.enum(['cao', 'gato', 'outros']),
    pet_size: z.enum(['pequeno', 'medio', 'grande']),
    pet_notes: z.string().trim().max(1000).optional().default(''),
    message: z.string().trim().max(1000).optional().default(''),
    terms: z.literal('on', { error: 'Confirme que leu as regras da reserva.' }),
  })
  .refine((v) => v.start_date >= todayIso(), { error: 'A data de início já passou.', path: ['start_date'] })
  .refine((v) => v.end_date >= v.start_date, { error: 'A data de fim deve ser igual ou depois do início.', path: ['end_date'] })

const RPC_ERRORS: Record<string, string> = {
  caregiver_unavailable: 'Este cuidador não está recebendo solicitações agora.',
  service_unavailable: 'Este cuidador não oferece esse serviço.',
  invalid_dates: 'Confira as datas: o período pode ter no máximo 60 dias e não pode começar no passado.',
  price_missing: 'Este serviço ainda está sem preço no perfil. Escolha outro serviço.',
  login_required: 'Entre na sua conta para enviar a solicitação.',
}

export async function requestCare(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = requestSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  const d = parsed.data

  if (d.slug.startsWith('demo-')) {
    return {
      status: 'success',
      message: 'Demonstração: num perfil real, a solicitação seria enviada à equipe PetApoio, que confirma com o cuidador e responde em até 1 dia útil. Nada foi cobrado.',
    }
  }
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const session = await getSession()
  if (!session) redirect(`/entrar?next=${encodeURIComponent(`/cuida/${d.slug}`)}`)

  const supabase = await createClient()
  const { error } = await supabase.rpc('request_care', {
    p_caregiver: d.caregiver_id,
    p_service: d.service,
    p_start: d.start_date,
    p_end: d.end_date,
    p_pet_name: d.pet_name,
    p_species: d.species,
    p_size: d.pet_size,
    p_pet_notes: d.pet_notes,
    p_message: d.message,
  })
  if (error) {
    const known = Object.keys(RPC_ERRORS).find((k) => error.message.includes(k))
    if (!known) console.error('request_care failed', error.code, error.message)
    return fail((known && RPC_ERRORS[known]) || 'Não conseguimos enviar a solicitação agora. Tente de novo em alguns minutos.')
  }
  revalidatePath('/painel/reservas')
  redirect('/painel/reservas?enviada=1')
}
