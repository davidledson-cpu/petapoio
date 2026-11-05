import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Cliente com a chave service_role: ignora RLS. Usar SOMENTE no servidor, para tarefas que
 * o próprio sistema executa (webhook de pagamento, tokens do Mercado Pago, URLs assinadas).
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!env.supabaseUrl || !key) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada.')
  return createClient(env.supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
