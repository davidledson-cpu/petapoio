'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Settings, Save, Check } from 'lucide-react'

interface Session {
  id: string
  email: string
  name: string
  role: string
}

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [fullName, setFullName] = useState('Dr. Marcos Oliveira')
  const [crp, setCrp] = useState('06/123456')
  const [bio, setBio] = useState('Psicólogo especialista em terapia animal com 10 anos de experiência.')
  const [sessionPrice, setSessionPrice] = useState('150')
  const [sessionDuration, setSessionDuration] = useState('50')

  const [specialties, setSpecialties] = useState({
    'Luto Animal': true,
    'Trauma': true,
    'Ansiedade': false,
    'Depressão': false,
    'TCC': false,
    'Psicanálise': false,
    'Humanista': false,
    'Terapia Familiar': false,
  })

  const [languages, setLanguages] = useState({
    'Português': true,
    'Inglês': true,
  })

  useEffect(() => {
    const checkSession = () => {
      const currentSession = getSession()
      if (!currentSession) {
        router.push('/auth/login')
        return
      }
      setSession(currentSession)
      setLoading(false)
    }
    checkSession()
  }, [router])

  if (loading) {
    return (
      <DashboardLayout userRole="professional" userName="Carregando...">
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-500">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleSpecialtyChange = (specialty: string) => {
    setSpecialties(prev => ({
      ...prev,
      [specialty]: !prev[specialty as keyof typeof specialties],
    }))
  }

  const handleLanguageChange = (language: string) => {
    setLanguages(prev => ({
      ...prev,
      [language]: !prev[language as keyof typeof languages],
    }))
  }

  return (
    <DashboardLayout userRole="professional" userName={session?.name || ''}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-petblue-500" />
            Configurações
          </h1>
          <p className="text-gray-600">Gerencie seu perfil e preferências</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Informações Profissionais</h2>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-petblue-400 focus:ring-2 focus:ring-petblue-100"
              />
            </div>

            {/* CRP Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CRP (Número de Registro)</label>
              <input
                type="text"
                value={crp}
                onChange={(e) => setCrp(e.target.value)}
                placeholder="Ex: 06/123456"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-petblue-400 focus:ring-2 focus:ring-petblue-100"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Biografia</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-petblue-400 focus:ring-2 focus:ring-petblue-100"
              />
            </div>

            {/* Session Price */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Valor da Sessão (R$)</label>
                <input
                  type="number"
                  value={sessionPrice}
                  onChange={(e) => setSessionPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-petblue-400 focus:ring-2 focus:ring-petblue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duração da Sessão (minutos)</label>
                <input
                  type="number"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-petblue-400 focus:ring-2 focus:ring-petblue-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Specialties Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Especialidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(specialties).map(([specialty, checked]) => (
              <label key={specialty} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-petblue-300 hover:bg-petblue-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleSpecialtyChange(specialty)}
                  className="w-5 h-5 rounded accent-petblue-500"
                />
                <span className="text-sm font-medium text-gray-900">{specialty}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Languages Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Idiomas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(languages).map(([language, checked]) => (
              <label key={language} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-petgreen-300 hover:bg-petgreen-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleLanguageChange(language)}
                  className="w-5 h-5 rounded accent-petgreen-500"
                />
                <span className="text-sm font-medium text-gray-900">{language}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          {saveSuccess && (
            <div className="px-4 py-3 bg-petgreen-50 text-petgreen-700 rounded-lg text-sm font-semibold flex items-center gap-2 border border-petgreen-200">
              <Check className="w-5 h-5" />
              Salvo com sucesso!
            </div>
          )}
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-petblue-500 text-white rounded-xl font-bold hover:bg-petblue-600 transition-colors flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
