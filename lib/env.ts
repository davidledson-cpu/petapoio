/** Quais integrações estão configuradas neste ambiente. Sem credenciais, a interface avisa em vez de fingir. */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
}

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey && !env.supabaseUrl.includes('SEU_PROJETO'))
}

export function isMercadoPagoConfigured() {
  return Boolean(process.env.MP_ACCESS_TOKEN)
}

export function isSplitConfigured() {
  return Boolean(
    process.env.MP_ACCESS_TOKEN &&
      process.env.MP_CLIENT_ID &&
      process.env.MP_CLIENT_SECRET &&
      process.env.PAYMENTS_ENCRYPTION_KEY,
  )
}
