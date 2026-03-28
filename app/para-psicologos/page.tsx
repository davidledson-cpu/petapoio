'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import {
  ArrowRight,
  Calendar,
  DollarSign,
  Video,
  BarChart3,
  Shield,
  Users,
  Star,
  Heart,
  Stethoscope,
  MessageCircle,
  CheckCircle,
  Mail,
  Lock,
  User,
  Phone,
  FileText,
  MapPin,
  Briefcase,
  Clock,
  CreditCard,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

/* ───────── DATA ───────── */
const benefits = [
  {
    icon: Users,
    title: 'Pacientes qualificados',
    desc: 'Receba pessoas enlutadas que buscam ajuda profissional diretamente na plataforma.',
    color: 'text-petblue-500',
    bg: 'bg-petblue-50',
  },
  {
    icon: Calendar,
    title: 'Agenda inteligente',
    desc: 'Sistema integrado com Google Calendar. Seus horários sempre atualizados.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: DollarSign,
    title: 'Pagamentos automaticos',
    desc: 'Receba via PIX ou Stripe após cada sessão. Sem burocracia.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Video,
    title: 'Videochamada integrada',
    desc: 'Atenda online sem precisar de apps externos. Tudo dentro da PetApoio.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: BarChart3,
    title: 'Dashboard completo',
    desc: 'Acompanhe sessões, receita, avaliações e evolução dos pacientes.',
    color: 'text-petblue-500',
    bg: 'bg-petblue-50',
  },
  {
    icon: Shield,
    title: 'Privacidade e LGPD',
    desc: 'Dados protegidos com criptografia. Conformidade total com a LGPD.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
]

const approaches = [
  { icon: '\u{1F9E0}', name: 'Psicanálise', desc: 'Inconsciente e processos internos do luto' },
  { icon: '\u{1F52C}', name: 'Behaviorismo', desc: 'Análise do comportamento e técnicas práticas' },
  { icon: '\u{1F49A}', name: 'Humanismo', desc: 'Potencial humano e crescimento pessoal' },
  { icon: '\u{1F4A1}', name: 'TCC', desc: 'Pensamentos, emoções e comportamentos' },
  { icon: '\u{1F300}', name: 'Gestalt', desc: 'Consciência e experiência do aqui e agora' },
  { icon: '\u{1F441}\u{FE0F}', name: 'EMDR', desc: 'Dessensibilização e reprocessamento do trauma' },
  { icon: '\u{1F9D8}', name: 'Mindfulness', desc: 'Atenção plena e regulação emocional' },
  { icon: '\u{1F517}', name: 'Sistêmica', desc: 'Relações familiares e contexto social' },
]

const testimonials = [
  {
    name: 'Dra. Camila Reis',
    crp: 'CRP 06/145678',
    text: 'Desde que me cadastrei na PetApoio, minha agenda ficou completa. As pessoas chegam já sabendo o que precisam.',
    rating: 5,
  },
  {
    name: 'Dr. André Oliveira',
    crp: 'CRP 05/098765',
    text: 'A plataforma é intuitiva e o pagamento automático é um diferencial enorme. Recomendo a todos os colegas.',
    rating: 5,
  },
  {
    name: 'Dra. Fernanda Lima',
    crp: 'CRP 08/112233',
    text: 'Encontrei minha vocação atendendo pessoas enlutadas. A PetApoio conecta quem precisa com quem pode ajudar.',
    rating: 5,
  },
]

const stats = [
  { value: '500+', label: 'Pessoas atendidas' },
  { value: '80+', label: 'Profissionais cadastrados' },
  { value: '4.9', label: 'Avaliação média' },
  { value: '98%', label: 'Satisfação' },
]

const steps = [
  { number: '01', icon: FileText, title: 'Dados pessoais', desc: 'Nome, e-mail, CPF, telefone e senha.' },
  { number: '02', icon: MapPin, title: 'Endereço profissional', desc: 'Endereço de atendimento com auto-preenchimento por CEP.' },
  { number: '03', icon: Briefcase, title: 'Dados profissionais', desc: 'CRP/CRM, formação, abordagens e especialidades.' },
  { number: '04', icon: Clock, title: 'Disponibilidade e valores', desc: 'Modalidade, duração, preço e opções sociais.' },
  { number: '05', icon: CreditCard, title: 'Dados bancários e PIX', desc: 'Conta bancária e chave PIX para recebimentos.' },
]

function renderStars(n: number) {
  return '\u2B50'.repeat(Math.round(n))
}

/* ───────── AUTH SECTION COMPONENT ───────── */
function CadastroSection() {
  const [authMode, setAuthMode] = useState<'check' | 'login' | 'register'>('check')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')

    try {
      // Try to check if email exists by attempting sign in with wrong password
      // This is a simple approach - in production use a server-side check
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: '__check_only__',
      })

      if (signInError?.message?.includes('Invalid login credentials')) {
        // Email exists but password is wrong - user has account
        setAuthMode('login')
      } else if (signInError?.message?.includes('Email not confirmed')) {
        setAuthMode('login')
        setError('Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.')
      } else {
        // Email likely doesn't exist
        setAuthMode('register')
      }
    } catch {
      // If error, default to register
      setAuthMode('register')
    }
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError('E-mail ou senha incorretos. Tente novamente.')
      } else {
        setSuccess('Login realizado com sucesso! Redirecionando...')
        setTimeout(() => {
          window.location.href = '/dashboard/profissional'
        }, 1500)
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            telefone,
            tipo: 'profissional',
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Este e-mail já está cadastrado. Tente fazer login.')
          setAuthMode('login')
        } else {
          setError(signUpError.message)
        }
      } else {
        setSuccess('Conta criada com sucesso! Redirecionando para completar seu cadastro profissional...')
        setTimeout(() => {
          window.location.href = '/auth/cadastro'
        }, 2000)
      }
    } catch {
      setError('Erro ao criar conta. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 md:p-10 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-petblue-500 flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
          {authMode === 'check' && 'Cadastre-se como Profissional'}
          {authMode === 'login' && 'Bem-vindo de volta!'}
          {authMode === 'register' && 'Criar sua conta'}
        </h3>
        <p className="text-gray-500 text-sm">
          {authMode === 'check' && 'Informe seu e-mail para começar'}
          {authMode === 'login' && 'Entre com sua senha para acessar'}
          {authMode === 'register' && 'Preencha seus dados para se cadastrar'}
        </p>
      </div>

      {/* Error/Success messages */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Step 1: Check email */}
      {authMode === 'check' && (
        <form onSubmit={handleCheckEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail profissional</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-petblue-400 focus:ring-2 focus:ring-petblue-100 outline-none transition-all text-gray-800"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-petblue-500 text-white font-bold hover:bg-petblue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            Continuar
          </button>
        </form>
      )}

      {/* Step 2a: Login */}
      {authMode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-petblue-400 focus:ring-2 focus:ring-petblue-100 outline-none transition-all text-gray-800"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-petblue-500 text-white font-bold hover:bg-petblue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4" /> Entrar</>}
          </button>
          <button type="button" onClick={() => { setAuthMode('check'); setPassword(''); setError(''); }} className="w-full text-sm text-petblue-600 hover:text-petblue-700 font-medium">
            Usar outro e-mail
          </button>
        </form>
      )}

      {/* Step 2b: Register */}
      {authMode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600" readOnly />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Dr(a). Nome Completo" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-petblue-400 focus:ring-2 focus:ring-petblue-100 outline-none transition-all text-gray-800" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-petblue-400 focus:ring-2 focus:ring-petblue-100 outline-none transition-all text-gray-800" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Criar senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-petblue-400 focus:ring-2 focus:ring-petblue-100 outline-none transition-all text-gray-800" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-petgreen-500 text-white font-bold hover:bg-petgreen-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Stethoscope className="w-4 h-4" /> Criar minha conta</>}
          </button>
          <button type="button" onClick={() => { setAuthMode('check'); setPassword(''); setNome(''); setTelefone(''); setError(''); }} className="w-full text-sm text-petblue-600 hover:text-petblue-700 font-medium">
            Usar outro e-mail
          </button>
        </form>
      )}

      {/* Divider + login link */}
      {authMode === 'register' && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Já possui conta?{' '}
          <button onClick={() => setAuthMode('login')} className="text-petblue-600 font-semibold hover:underline">
            Faça login
          </button>
        </p>
      )}
      {authMode === 'login' && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Não tem conta?{' '}
          <button onClick={() => setAuthMode('register')} className="text-petgreen-600 font-semibold hover:underline">
            Cadastre-se
          </button>
        </p>
      )}

      {/* Steps preview for register mode */}
      {authMode === 'register' && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Após criar sua conta, você completará:</p>
          <div className="space-y-2">
            {steps.map((s) => (
              <div key={s.number} className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-lg bg-petblue-50 flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-3.5 h-3.5 text-petblue-500" />
                </div>
                <span className="text-gray-600">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ───────── MAIN PAGE ───────── */
export default function ParaPsicologosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* HERO */}
        <section className="gradient-hero pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-widest mb-5">
                  Para Psicólogos e Profissionais de Saúde
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Faça parte da rede<br />
                  de cuidado PetApoio
                </h1>
                <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-lg">
                  Cadastre-se como profissional e conecte-se a pessoas enlutadas que precisam
                  de apoio qualificado. Comece a atender em minutos.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className="glass rounded-2xl p-5 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white mb-1">{s.value}</div>
                      <div className="text-white/70 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auth Form */}
              <CadastroSection />
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Por que atender na PetApoio?
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Tudo que você precisa para construir uma prática online sólida, focada em apoio a pessoas enlutadas pela perda de um animal.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl p-6 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${b.bg} flex items-center justify-center mb-4`}>
                    <b.icon className={`w-6 h-6 ${b.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Comece agora */}
        <section className="py-20 bg-petbeige-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-petblue-100 text-petblue-600 text-xs font-bold uppercase tracking-widest mb-4">
                Comece agora
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Comece agora a ajudar as pessoas
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto mb-10">
                O cadastro é rápido, gratuito e seu perfil é aprovado em até 48 horas.
              </p>

              <Link
                href="#cadastro-profissional"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-petblue-500 text-white font-bold text-lg hover:bg-petblue-600 transition-all shadow-xl hover:-translate-y-0.5"
              >
                <Stethoscope className="w-6 h-6" />
                Iniciar meu cadastro
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Steps preview below CTA */}
              <div className="mt-12 grid grid-cols-5 gap-3">
                {steps.map((s, i) => (
                  <div key={s.number} className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mx-auto mb-2">
                      <s.icon className="w-5 h-5 text-petblue-500" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">{s.title}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">5 etapas simples para completar seu perfil</p>
            </div>
          </div>
        </section>

        {/* APPROACHES */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Abordagens aceitas na plataforma
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                A PetApoio aceita profissionais de diversas abordagens terapêuticas. Selecione a sua durante o cadastro.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {approaches.map((a) => (
                <div
                  key={a.name}
                  className="bg-petbeige-50 rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{a.icon}</div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{a.name}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-petbeige-50">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                O que nossos profissionais dizem
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md p-6"
                >
                  <div className="text-yellow-400 text-sm mb-3">{renderStars(t.rating)}</div>
                  <p className="text-gray-700 text-sm italic mb-4">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.crp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="container max-w-3xl">
            <h2 className="font-serif text-3xl font-bold text-gray-800 mb-10 text-center">
              Perguntas frequentes
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: 'Quem pode se cadastrar como profissional?',
                  a: 'Psicólogos(as) com CRP ativo, psiquiatras com CRM, terapeutas ocupacionais e assistentes sociais com registro profissional válido.',
                },
                {
                  q: 'Quanto custa para me cadastrar?',
                  a: 'O cadastro é 100% gratuito. A PetApoio cobra apenas uma pequena taxa sobre cada sessão realizada.',
                },
                {
                  q: 'Como recebo os pagamentos?',
                  a: 'Você configura sua conta bancária e chave PIX no cadastro. Os pagamentos são processados automaticamente após cada sessão.',
                },
                {
                  q: 'Quanto tempo leva para meu cadastro ser aprovado?',
                  a: 'Nossa equipe analisa os dados em até 48 horas. Você recebe um e-mail quando seu perfil for aprovado e ativado.',
                },
                {
                  q: 'Posso atender apenas online?',
                  a: 'Sim! Você escolhe a modalidade: online (vídeo ou áudio), presencial ou híbrido. A maioria dos profissionais atende online.',
                },
                {
                  q: 'Preciso ter experiência com luto animal?',
                  a: 'Não é obrigatório, mas é um diferencial. A PetApoio oferece materiais de capacitação para profissionais que desejam se especializar nessa área.',
                },
              ].map((faq) => (
                <div key={faq.q} className="bg-petbeige-50 rounded-xl border border-gray-200 p-5">
                  <h4 className="font-bold text-gray-800 text-sm mb-2">{faq.q}</h4>
                     <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 gradient-hero">
          <div className="container text-center text-white">
            <div className="text-5xl mb-6">{'\u{1FA7A}'}</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Pronto para fazer a diferença?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Cadastre-se agora e comece a ajudar pessoas que precisam de apoio profissional
              para lidar com o luto pela perda de um animal de estimacao.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-petblue-600 font-bold text-base hover:bg-petbeige-100 transition-all shadow-xl"
              >
                <Stethoscope className="w-5 h-5" />
                Cadastrar como Profissional
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Sou%20psicólogo(a)%20e%20gostaria%20de%20saber%20mais%20sobre%20a%20PetApoio."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold hover:bg-white/10 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Falar com nossa equipe
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
