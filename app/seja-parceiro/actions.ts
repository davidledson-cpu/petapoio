'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { fail, invalid, NOT_CONFIGURED, type FormState } from '@/lib/form-state'
import { UFS } from '@/lib/ufs'
import { site } from '@/lib/site'
import { NEIGHBORHOODS } from '@/lib/cuida-shared'
import {
  PRICE_KEYS,
  TRAINING_FOCUS,
  TRAINING_FORMATS,
  TRAINING_MODALITIES,
  type TrainingFocus,
  type TrainingFormat,
  type TrainingModality,
} from '@/lib/adestra-shared'

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Use no máximo ${max} caracteres.` })
    .optional()
    .transform((v) => (v ? v : null))

const schema = z
  .object({
    full_name: z.string().trim().min(3, { error: 'Informe seu nome completo.' }).max(120),
    email: z.email({ error: 'Confira o e-mail.' }).max(254).trim().toLowerCase(),
    password: z.string().min(8, { error: 'Use pelo menos 8 caracteres.' }).max(72),
    phone: z.string().trim().min(10, { error: 'Informe um telefone com DDD.' }).max(30),
    crp: z
      .string()
      .trim()
      .regex(/^\d{2}\s*\/\s*\d{3,6}$/, { error: 'Use o formato 06/123456 (região/número).' })
      .transform((v) => v.replace(/\s/g, '')),
    crp_state: z.enum(UFS, { error: 'Escolha o estado do seu registro.' }),
    modality: z.enum(['online', 'presencial', 'ambos'], { error: 'Escolha como você atende.' }),
    city: optional(80),
    state: z
      .string()
      .optional()
      .transform((v) => (v && (UFS as readonly string[]).includes(v) ? v : null)),
    approach: optional(120),
    pet_grief_experience: z
      .literal('on')
      .optional()
      .transform((v) => v === 'on'),
    consent: z.literal('on', { error: 'Para continuar, aceite os termos e a política de privacidade.' }),
  })
  .refine((v) => v.modality === 'online' || (v.city && v.state), {
    error: 'Para atendimento presencial, informe cidade e estado.',
    path: ['city'],
  })

export async function signUpPsychologist(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = schema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  if (form.get('website_confirm')) return { status: 'success', message: 'Recebemos seu cadastro.' }
  if (!isSupabaseConfigured()) return NOT_CONFIGURED

  const d = parsed.data
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: d.email,
    password: d.password,
    options: {
      emailRedirectTo: `${site.url}/auth/callback?next=/painel/psicologo/perfil`,
      data: {
        full_name: d.full_name,
        phone: d.phone,
        role: 'psicologo',
        crp: d.crp,
        crp_state: d.crp_state,
        modality: d.modality,
        city: d.city,
        state: d.state,
        approach: d.approach,
        pet_grief_experience: d.pet_grief_experience,
        accepted_terms_at: new Date().toISOString(),
      },
    },
  })

  if (error) {
    if (error.code === 'user_already_exists') {
      return fail('Já existe uma conta com este e-mail. Entre com sua senha para continuar o cadastro.')
    }
    if (error.code === 'weak_password') return fail('Escolha uma senha mais forte.')
    console.error('psychologist signup failed', error.code, error.message)
    return fail('Não conseguimos criar sua conta agora. Tente de novo em alguns minutos.')
  }

  if (data.session) redirect('/painel/psicologo/perfil')
  return {
    status: 'success',
    message: `Conta criada. Enviamos um link de confirmação para ${d.email}. Depois de confirmar, você completa o perfil, envia o documento e conecta o Mercado Pago.`,
  }
}

// ── Adestradores (PetApoio Cuida) ───────────────────────────────────────────

const trainerPrice = z
  .string()
  .trim()
  .optional()
  .transform((v, ctx) => {
    if (!v) return null
    const n = Number(v.replace(/\./g, '').replace(',', '.'))
    if (!Number.isFinite(n) || n < 20 || n > 5000) {
      ctx.addIssue({ code: 'custom', message: 'Informe um valor entre R$ 20 e R$ 5.000.' })
      return z.NEVER
    }
    return Math.round(n * 100)
  })

const trainerSchema = z
  .object({
    full_name: z.string().trim().min(3, { error: 'Informe seu nome completo.' }).max(120),
    email: z.email({ error: 'Confira o e-mail.' }).max(254).trim().toLowerCase(),
    phone: z.string().trim().min(10, { error: 'Informe um telefone com DDD.' }).max(30),
    neighborhood: z.string().refine((v) => v in NEIGHBORHOODS, { error: 'Escolha o bairro de onde você parte.' }),
    radius_km: z.coerce.number().int().min(1).max(30),
    modalities: z
      .array(z.enum(Object.keys(TRAINING_MODALITIES) as [TrainingModality, ...TrainingModality[]]))
      .min(1, { error: 'Escolha pelo menos uma forma de atender.' }),
    species: z.array(z.enum(['cao', 'gato', 'outros'])).min(1, { error: 'Escolha com quais pets você trabalha.' }),
    focus: z
      .array(z.enum(Object.keys(TRAINING_FOCUS) as [TrainingFocus, ...TrainingFocus[]]))
      .min(1, { error: 'Escolha pelo menos uma especialidade.' })
      .max(6, { error: 'Escolha até 6 especialidades, as que você mais domina.' }),
    formats: z
      .array(z.enum(Object.keys(TRAINING_FORMATS) as [TrainingFormat, ...TrainingFormat[]]))
      .min(1, { error: 'Escolha pelo menos um formato.' }),
    price_assessment_cents: trainerPrice,
    price_class_cents: trainerPrice,
    price_package_cents: trainerPrice,
    price_consult_cents: trainerPrice,
    package_classes: z
      .string()
      .optional()
      .transform((v) => (v ? Number(v) : null))
      .pipe(z.number().int().min(2).max(30).nullable()),
    years_experience: z.coerce.number().int().min(0).max(5),
    headline: optional(160),
    experience: z.string().trim().min(40, { error: 'Conte um pouco mais sobre sua experiência (mínimo de 40 caracteres).' }).max(2000),
    qualifications: optional(1000),
    portfolio_url: z
      .string()
      .trim()
      .max(200)
      .optional()
      .transform((v) => (v ? v : null))
      .refine((v) => !v || /^(https?:\/\/|@)/i.test(v), { error: 'Use um link (https://...) ou seu @ do Instagram.' }),
    positive_methods: z.literal('on', { error: 'Para fazer parte da rede, é preciso trabalhar sem métodos aversivos.' }),
    consent: z.literal('on', { error: 'Para continuar, aceite os termos e a política de privacidade.' }),
  })
  .superRefine((v, ctx) => {
    for (const f of v.formats) {
      const key = PRICE_KEYS[f]
      if (v[key] === null) ctx.addIssue({ code: 'custom', path: [key], message: 'Informe o preço deste formato.' })
    }
    if (v.formats.includes('pacote') && v.package_classes === null) {
      ctx.addIssue({ code: 'custom', path: ['package_classes'], message: 'Quantas aulas tem o pacote?' })
    }
  })

export async function applyTrainer(_prev: FormState, form: FormData): Promise<FormState> {
  const raw = {
    ...Object.fromEntries(form),
    modalities: form.getAll('modalities'),
    species: form.getAll('species'),
    focus: form.getAll('focus'),
    formats: form.getAll('formats'),
  }
  const parsed = trainerSchema.safeParse(raw)
  if (!parsed.success) return invalid(parsed.error)
  const ok: FormState = {
    status: 'success',
    message:
      'Recebemos seu cadastro. Em até 5 dias úteis a equipe entra em contato para a conversa de verificação. Seu perfil só aparece para tutores depois da aprovação.',
  }
  if (form.get('website_confirm')) return ok
  if (!isSupabaseConfigured()) return NOT_CONFIGURED

  const { consent: _c, positive_methods: _p, ...data } = parsed.data
  void _c
  void _p
  const supabase = await createClient()
  const { error } = await supabase.from('trainers').insert({ ...data, positive_methods: true })
  if (error) {
    console.error('trainer apply failed', error.code, error.message)
    return fail('Não conseguimos enviar seu cadastro agora. Tente de novo em alguns minutos.')
  }
  revalidatePath('/admin', 'layout')
  return ok
}
