'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { invalid, NOT_CONFIGURED, fail, type FormState } from '@/lib/form-state'

const signupSchema = z.object({
  email: z.email({ error: 'Confira o e-mail: ele parece incompleto.' }).max(254).trim().toLowerCase(),
  list: z.enum(['newsletter', 'psicologos', 'loja', 'cuida', 'saude']),
  consent: z.literal('on', { error: 'Para continuar, aceite a política de privacidade.' }),
})

const SIGNUP_SUCCESS: Record<string, string> = {
  newsletter: 'Inscrição feita. Os próximos textos chegam no seu e-mail, sem pressa e sem excesso.',
  psicologos: 'Combinado. Avisaremos por e-mail quando houver novos profissionais disponíveis.',
  loja: 'Combinado. Avisaremos por e-mail sobre novidades da loja.',
  cuida: 'Combinado. Avisaremos quando houver cuidadores verificados no seu bairro.',
  saude: 'Combinado. Avisaremos quando a PetApoio Saúde abrir.',
}

export async function subscribe(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error, 'Revise o campo destacado.')
  const success: FormState = { status: 'success', message: SIGNUP_SUCCESS[parsed.data.list] }
  if (form.get('website_confirm')) return success
  if (!isSupabaseConfigured()) return NOT_CONFIGURED

  const supabase = await createClient()
  const { error } = await supabase.from('interest_signups').insert({ email: parsed.data.email, list: parsed.data.list })
  if (error && error.code !== '23505') {
    console.error('subscribe failed', error.code, error.message)
    return fail('Não conseguimos salvar sua inscrição. Tente de novo em alguns minutos.')
  }
  return success
}
