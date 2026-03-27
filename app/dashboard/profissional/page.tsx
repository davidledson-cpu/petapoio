'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Calendar, DollarSign, Star, TrendingUp, Settings, FileText, Edit, MessageSquare } from 'lucide-react'

interface Session {
  id: string
  email: string
  name: string
  role: string
}

export default function ProfissionalDashboard() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

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

  const upcomingConsultations = [
    {
      id: '1',
      patientName: 'Ana Carolina Silva',
      time: '10:00',
      date: '2026-03-28',
      animal: 'Gato - Mimi',
    },
    {
      id: '2',
      patientName: 'Pedro Santos',
      time: '14:30',
      date: '2026-03-28',
      animal: 'Cachorro - Rex',
    },
    {
      id: '3',
      patientName: 'Maria Souza',
      time: '16:00',
      date: '2026-03-29',
      animal: 'Coelho - Fluffy',
    },
  ]

  const quickActions = [
    { label: 'Configurar Disponibilidade', icon: Calendar, href: '/dashboard/profissional/agenda' },
    { label: 'Relat\u00f3rio Financeiro', icon: FileText, href: '/dashboard/profissional/financeiro' },
    { label: 'Editar Perfil', icon: Edit, href: '/dashboard/profissional/configuracoes' },
    { label: 'Ver Avalia\u00e7\u00f5es', icon: MessageSquare, href: '#' },
  ]

  return (
    <DashboardLayout userRole="professional" userName={session?.name || ''}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            Bem-vindo, {session?.name || 'Profissional'}
          </h1>
          <p className="text-gray-600">Acompanhe seus atendimentos e resultados</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-petblue-50 to-petblue-100 rounded-2xl p-6 border border-petblue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-medium">Sess\u00f5es Realizadas</h3>
              <div className="bg-petblue-500 rounded-lg p-3">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-serif font-bold text-gray-900">48</p>
            <p className="text-sm text-gray-600 mt-2">Este m\u00eas</p>
          </div>

          <div className="bg-gradient-to-br from-petgreen-50 to-petgreen-100 rounded-2xl p-6 border border-petgreen-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-medium">Faturamento</h3>
              <div className="bg-petgreen-500 rounded-lg p-3">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-serif font-bold text-gray-900">R$ 7.200</p>
            <p className="text-sm text-gray-600 mt-2">Este m\u00eas</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-medium">Avalia\u00e7\u00e3o</h3>
              <div className="bg-yellow-500 rounded-lg p-3">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-serif font-bold text-gray-900">5.0</p>
            <p className="text-sm text-gray-600 mt-2">Baseado em 48 avalia\u00e7\u00f5es</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-medium">Taxa de Retorno</h3>
              <div className="bg-purple-500 rounded-lg p-3">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-serif font-bold text-gray-900">78%</p>
            <p className="text-sm text-gray-600 mt-2">Pacientes recorrentes</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Pr\u00f3ximos Atendimentos
              </h2>
              <div className="space-y-4">
                {upcomingConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-petblue-50 to-transparent rounded-xl border border-petblue-100 hover:border-petblue-300 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-petblue-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-serif font-semibold text-gray-900">
                        {consultation.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">{consultation.animal}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-semibold text-gray-900">{consultation.time}</p>
                      <p className="text-sm text-gray-600">{consultation.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Status do Perfil</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm font-medium text-gray-900">Verificado</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">
                    Seu perfil est\u00e1 completo e verificado
                  </p>
                  <button className="w-full px-4 py-2 bg-petblue-500 text-white rounded-lg font-medium hover:bg-petblue-600 transition-colors">
                    Editar Perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">A\u00e7\u00f5es R\u00e1pidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => {
              const IconComponent = action.icon
              return (
                <a
                  key={idx}
                  href={action.href}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-petblue-300 hover:bg-petblue-50 transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-petblue-200 transition-colors">
                    <IconComponent className="w-5 h-5 text-gray-700 group-hover:text-petblue-600 transition-colors" />
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-petblue-600 transition-colors">
                    {action.label}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
