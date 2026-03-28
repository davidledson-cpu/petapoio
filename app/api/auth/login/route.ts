import { NextRequest, NextResponse } from 'next/server'
import { validateDemoLogin, SESSION_COOKIE, getDashboardRoute } from '@/lib/auth/demo-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 })
    }

    // Try demo auth first
    const demoUser = validateDemoLogin(email, password)
    if (demoUser) {
      const response = NextResponse.json({
        success: true,
        user: demoUser,
        redirectTo: getDashboardRoute(demoUser.role),
      })

      response.cookies.set(SESSION_COOKIE, JSON.stringify(demoUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    }

    // Try Supabase auth if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = createClient()

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (!error && data.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('full_name, role, avatar_url')
            .eq('id', data.user.id)
            .single()

          const user = {
            id: data.user.id,
            email: data.user.email!,
            name: profile?.full_name || email.split('@')[0],
            role: profile?.role || 'patient',
            avatar: profile?.avatar_url,
            createdAt: data.user.created_at,
          }

          const response = NextResponse.json({
            success: true,
            user,
            redirectTo: getDashboardRoute(user.role as any),
          })

          response.cookies.set(SESSION_COOKIE, JSON.stringify(user), {
            httpOnly: false,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          })

          return response
        }
      } catch {}
    }

    return NextResponse.json(
      { error: 'E-mail ou senha incorretos. Use paciente@petapoio.com.br / demo123 para testar.' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
