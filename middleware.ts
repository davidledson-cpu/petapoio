import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'petapoio_session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Read custom session cookie (demo auth — no Supabase dependency)
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  let user: { role?: string } | null = null
  if (sessionCookie) {
    try { user = JSON.parse(sessionCookie) } catch {}
  }

  const protectedPaths = ['/dashboard']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  if (user && (pathname === '/auth/login' || pathname === '/auth/cadastro')) {
    const url = request.nextUrl.clone()
    url.pathname = user.role === 'professional' ? '/dashboard/profissional' : '/dashboard/paciente'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
