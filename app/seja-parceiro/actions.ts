'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { fail, invalid, NOT_CONFIGURED, type FormState } from '@/lib/form-state'
import { UFS } from '@/lib/ufs'
import { site } from '@/lib/site'

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
