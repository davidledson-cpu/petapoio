'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { homeFor, safeNext } from '@/lib/auth'
import { fail, invalid, NOT_CONFIGURED, type FormState } from '@/lib/form-state'
import { site } from '@/lib/site'
import type { Role } from '@/types/db'

const email = z.email({ error: 'Confira o e-mail.' }).max(254).trim().toLowerCase()
const password = z.string().min(8, { error: 'Use pelo menos 8 caracteres.' }).max(72)

export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = z.object({ email, password: z.string().min(1, { error: 'Informe a senha.' }) }).safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  if (!isSupabaseConfigured()) return NOT_CONFIGURED

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) {
    if (error.code === 'email_not_confirmed') {
      return fail('Confirme seu e-mail pelo link que enviamos antes de entrar.')
    }
    return fail('E-mail ou senha incorretos.')
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single<{ role: Role }>()
  redirect(safeNext(form.get('next'), homeFor(profile?.role ?? 'paciente')))
}

const signUpSchema = z.object({
  full_name: z.string().trim().min(3, { error: 'Informe seu nome.' }).max(120),
  email,
  password,
  consent: z.literal('on', { error: 'Para criar a conta, aceite os termos e a política de privacidade.' }),
})

export async function signUpPatient(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  if (!isSupabaseConfigured()) return NOT_CONFIGURED

  const next = safeNext(form.get('next'), '/painel')
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name, role: 'paciente' },
      emailRedirectTo: `${site.url}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })
  if (error) {
    if (error.code === 'user_already_exists') return fail('Já existe uma conta com este e-mail. Entre ou recupere a senha.')
    if (error.code === 'weak_password') return fail('Escolha uma senha mais forte.')
    console.error('signup failed', error.code, error.message)
    return fail('Não conseguimos criar a conta agora. Tente de novo em alguns minutos.')
  }
  if (data.session) redirect(next)
  return {
    status: 'success',
    message: `Conta criada. Enviamos um link de confirmação para ${parsed.data.email}. Abra o e-mail para ativar o acesso.`,
  }
}

export async function requestPasswordReset(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = z.object({ email }).safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const supabase = await createClient()
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${site.url}/auth/callback?next=/nova-senha`,
  })
  // Mesma resposta exista ou não a conta, para não revelar quem tem cadastro.
  return { status: 'success', message: 'Se houver uma conta com este e-mail, você vai receber um link para criar uma nova senha.' }
}

export async function updatePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = z
    .object({ password, confirm: z.string() })
    .refine((v) => v.password === v.confirm, { error: 'As senhas não são iguais.', path: ['confirm'] })
    .safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) return fail('O link expirou. Peça um novo em "Esqueci minha senha".')
  redirect('/painel')
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect('/')
}
