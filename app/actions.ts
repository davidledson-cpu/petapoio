'use server'

import { z } from 'zod'
import { getSupabase } from '@/lib/supabase'
import type { FormState } from '@/lib/form-state'
import { UFS } from '@/lib/ufs'


const NOT_CONFIGURED: FormState = {
  status: 'error',
  message:
    'O envio ainda não está ativo neste ambiente. Escreva para contato@petapoio.com.br enquanto finalizamos a configuração.',
}

const SAVE_FAILED: FormState = {
  status: 'error',
  message: 'Não conseguimos salvar seu envio. Tente de novo em alguns minutos ou escreva para contato@petapoio.com.br.',
}

const email = z.email({ error: 'Confira o e-mail: ele parece incompleto.' }).max(254).trim().toLowerCase()
const consent = z.literal('on', { error: 'Para continuar, aceite a política de privacidade.' })

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    out[key] ??= issue.message
  }
  return out
}

/** Campo invisível para pessoas; robôs costumam preenchê-lo. */
function isBot(form: FormData) {
  return Boolean(form.get('website_confirm'))
}

const signupSchema = z.object({
  email,
  list: z.enum(['newsletter', 'psicologos', 'loja']),
  consent,
})

const SIGNUP_SUCCESS: Record<string, string> = {
  newsletter: 'Inscrição feita. Os próximos textos chegam no seu e-mail, sem pressa e sem excesso.',
  psicologos: 'Combinado. Avisaremos por e-mail assim que os primeiros perfis verificados estiverem disponíveis.',
  loja: 'Combinado. Avisaremos por e-mail quando a loja abrir.',
}

export async function subscribe(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) {
    return { status: 'error', message: 'Revise o campo destacado.', fieldErrors: fieldErrors(parsed.error) }
  }
  const success: FormState = { status: 'success', message: SIGNUP_SUCCESS[parsed.data.list] }
  if (isBot(form)) return success

  const supabase = getSupabase()
  if (!supabase) return NOT_CONFIGURED

  const { error } = await supabase
    .from('interest_signups')
    .insert({ email: parsed.data.email, list: parsed.data.list })

  // 23505 = já inscrito nesta lista; para a pessoa, o resultado é o mesmo.
  if (error && error.code !== '23505') {
    console.error('subscribe failed', error.code, error.message)
    return SAVE_FAILED
  }
  return success
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Use no máximo ${max} caracteres.` })
    .transform((v) => (v === '' ? null : v))

const applicationSchema = z.object({
  full_name: z.string().trim().min(3, { error: 'Informe seu nome completo.' }).max(120),
  email,
  phone: optionalText(30),
  crp: z
    .string()
    .trim()
    .regex(/^\d{2}\s*\/\s*\d{3,6}$|^\d{4,8}$/, { error: 'Use o formato 06/123456 (região/número).' }),
  crp_state: z.enum(UFS, { error: 'Escolha o estado do seu registro.' }),
  city: optionalText(80),
  modality: z.enum(['online', 'presencial', 'ambos'], { error: 'Escolha como você atende.' }),
  grief_experience: optionalText(2000),
  pet_grief_experience: z
    .literal('on')
    .optional()
    .transform((v) => v === 'on'),
  approach: optionalText(200),
  website: optionalText(300).refine((v) => v === null || /^https?:\/\/\S+\.\S+/.test(v), {
    error: 'Use um link completo, começando com https://',
  }),
  consent,
})

export async function applyAsProfessional(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = applicationSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) {
    return { status: 'error', message: 'Revise os campos destacados.', fieldErrors: fieldErrors(parsed.error) }
  }
  const success: FormState = {
    status: 'success',
    message:
      'Recebemos seu pré-cadastro. Vamos conferir seu registro no CRP e responder por e-mail com os próximos passos.',
  }
  if (isBot(form)) return success

  const supabase = getSupabase()
  if (!supabase) return NOT_CONFIGURED

  const { consent: _consent, crp, ...data } = parsed.data
  const { error } = await supabase
    .from('professional_applications')
    .insert({ ...data, crp: crp.replace(/\s/g, '') })

  if (error && error.code !== '23505') {
    console.error('application failed', error.code, error.message)
    return SAVE_FAILED
  }
  return success
}

