import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { connectSellerAccount } from '@/lib/mercadopago'

/** Retorno do OAuth do Mercado Pago: o psicólogo autorizou receber pagamentos com split. */
export async function GET(req: NextRequest) {
  const back = new URL('/painel/psicologo/pagamentos', req.url)
  const session = await getSession()
  if (!session || session.profile.role !== 'psicologo') {
    return NextResponse.redirect(new URL('/entrar?next=/painel/psicologo/pagamentos', req.url))
  }

  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const jar = await cookies()
  const expected = jar.get('mp_oauth_state')?.value
  jar.delete('mp_oauth_state')

  if (!code || !state || state !== expected) {
    back.searchParams.set('erro', 'A conexão não foi concluída. Tente de novo.')
    return NextResponse.redirect(back)
  }

  try {
    await connectSellerAccount(session.userId, code)
    back.searchParams.set('ok', '1')
  } catch {
    back.searchParams.set('erro', 'O Mercado Pago recusou a conexão. Tente de novo em alguns minutos.')
  }
  return NextResponse.redirect(back)
}
