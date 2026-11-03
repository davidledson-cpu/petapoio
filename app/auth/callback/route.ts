import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeNext } from '@/lib/auth'

/** Recebe o link do e-mail (confirmação de conta ou nova senha) e cria a sessão. */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const next = safeNext(req.nextUrl.searchParams.get('next'), '/painel')
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, req.url))
  }
  return NextResponse.redirect(new URL('/entrar?erro=link', req.url))
}
