'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard/paciente'
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError('')
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos.'
        : error.message)
      return
    }
    router.push(redirectTo)
    router.refresh()
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}` },
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">🐾</div>
          <span className="font-serif font-bold text-xl text-white">PetApoio</span>
        </Link>
        <div className="text-white">
          <div className="text-6xl mb-6">🌸</div>
          <h2 className="font-serif text-3xl font-bold mb-4">Bem-vindo de volta</h2>
          <p className="text-white/80 text-base leading-relaxed max-w-sm">
            Continue sua jornada de cura. Seus psicólogos e conquistas estão esperando por você.
          </p>
        </div>
        <p className="text-white/40 text-sm">© 2026 PetApoio</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-petblue-400 flex items-center justify-center text-lg">🐾</div>
              <span className="font-serif font-bold text-lg text-petblue-600">PetApoio</span>
            </Link>
          </div>

          <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">Entrar</h1>
          <p className="text-gray-500 text-sm mb-8">
            Não tem conta?{' '}
            <Link href="/auth/cadastro" className="text-petblue-500 font-semibold hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </p>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-petblue-200 hover:bg-petblue-50 transition-all mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Entrar com Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">ou entre com e-mail</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
              <input
                {...register('email')}
                type="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              <div className="text-right mt-1.5">
                <Link href="/auth/recuperar-senha" className="text-xs text-petblue-500 hover:underline">Esqueceu a senha?</Link>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
