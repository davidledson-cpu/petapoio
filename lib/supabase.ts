import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Cliente com a chave pública (anon). As tabelas só aceitam INSERT para esse papel,
 * então nada pode ser lido por aqui. Retorna null quando o Supabase não está configurado.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url.includes('SEU_PROJETO')) return null
  client ??= createClient(url, key, { auth: { persistSession: false } })
  return client
}
