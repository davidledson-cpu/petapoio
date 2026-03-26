'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const step1Schema = z.object({
  userType: z.enum(['patient', 'professional']),
  fullName: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
  confirmPassword: z.string(),
  crp: z.string().optional(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

const step2Schema = z.object({
  petName: z.string().min(1, 'Informe o nome do seu pet'),
  petSpecies: z.enum(['dog', 'cat', 'bird', 'other']),
  lossType: z.enum(['death', 'disappearance', 'separation', 'other']),
  lossTime: z.enum(['recent', '1-3months', '3-12months', 'over1year']),
  moodScore: z.coerce.number().min(1).max(10),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>

const petSpecies = [
  { value: 'dog', label: '🐕 Cão' },
  { value: 'cat', label: '🐈 Gato' },
  { value: 'bird', label: '🐦 Pássaro' },
  { value: 'other', label: '🐾 Outro' },
]

const lossTypes = [
  { value: 'death', label: '💔 Falecimento' },
  { value: 'disappearance', label: '🔍 Desaparecimento' },
  { value: 'separation', label: '💞 Separação familiar' },
  { value: 'other', label: '🌧️ Outro motivo' },
]

const lossTimes = [
  { value: 'recent', label: 'Recentemente (menos de 1 mês)' },
  { value: '1-3months', label: '1 a 3 meses atrás' },
  { value: '3-12months', label: '3 meses a 1 ano' },
  { value: 'over1year', label: 'Mais de 1 ano' },
]

export default function CadastroPage() {
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { userType: 'patient' },
  })
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema), defaultValues: { moodScore: 5 } })

  const userType = form1.watch('userType')
  const isProfessional = userType === 'professional'

  const onStep1 = (data: Step1Data) => {
    setStep1Data(data)
    if (data.userType === 'professional') {
      handleProfessionalSignup(data)
    } else {
      setStep(2)
    }
  }

  const handleProfessionalSignup = async (data: Step1Data) => {
    setError('')
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (signUpError) { setError(signUpError.message); return }
    if (!authData.user) { setError('Erro ao criar conta.'); return }

    await supabase.from('users').insert({
      id: authData.user.id,
      email: data.email,
      full_name: data.fullName,
      role: 'professional',
    })

    await fetch('/api/notify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.fullName, email: data.email, role: 'professional', crp: data.crp || '' }),
    }).catch(() => {})

    setStep(3)
  }

  const onStep2 = async (data: Step2Data) => {
    if (!step1Data) return
    setError('')

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: step1Data.email,
      password: step1Data.password,
      options: {
        data: { full_name: step1Data.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (signUpError) { setError(signUpError.message); return }
    if (!authData.user) { setError('Erro ao criar conta.'); return }

    await supabase.from('users').insert({
      id: authData.user.id,
      email: step1Data.email,
      full_name: step1Data.fullName,
      role: 'patient',
    })

    await fetch('/api/notify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: step1Data.fullName,
        email: step1Data.email,
        role: 'patient',
        petName: data.petName,
        petSpecies: data.petSpecies,
        lossType: data.lossType,
      }),
    }).catch(() => {})

    setStep(3)
  }

  const progressWidth = step === 1 ? '33%' : step === 2 ? '66%' : '100%'

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">🐾</div>
          <span className="font-serif font-bold text-xl text-white">PetApoio</span>
        </Link>
        <div className="text-white">
          <div className="text-6xl mb-6">💙</div>
          <h2 className="font-serif text-3xl font-bold mb-4">Sua jornada começa aqui</h2>
          <p className="text-white/80 text-base leading-relaxed max-w-sm">
            Em menos de 5 minutos, você estará conectado a um psicólogo especializado em luto animal.
          </p>
        </div>
        <p className="text-white/40 text-sm">© 2026 PetApoio</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {step < 3 && !isProfessional && (
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Passo {step} de 2</span>
                <span>{step === 1 ? 'Criar conta' : 'Sobre você e seu pet'}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-petblue-400 rounded-full transition-all duration-500" style={{ width: progressWidth }} />
              </div>
            </div>
          )}

          {step === 1 && (
            <>
              <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">Criar conta gratuita</h1>
              <p className="text-gray-500 text-sm mb-6">
                Já tem conta?{' '}
                <Link href="/auth/login" className="text-petblue-500 font-semibold hover:underline">Entrar</Link>
              </p>

              <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Você é:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'patient', label: '🐾 Tutor de Pet', desc: 'Busco apoio emocional' },
                      { value: 'professional', label: '🩺 Psicólogo(a)', desc: 'Quero atender pacientes' },
                    ].map(opt => (
                      <label
                        key={opt.value}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${form1.watch('userType') === opt.value ? 'border-petblue-400 bg-petblue-50' : 'border-gray-200 hover:border-petblue-200'}`}
                      >
                        <input {...form1.register('userType')} type="radio" value={opt.value} className="sr-only" />
                        <div className="text-sm font-bold text-gray-800">{opt.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome completo</label>
                  <input {...form1.register('fullName')} placeholder="Seu nome" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
                  {form1.formState.errors.fullName && <p className="text-xs text-red-500 mt-1">{form1.formState.errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
                  <input {...form1.register('email')} type="email" placeholder="seu@email.com" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
                  {form1.formState.errors.email && <p className="text-xs text-red-500 mt-1">{form1.formState.errors.email.message}</p>}
                </div>

                {isProfessional && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">CRP (Conselho Regional de Psicologia)</label>
                    <input {...form1.register('crp')} placeholder="Ex: 06/123456" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
                  <div className="relative">
                    <input {...form1.register('password')} type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form1.formState.errors.password && <p className="text-xs text-red-500 mt-1">{form1.formState.errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar senha</label>
                  <input {...form1.register('confirmPassword')} type="password" placeholder="Repita a senha" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
                  {form1.formState.errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{form1.formState.errors.confirmPassword.message}</p>}
                </div>

                {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>}

                <button type="submit" disabled={form1.formState.isSubmitting} className="w-full py-3.5 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {form1.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isProfessional ? 'Criar minha conta' : 'Continuar'} <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Ao criar conta, você concorda com nossa{' '}
                  <Link href="/privacidade" className="text-petblue-500 hover:underline">Política de Privacidade</Link>
                  {' '}e{' '}
                  <Link href="/termos" className="text-petblue-500 hover:underline">Termos de Uso</Link>.
                </p>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">Conta seu momento 🌿</h1>
              <p className="text-gray-500 text-sm mb-8">Suas respostas nos ajudam a encontrar o profissional ideal para você.</p>

              <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome do seu pet</label>
                  <input {...form2.register('petName')} placeholder="Como se chamava?" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400" />
                  {form2.formState.errors.petName && <p className="text-xs text-red-500 mt-1">{form2.formState.errors.petName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Espécie</label>
                  <div className="grid grid-cols-4 gap-2">
                    {petSpecies.map(s => (
                      <label key={s.value} className={`cursor-pointer text-center p-3 rounded-xl border-2 transition-all text-xs font-semibold ${form2.watch('petSpecies') === s.value ? 'border-petblue-400 bg-petblue-50 text-petblue-600' : 'border-gray-200 text-gray-500 hover:border-petblue-200'}`}>
                        <input {...form2.register('petSpecies')} type="radio" value={s.value} className="sr-only" />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de perda</label>
                  <div className="grid grid-cols-2 gap-2">
                    {lossTypes.map(l => (
                      <label key={l.value} className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-xs font-semibold ${form2.watch('lossType') === l.value ? 'border-petblue-400 bg-petblue-50 text-petblue-600' : 'border-gray-200 text-gray-500 hover:border-petblue-200'}`}>
                        <input {...form2.register('lossType')} type="radio" value={l.value} className="sr-only" />
                        {l.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quando aconteceu?</label>
                  <select {...form2.register('lossTime')} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 bg-white">
                    <option value="">Selecione...</option>
                    {lossTimes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Como você está se sentindo agora? <span className="text-petblue-500">({form2.watch('moodScore')}/10)</span>
                  </label>
                  <input {...form2.register('moodScore')} type="range" min="1" max="10" className="w-full accent-petblue-400" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>😔 Muito mal</span>
                    <span>😌 Bem</span>
                  </div>
                </div>

                {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-petblue-200">
                    Voltar
                  </button>
                  <button type="submit" disabled={form2.formState.isSubmitting} className="flex-1 py-3 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 disabled:opacity-60 flex items-center justify-center gap-2">
                    {form2.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Criar minha conta
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="text-7xl mb-6 animate-bounce">🌱</div>
              <h1 className="font-serif text-3xl font-bold text-gray-800 mb-3">Conta criada!</h1>
              {step1Data?.userType === 'professional' ? (
                <>
                  <p className="text-gray-500 mb-2">Bem-vindo(a) à PetApoio!</p>
                  <p className="text-gray-400 text-sm mb-8">Verifique seu e-mail e aguarde a ativação do seu perfil profissional.</p>
                  <Link href="/auth/login" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-petblue-400 text-white font-bold hover:bg-petblue-500 transition-colors">
                    Fazer Login
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-gray-500 mb-2">Verifique seu e-mail para confirmar sua conta.</p>
                  <p className="text-gray-400 text-sm mb-8">Depois da confirmação, você poderá encontrar seu psicólogo.</p>
                  <Link href="/profissionais" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-petblue-400 text-white font-bold hover:bg-petblue-500 transition-colors">
                    Conhecer Profissionais
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
