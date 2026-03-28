'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, ChevronRight, ChevronLeft, Check, MapPin, User, Briefcase, Clock, CreditCard } from 'lucide-react'

// ===== SCHEMAS =====

const step1Schema = z.object({
  userType: z.enum(['patient', 'professional']),
  fullName: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  birthDate: z.string().optional(),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

const addressSchema = z.object({
  cep: z.string().min(8, 'CEP inválido'),
  logradouro: z.string().min(1, 'Informe o logradouro'),
  numero: z.string().min(1, 'Informe o número'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Informe o bairro'),
  cidade: z.string().min(1, 'Informe a cidade'),
  estado: z.string().min(2, 'Selecione o estado'),
})

const professionalSchema = z.object({
  crp: z.string().min(1, 'Informe o registro profissional'),
  professionalType: z.string().min(1, 'Selecione o tipo'),
  education: z.string().min(1, 'Informe a formação'),
  specialization: z.string().optional(),
  approaches: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  yearsExperience: z.coerce.number().min(0, 'Informe os anos'),
  bio: z.string().min(50, 'Mínimo 50 caracteres').max(1000, 'Máximo 1000 caracteres'),
  languages: z.array(z.string()).optional(),
})

const availabilitySchema = z.object({
  modality: z.array(z.string()).min(1, 'Selecione ao menos uma modalidade'),
  sessionDuration: z.string().min(1, 'Selecione a duração'),
  sessionPrice: z.coerce.number().min(50, 'Valor mínimo R$ 50,00'),
  freeFirstSession: z.boolean().optional(),
  socialPrice: z.boolean().optional(),
  socialPriceValue: z.coerce.number().optional(),
  acceptsInsurance: z.boolean().optional(),
})

const bankingSchema = z.object({
  accountType: z.string().min(1, 'Selecione o tipo'),
  cpfCnpj: z.string().min(11, 'Informe o CPF ou CNPJ'),
  bank: z.string().min(1, 'Selecione o banco'),
  bankAccountType: z.string().min(1, 'Selecione o tipo de conta'),
  agency: z.string().min(1, 'Informe a agência'),
  account: z.string().min(1, 'Informe a conta'),
  accountHolder: z.string().min(1, 'Informe o titular'),
  pixKeyType: z.string().min(1, 'Selecione o tipo de chave'),
  pixKey: z.string().min(1, 'Informe a chave PIX'),
  pixPreferred: z.boolean().optional(),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: 'Aceite os termos para continuar' }) }),
  privacyAccepted: z.literal(true, { errorMap: () => ({ message: 'Aceite a política de privacidade' }) }),
  ethicsAccepted: z.literal(true, { errorMap: () => ({ message: 'Aceite o código de ética' }) }),
})

const petStep2Schema = z.object({
  petName: z.string().min(1, 'Informe o nome do seu pet'),
  petSpecies: z.enum(['dog', 'cat', 'bird', 'other']),
  lossType: z.enum(['death', 'disappearance', 'separation', 'other']),
  lossTime: z.enum(['recent', '1-3months', '3-12months', 'over1year']),
  moodScore: z.coerce.number().min(1).max(10),
})

type Step1Data = z.infer<typeof step1Schema>
type AddressData = z.infer<typeof addressSchema>
type ProfessionalData = z.infer<typeof professionalSchema>
type AvailabilityData = z.infer<typeof availabilitySchema>
type BankingData = z.infer<typeof bankingSchema>
type PetStep2Data = z.infer<typeof petStep2Schema>

// ===== CONSTANTS =====

const STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

const PROFESSIONAL_TYPES = [
  'Psicólogo(a)',
  'Psiquiatra',
  'Terapeuta Ocupacional',
  'Assistente Social',
  'Outro',
]

const APPROACHES = [
  'TCC (Terapia Cognitivo-Comportamental)',
  'Psicanálise',
  'Humanista',
  'Gestalt',
  'Sistêmica',
  'EMDR',
  'Mindfulness',
  'Outra',
]

const SPECIALTIES = [
  'Luto por perda de animal',
  'Luto por desaparecimento',
  'Luto por separação forçada',
  'Ansiedade pós-perda',
  'Depressão',
  'Apoio a famílias',
  'Apoio a crianças',
  'Trauma',
]

const LANGUAGES = ['Português', 'Inglês', 'Espanhol', 'Libras']

const BANKS = [
  'Banco do Brasil (001)', 'Bradesco (237)', 'Itaú Unibanco (341)', 'Santander (033)',
  'Caixa Econômica (104)', 'Nubank (260)', 'Inter (077)', 'C6 Bank (336)',
  'PagSeguro/PagBank (290)', 'Mercado Pago (323)', 'Sicoob (756)', 'Safra (422)',
  'Original (212)', 'Neon (655)', 'Outro',
]

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

// ===== STEP INDICATOR =====

function StepIndicator({ currentStep, totalSteps, labels }: { currentStep: number; totalSteps: number; labels: string[] }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {labels.map((label, i) => {
          const stepNum = i + 1
          const isActive = stepNum === currentStep
          const isDone = stepNum < currentStep
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                isDone ? 'bg-green-500 text-white' : isActive ? 'bg-petblue-400 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {isDone ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-[10px] text-center leading-tight ${isActive ? 'text-petblue-500 font-semibold' : 'text-gray-400'}`}>{label}</span>
            </div>
          )
        })}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-petblue-400 rounded-full transition-all duration-500" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
      </div>
    </div>
  )
}

// ===== CHECKBOX GROUP =====

function CheckboxGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt))
    else onChange([...selected, opt])
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(opt => (
        <label key={opt} className={`cursor-pointer p-2.5 rounded-lg border-2 text-xs font-medium transition-all ${
          selected.includes(opt) ? 'border-petblue-400 bg-petblue-50 text-petblue-700' : 'border-gray-200 text-gray-600 hover:border-petblue-200'
        }`}>
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="sr-only" />
          {opt}
        </label>
      ))}
    </div>
  )
}

// ===== MAIN COMPONENT =====

export default function CadastroPage() {
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [addressData, setAddressData] = useState<AddressData | null>(null)
  const [professionalData, setProfessionalData] = useState<ProfessionalData | null>(null)
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loadingCep, setLoadingCep] = useState(false)
  const router = useRouter()

  // Form hooks
  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema), defaultValues: { userType: 'patient' } })
  const formAddress = useForm<AddressData>({ resolver: zodResolver(addressSchema) })
  const formProfessional = useForm<ProfessionalData>({ resolver: zodResolver(professionalSchema), defaultValues: { approaches: [], specialties: [], languages: ['Português'], yearsExperience: 1 } })
  const formAvailability = useForm<AvailabilityData>({ resolver: zodResolver(availabilitySchema), defaultValues: { modality: [], sessionDuration: '50', sessionPrice: 150, freeFirstSession: false, socialPrice: false, acceptsInsurance: false } })
  const formBanking = useForm<BankingData>({ resolver: zodResolver(bankingSchema), defaultValues: { pixPreferred: true, termsAccepted: false, privacyAccepted: false, ethicsAccepted: false } })
  const formPet = useForm<PetStep2Data>({ resolver: zodResolver(petStep2Schema), defaultValues: { moodScore: 5 } })

  const userType = form1.watch('userType')
  const isProfessional = userType === 'professional'

  // CEP auto-fill
  const handleCepBlur = async (cep: string) => {
    const clean = cep.replace(/\D/g, '')
    if (clean.length !== 8) return
    setLoadingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await res.json()
      if (!data.erro) {
        formAddress.setValue('logradouro', data.logradouro || '')
        formAddress.setValue('bairro', data.bairro || '')
        formAddress.setValue('cidade', data.localidade || '')
        formAddress.setValue('estado', data.uf || '')
      }
    } catch {}
    setLoadingCep(false)
  }

  // Step handlers
  const onStep1 = (data: Step1Data) => {
    setStep1Data(data)
    if (data.userType === 'professional') {
      setStep(2) // Go to address
    } else {
      setStep(2) // Go to pet info
    }
  }

  const onAddress = (data: AddressData) => {
    setAddressData(data)
    setStep(3)
  }

  const onProfessional = (data: ProfessionalData) => {
    setProfessionalData(data)
    setStep(4)
  }

  const onAvailability = (data: AvailabilityData) => {
    setAvailabilityData(data)
    setStep(5)
  }

  const onBanking = async (data: BankingData) => {
    setError('')
    try {
      // Submit all professional data
      await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: step1Data?.fullName,
          email: step1Data?.email,
          phone: step1Data?.phone,
          role: 'professional',
          crp: professionalData?.crp,
          professionalType: professionalData?.professionalType,
          address: addressData,
          professional: professionalData,
          availability: availabilityData,
          banking: { ...data, pixKey: '***', account: '***' }, // Masked
        }),
      }).catch(() => {})
      setStep(6) // Success
    } catch {
      setError('Ops, algo deu errado. Tente novamente ou contate suporte@petapoio.com.br.')
    }
  }

  const onPetStep2 = async (data: PetStep2Data) => {
    if (!step1Data) return
    setError('')
    try {
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
      setStep(6) // Success
    } catch {
      setError('Ops, algo deu errado. Tente novamente.')
    }
  }

  // Professional steps config
  const proStepLabels = ['Dados', 'Endereço', 'Profissional', 'Valores', 'Financeiro']
  const proTotalSteps = 5

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5"
  const errorClass = "text-xs text-red-500 mt-1"

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">{'🐾'}</div>
          <span className="font-serif font-bold text-xl text-white">PetApoio</span>
        </Link>
        <div className="text-white">
          <div className="text-6xl mb-6">{'💙'}</div>
          <h2 className="font-serif text-3xl font-bold mb-4">
            {isProfessional ? 'Faça parte da nossa rede de cuidado' : 'Sua jornada começa aqui'}
          </h2>
          <p className="text-white/80 text-base leading-relaxed max-w-sm">
            {isProfessional
              ? 'Cadastre-se como profissional e ajude tutores a atravessar o momento mais difícil com seus animais de estimação.'
              : 'Em menos de 5 minutos, você estará conectado a um psicólogo especializado em luto animal.'}
          </p>
        </div>
        <p className="text-white/40 text-sm">{'©'} 2026 PetApoio</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-start justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg py-4">

          {/* STEP 1: Account creation */}
          {step === 1 && (
            <>
              <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">Criar conta gratuita</h1>
              <p className="text-gray-500 text-sm mb-6">
                Já tem conta?{' '}
                <Link href="/auth/login" className="text-petblue-500 font-semibold hover:underline">Entrar</Link>
              </p>

              <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
                {/* User type */}
                <div>
                  <label className={labelClass}>Você é:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'patient', label: '🐾 Tutor(a) de Pet', desc: 'Busco apoio emocional' },
                      { value: 'professional', label: '🩺 Profissional de Saúde', desc: 'Quero atender pacientes' },
                    ].map(opt => (
                      <label key={opt.value} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                        form1.watch('userType') === opt.value ? 'border-petblue-400 bg-petblue-50' : 'border-gray-200 hover:border-petblue-200'
                      }`}>
                        <input {...form1.register('userType')} type="radio" value={opt.value} className="sr-only" />
                        <div className="text-sm font-bold text-gray-800">{opt.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className={labelClass}>Nome completo</label>
                  <input {...form1.register('fullName')} placeholder="Seu nome completo" className={inputClass} />
                  {form1.formState.errors.fullName && <p className={errorClass}>{form1.formState.errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>E-mail</label>
                  <input {...form1.register('email')} type="email" placeholder="seu@email.com" className={inputClass} />
                  {form1.formState.errors.email && <p className={errorClass}>{form1.formState.errors.email.message}</p>}
                </div>

                {/* Phone - professionals */}
                {isProfessional && (
                  <div>
                    <label className={labelClass}>Telefone / WhatsApp</label>
                    <input {...form1.register('phone')} placeholder="(XX) XXXXX-XXXX" className={inputClass} />
                  </div>
                )}

                {/* CPF - professionals */}
                {isProfessional && (
                  <div>
                    <label className={labelClass}>CPF</label>
                    <input {...form1.register('cpf')} placeholder="000.000.000-00" className={inputClass} />
                  </div>
                )}

                {/* Birth date - professionals */}
                {isProfessional && (
                  <div>
                    <label className={labelClass}>Data de nascimento</label>
                    <input {...form1.register('birthDate')} type="date" className={inputClass} />
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className={labelClass}>Senha</label>
                  <div className="relative">
                    <input {...form1.register('password')} type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" className={`${inputClass} pr-12`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form1.formState.errors.password && <p className={errorClass}>{form1.formState.errors.password.message}</p>}
                </div>

                {/* Confirm password */}
                <div>
                  <label className={labelClass}>Confirmar senha</label>
                  <input {...form1.register('confirmPassword')} type="password" placeholder="Repita a senha" className={inputClass} />
                  {form1.formState.errors.confirmPassword && <p className={errorClass}>{form1.formState.errors.confirmPassword.message}</p>}
                </div>

                {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>}

                <button type="submit" disabled={form1.formState.isSubmitting} className="w-full py-3.5 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {form1.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Próxima etapa
                  <ChevronRight className="w-4 h-4" />
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

          {/* PROFESSIONAL STEP 2: Address */}
          {step === 2 && isProfessional && (
            <>
              <StepIndicator currentStep={2} totalSteps={proTotalSteps} labels={proStepLabels} />
              <h1 className="font-serif text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-petblue-400" /> Endereço
              </h1>
              <p className="text-gray-500 text-sm mb-6">Informe seu endereço profissional.</p>

              <form onSubmit={formAddress.handleSubmit(onAddress)} className="space-y-4">
                <div>
                  <label className={labelClass}>CEP</label>
                  <div className="relative">
                    <input {...formAddress.register('cep')} placeholder="00000-000" className={inputClass}
                      onBlur={(e) => handleCepBlur(e.target.value)} />
                    {loadingCep && <Loader2 className="w-4 h-4 animate-spin absolute right-4 top-1/2 -translate-y-1/2 text-petblue-400" />}
                  </div>
                  {formAddress.formState.errors.cep && <p className={errorClass}>{formAddress.formState.errors.cep.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Logradouro</label>
                  <input {...formAddress.register('logradouro')} placeholder="Rua, Avenida..." className={inputClass} />
                  {formAddress.formState.errors.logradouro && <p className={errorClass}>{formAddress.formState.errors.logradouro.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Número</label>
                    <input {...formAddress.register('numero')} placeholder="Nº" className={inputClass} />
                    {formAddress.formState.errors.numero && <p className={errorClass}>{formAddress.formState.errors.numero.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Complemento</label>
                    <input {...formAddress.register('complemento')} placeholder="Sala, andar..." className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Bairro</label>
                  <input {...formAddress.register('bairro')} placeholder="Bairro" className={inputClass} />
                  {formAddress.formState.errors.bairro && <p className={errorClass}>{formAddress.formState.errors.bairro.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Cidade</label>
                    <input {...formAddress.register('cidade')} placeholder="Cidade" className={inputClass} />
                    {formAddress.formState.errors.cidade && <p className={errorClass}>{formAddress.formState.errors.cidade.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>UF</label>
                    <select {...formAddress.register('estado')} className={inputClass}>
                      <option value="">UF</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {formAddress.formState.errors.estado && <p className={errorClass}>{formAddress.formState.errors.estado.message}</p>}
                  </div>
                </div>

                {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-petblue-200 flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 flex items-center justify-center gap-2">
                    Próxima etapa <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}

          {/* PROFESSIONAL STEP 3: Professional data */}
          {step === 3 && isProfessional && (
            <>
              <StepIndicator currentStep={3} totalSteps={proTotalSteps} labels={proStepLabels} />
              <h1 className="font-serif text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-petblue-400" /> Dados Profissionais
              </h1>
              <p className="text-gray-500 text-sm mb-6">Informações sobre sua formação e atuação.</p>

              <form onSubmit={formProfessional.handleSubmit(onProfessional)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Registro profissional (CRP/CRM)</label>
                    <input {...formProfessional.register('crp')} placeholder="Ex: 06/123456" className={inputClass} />
                    {formProfessional.formState.errors.crp && <p className={errorClass}>{formProfessional.formState.errors.crp.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Tipo de profissional</label>
                    <select {...formProfessional.register('professionalType')} className={inputClass}>
                      <option value="">Selecione...</option>
                      {PROFESSIONAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {formProfessional.formState.errors.professionalType && <p className={errorClass}>{formProfessional.formState.errors.professionalType.message}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Formação acadêmica</label>
                  <input {...formProfessional.register('education')} placeholder="Instituição, curso e ano de conclusão" className={inputClass} />
                  {formProfessional.formState.errors.education && <p className={errorClass}>{formProfessional.formState.errors.education.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Especializações / Pós-graduação (opcional)</label>
                  <input {...formProfessional.register('specialization')} placeholder="Cursos, mestrado, doutorado..." className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Anos de experiência clínica</label>
                  <input {...formProfessional.register('yearsExperience')} type="number" min="0" className={inputClass} />
                  {formProfessional.formState.errors.yearsExperience && <p className={errorClass}>{formProfessional.formState.errors.yearsExperience.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Abordagem terapêutica</label>
                  <CheckboxGroup
                    options={APPROACHES}
                    selected={formProfessional.watch('approaches') || []}
                    onChange={(v) => formProfessional.setValue('approaches', v)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Especialidades</label>
                  <CheckboxGroup
                    options={SPECIALTIES}
                    selected={formProfessional.watch('specialties') || []}
                    onChange={(v) => formProfessional.setValue('specialties', v)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Idiomas de atendimento</label>
                  <CheckboxGroup
                    options={LANGUAGES}
                    selected={formProfessional.watch('languages') || []}
                    onChange={(v) => formProfessional.setValue('languages', v)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Biografia profissional</label>
                  <textarea {...formProfessional.register('bio')} rows={4} placeholder="Conte um pouco sobre sua experiência e como você pode ajudar tutores enlutados..." className={inputClass} />
                  <div className="flex justify-between mt-1">
                    {formProfessional.formState.errors.bio && <p className={errorClass}>{formProfessional.formState.errors.bio.message}</p>}
                    <span className="text-xs text-gray-400 ml-auto">{(formProfessional.watch('bio') || '').length}/1000</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-petblue-200 flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 flex items-center justify-center gap-2">
                    Próxima etapa <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}

          {/* PROFESSIONAL STEP 4: Availability & Pricing */}
          {step === 4 && isProfessional && (
            <>
              <StepIndicator currentStep={4} totalSteps={proTotalSteps} labels={proStepLabels} />
              <h1 className="font-serif text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Clock className="w-6 h-6 text-petblue-400" /> Disponibilidade e Valores
              </h1>
              <p className="text-gray-500 text-sm mb-6">Configure como e quando você atende.</p>

              <form onSubmit={formAvailability.handleSubmit(onAvailability)} className="space-y-4">
                <div>
                  <label className={labelClass}>Modalidade de atendimento</label>
                  <CheckboxGroup
                    options={['Online (vídeo)', 'Online (áudio)', 'Presencial', 'Híbrido']}
                    selected={formAvailability.watch('modality') || []}
                    onChange={(v) => formAvailability.setValue('modality', v)}
                  />
                  {formAvailability.formState.errors.modality && <p className={errorClass}>{formAvailability.formState.errors.modality.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Duração da sessão</label>
                    <select {...formAvailability.register('sessionDuration')} className={inputClass}>
                      <option value="30">30 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="50">50 minutos (padrão)</option>
                      <option value="60">60 minutos</option>
                      <option value="90">90 minutos</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Valor da sessão (R$)</label>
                    <input {...formAvailability.register('sessionPrice')} type="number" min="50" step="10" className={inputClass} />
                    {formAvailability.formState.errors.sessionPrice && <p className={errorClass}>{formAvailability.formState.errors.sessionPrice.message}</p>}
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" {...formAvailability.register('freeFirstSession')} className="w-4 h-4 accent-petblue-400" />
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Oferecer primeira sessão gratuita</span>
                      <p className="text-xs text-gray-400">Recomendado para atrair novos pacientes</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" {...formAvailability.register('socialPrice')} className="w-4 h-4 accent-petblue-400" />
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Oferecer preço social</span>
                      <p className="text-xs text-gray-400">Valor reduzido para quem precisa</p>
                    </div>
                  </label>

                  {formAvailability.watch('socialPrice') && (
                    <div className="ml-7">
                      <label className={labelClass}>Valor social (R$)</label>
                      <input {...formAvailability.register('socialPriceValue')} type="number" min="30" step="10" placeholder="Mín. R$ 30,00" className={inputClass} />
                    </div>
                  )}

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" {...formAvailability.register('acceptsInsurance')} className="w-4 h-4 accent-petblue-400" />
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Aceita plano de saúde</span>
                      <p className="text-xs text-gray-400">Informe os convênios no seu perfil</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(3)} className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-petblue-200 flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 flex items-center justify-center gap-2">
                    Próxima etapa <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}

          {/* PROFESSIONAL STEP 5: Banking & PIX */}
          {step === 5 && isProfessional && (
            <>
              <StepIndicator currentStep={5} totalSteps={proTotalSteps} labels={proStepLabels} />
              <h1 className="font-serif text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-petblue-400" /> Dados Bancários e PIX
              </h1>
              <p className="text-gray-500 text-sm mb-2">Dados para recebimento dos pagamentos.</p>
              <p className="text-xs text-petblue-500 bg-petblue-50 p-2 rounded-lg mb-6 flex items-center gap-1">
                {'🔒'} Seus dados financeiros são criptografados e protegidos pela LGPD.
              </p>

              <form onSubmit={formBanking.handleSubmit(onBanking)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Tipo de conta</label>
                    <select {...formBanking.register('accountType')} className={inputClass}>
                      <option value="">Selecione...</option>
                      <option value="pf">Pessoa Física (CPF)</option>
                      <option value="pj">Pessoa Jurídica (CNPJ)</option>
                    </select>
                    {formBanking.formState.errors.accountType && <p className={errorClass}>{formBanking.formState.errors.accountType.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>CPF ou CNPJ</label>
                    <input {...formBanking.register('cpfCnpj')} placeholder="Documento" className={inputClass} />
                    {formBanking.formState.errors.cpfCnpj && <p className={errorClass}>{formBanking.formState.errors.cpfCnpj.message}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Banco</label>
                  <select {...formBanking.register('bank')} className={inputClass}>
                    <option value="">Selecione o banco...</option>
                    {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {formBanking.formState.errors.bank && <p className={errorClass}>{formBanking.formState.errors.bank.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Tipo de conta bancária</label>
                  <select {...formBanking.register('bankAccountType')} className={inputClass}>
                    <option value="">Selecione...</option>
                    <option value="corrente">Conta Corrente</option>
                    <option value="poupanca">Conta Poupança</option>
                    <option value="pagamento">Conta Pagamento</option>
                  </select>
                  {formBanking.formState.errors.bankAccountType && <p className={errorClass}>{formBanking.formState.errors.bankAccountType.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Agência</label>
                    <input {...formBanking.register('agency')} placeholder="XXXX ou XXXX-X" className={inputClass} />
                    {formBanking.formState.errors.agency && <p className={errorClass}>{formBanking.formState.errors.agency.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Conta</label>
                    <input {...formBanking.register('account')} placeholder="XXXXXXX-X" className={inputClass} />
                    {formBanking.formState.errors.account && <p className={errorClass}>{formBanking.formState.errors.account.message}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Titular da conta</label>
                  <input {...formBanking.register('accountHolder')} placeholder="Nome conforme cadastro no banco" className={inputClass} />
                  {formBanking.formState.errors.accountHolder && <p className={errorClass}>{formBanking.formState.errors.accountHolder.message}</p>}
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-1">PIX {'—'} Recebimento rápido</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Tipo de chave PIX</label>
                      <select {...formBanking.register('pixKeyType')} className={inputClass}>
                        <option value="">Selecione...</option>
                        <option value="cpf">CPF/CNPJ</option>
                        <option value="email">E-mail</option>
                        <option value="phone">Telefone</option>
                        <option value="random">Chave aleatória</option>
                      </select>
                      {formBanking.formState.errors.pixKeyType && <p className={errorClass}>{formBanking.formState.errors.pixKeyType.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Chave PIX</label>
                      <input {...formBanking.register('pixKey')} placeholder="Sua chave PIX" className={inputClass} />
                      {formBanking.formState.errors.pixKey && <p className={errorClass}>{formBanking.formState.errors.pixKey.message}</p>}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer mt-3">
                    <input type="checkbox" {...formBanking.register('pixPreferred')} className="w-4 h-4 accent-petblue-400" />
                    <span className="text-sm text-gray-700">Preferir PIX para recebimentos (mais rápido)</span>
                  </label>
                </div>

                {/* Terms */}
                <div className="border-t pt-4 mt-4 space-y-3">
                  <h3 className="font-semibold text-gray-800 text-sm mb-2">Termos e Aceites</h3>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" {...formBanking.register('termsAccepted')} className="w-4 h-4 accent-petblue-400 mt-0.5" />
                    <span className="text-xs text-gray-600">Li e aceito os <Link href="/termos" className="text-petblue-500 underline">Termos de Uso</Link> da plataforma.</span>
                  </label>
                  {formBanking.formState.errors.termsAccepted && <p className={errorClass}>{formBanking.formState.errors.termsAccepted.message}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" {...formBanking.register('privacyAccepted')} className="w-4 h-4 accent-petblue-400 mt-0.5" />
                    <span className="text-xs text-gray-600">Li e aceito a <Link href="/privacidade" className="text-petblue-500 underline">Política de Privacidade</Link> (LGPD).</span>
                  </label>
                  {formBanking.formState.errors.privacyAccepted && <p className={errorClass}>{formBanking.formState.errors.privacyAccepted.message}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" {...formBanking.register('ethicsAccepted')} className="w-4 h-4 accent-petblue-400 mt-0.5" />
                    <span className="text-xs text-gray-600">Li e aceito o <Link href="/etica" className="text-petblue-500 underline">Código de Ética</Link> da PetApoio.</span>
                  </label>
                  {formBanking.formState.errors.ethicsAccepted && <p className={errorClass}>{formBanking.formState.errors.ethicsAccepted.message}</p>}
                </div>

                {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(4)} className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-petblue-200 flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                  <button type="submit" disabled={formBanking.formState.isSubmitting} className="flex-1 py-3 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 flex items-center justify-center gap-2 disabled:opacity-60">
                    {formBanking.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Finalizar cadastro <Check className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}

          {/* PATIENT STEP 2: Pet info */}
          {step === 2 && !isProfessional && (
            <>
              <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Passo 2 de 2</span>
                  <span>Sobre você e seu pet</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-petblue-400 rounded-full transition-all duration-500" style={{ width: '66%' }} />
                </div>
              </div>

              <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">Conte seu momento {'🌿'}</h1>
              <p className="text-gray-500 text-sm mb-8">Suas respostas nos ajudam a encontrar o profissional ideal para você.</p>

              <form onSubmit={formPet.handleSubmit(onPetStep2)} className="space-y-5">
                <div>
                  <label className={labelClass}>Nome do seu pet</label>
                  <input {...formPet.register('petName')} placeholder="Como se chamava?" className={inputClass} />
                  {formPet.formState.errors.petName && <p className={errorClass}>{formPet.formState.errors.petName.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Espécie</label>
                  <div className="grid grid-cols-4 gap-2">
                    {petSpecies.map(s => (
                      <label key={s.value} className={`cursor-pointer text-center p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                        formPet.watch('petSpecies') === s.value ? 'border-petblue-400 bg-petblue-50 text-petblue-600' : 'border-gray-200 text-gray-500 hover:border-petblue-200'
                      }`}>
                        <input {...formPet.register('petSpecies')} type="radio" value={s.value} className="sr-only" />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Tipo de perda</label>
                  <div className="grid grid-cols-2 gap-2">
                    {lossTypes.map(l => (
                      <label key={l.value} className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                        formPet.watch('lossType') === l.value ? 'border-petblue-400 bg-petblue-50 text-petblue-600' : 'border-gray-200 text-gray-500 hover:border-petblue-200'
                      }`}>
                        <input {...formPet.register('lossType')} type="radio" value={l.value} className="sr-only" />
                        {l.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Quando aconteceu?</label>
                  <select {...formPet.register('lossTime')} className={`${inputClass} bg-white`}>
                    <option value="">Selecione...</option>
                    {lossTimes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Como você está se sentindo agora? <span className="text-petblue-500">({formPet.watch('moodScore')}/10)</span>
                  </label>
                  <input {...formPet.register('moodScore')} type="range" min="1" max="10" className="w-full accent-petblue-400" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{'😔'} Muito mal</span>
                    <span>{'😌'} Bem</span>
                  </div>
                </div>

                {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-petblue-200">
                    Voltar
                  </button>
                  <button type="submit" disabled={formPet.formState.isSubmitting} className="flex-1 py-3 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 disabled:opacity-60 flex items-center justify-center gap-2">
                    {formPet.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Criar minha conta
                  </button>
                </div>
              </form>
            </>
          )}

          {/* SUCCESS SCREEN */}
          {step === 6 && (
            <div className="text-center py-8">
              <div className="text-7xl mb-6 animate-bounce">{'🌱'}</div>
              <h1 className="font-serif text-3xl font-bold text-gray-800 mb-3">Cadastro realizado!</h1>
              {step1Data?.userType === 'professional' ? (
                <>
                  <p className="text-gray-500 mb-2">Bem-vindo(a) à rede PetApoio!</p>
                  <p className="text-gray-400 text-sm mb-4">Seus dados serão verificados em até 48 horas.</p>
                  <p className="text-gray-400 text-sm mb-8">Você receberá um e-mail quando seu perfil estiver ativo.</p>
                  <Link href="/auth/login" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-petblue-400 text-white font-bold hover:bg-petblue-500 transition-colors">
                    Fazer Login
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-gray-500 mb-2">Verifique seu e-mail para confirmar sua conta.</p>
                  <p className="text-gray-400 text-sm mb-8">Depois da confirmação, você poderá encontrar seu profissional.</p>
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
