import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import type { Profile, Role } from '@/types/db'

export type Session = { userId: string; email: string; profile: Profile }

/** Sessão atual (ou null). Memorizada por requisição. */
export const getSession = cache(async (): Promise<Session | null> => {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single<Profile>()
  if (!profile) return null
  return { userId: user.id, email: user.email ?? '', profile }
})

/** Exige login (e, opcionalmente, um dos papéis). Redireciona caso contrário. */
export async function requireSession(roles?: Role[], next = '/painel'): Promise<Session> {
  const session = await getSession()
  if (!session) redirect(`/entrar?next=${encodeURIComponent(next)}`)
  if (roles && !roles.includes(session.profile.role)) redirect(homeFor(session.profile.role))
  return session
}

export function homeFor(role: Role) {
  if (role === 'admin') return '/admin'
  if (role === 'psicologo') return '/painel/psicologo'
  return '/painel'
}

/** Só permite redirecionar para caminhos internos (evita open redirect). */
export function safeNext(next: unknown, fallback = '/painel') {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : fallback
}
