import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { env, isSupabaseConfigured } from '@/lib/env'

/** Cliente do Supabase com a sessão da pessoa (respeita RLS). */
export async function createClient() {
  if (!isSupabaseConfigured()) throw new SupabaseNotConfigured()
  const cookieStore = await cookies()
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) cookieStore.set(name, value, options)
        } catch {
          // Chamado de um Server Component: o proxy já renova a sessão.
        }
      },
    },
  })
}

export class SupabaseNotConfigured extends Error {
  constructor() {
    super('Supabase não configurado neste ambiente.')
  }
}
