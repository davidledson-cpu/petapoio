'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard/paciente'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Preencha e-mail e senha.'); return }
    setError('')
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao entrar.'); return }
      router.push(data.redirectTo || redirectTo)
      router.refresh()
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemo = (role: 'patient' | 'professional') => {
    setEmail(role === 'patient' ? 'paciente@petapoio.com.br' : 'psicologo@petapoio.com.br')
    setPassword('demo123')
    setError('')
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

          {/* Demo hint cards */}
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-semibold text-amber-700 mb-2">🧪 Acesso demo — clique para preencher</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo('patient')}
                className="flex-1 text-left px-3 py-2 rounded-lg bg-white border border-amber-200 hover:border-amber-400 transition-colors"
              >
                <p className="text-xs font-bold text-gray-700">🐱 Paciente</p>
                <p className="text-xs text-gray-500">paciente@petapoio.com.br</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('professional')}
                className="flex-1 text-left px-3 py-2 rounded-lg bg-white border border-amber-200 hover:border-amber-400 transition-colors"
              >
                <p className="text-xs font-bold text-gray-700">🩺 Psicólogo</p>
                <p className="text-xs text-gray-500">psicologo@petapoio.com.br</p>
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
