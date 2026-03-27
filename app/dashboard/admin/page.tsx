'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { AlertCircle, Users, Shield, Calendar, DollarSign, Check, Eye, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function AdminDashboard() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const userSession = getSession()
    if (!userSession) {
      router.push('/auth/login')
      return
    }
    setSession(userSession)
  }, [router])

  if (!session) return null

  // Mock data
  const kpis = {
    totalUsers: 523,
    totalProfessionals: 42,
    totalAppointments: 1847,
    revenue: 276050,
    pendingVerifications: 3,
    subscriptions: 89,
  }

  const recentAppointments = [
    {
      id: 1,
      patient: 'Maria Silva',
      professional: 'Dra. Ana Costa',
      date: '2024-03-27T14:30:00',
      amount: 150,
      status: 'completed',
    },
    {
      id: 2,
      patient: 'João Santos',
      professional: 'Dr. Carlos Mendes',
      date: '2024-03-27T10:00:00',
      amount: 180,
      status: 'completed',
    },
    {
      id: 3,
      patient: 'Paula Oliveira',
      professional: 'Psic. Roberto Lima',
      date: '2024-03-28T09:00:00',
      amount: 160,
      status: 'scheduled',
    },
    {
      id: 4,
      patient: 'Lucas Pereira',
      professional: 'Dra. Marina Santos',
      date: '2024-03-28T15:30:00',
      amount: 140,
      status: 'scheduled',
    },
    {
      id: 5,
      patient: 'Fernanda Costa',
      professional: 'Dr. Felipe Alves',
      date: '2024-03-29T11:00:00',
      amount: 170,
      status: 'pending',
    },
  ]

  const recentUsers = [
    { id: 1, name: 'Alice Mendes', email: 'alice@example.com', role: 'patient', date: '2024-03-25' },
    { id: 2, name: 'Bruno Silva', email: 'bruno@example.com', role: 'professional', date: '2024-03-26' },
    { id: 3, name: 'Carla Gomes', email: 'carla@example.com', role: 'patient', date: '2024-03-26' },
    { id: 4, name: 'Daniel Rocha', email: 'daniel@example.com', role: 'patient', date: '2024-03-27' },
    { id: 5, name: 'Elisa Martins', email: 'elisa@example.com', role: 'professional', date: '2024-03-27' },
  ]

  // 30-day revenue data
  const revenueData = [
    { day: 1, value: 7200 },
    { day: 2, value: 8900 },
    { day: 3, value: 6500 },
    { day: 4, value: 9100 },
    { day: 5, value: 7800 },
    { day: 6, value: 8200 },
    { day: 7, value: 9500 },
    { day: 8, value: 8700 },
    { day: 9, value: 7900 },
    { day: 10, value: 8400 },
  ]

  const maxRevenue = Math.max(...revenueData.map(d => d.value))

  return (
    <DashboardLayout userRole="admin" userName={session.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-500 mt-1">Visão geral da plataforma PetApoio</p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-petblue-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Usuários</p>
                <p className="text-2xl font-bold text-petblue-600 mt-1">{kpis.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-petblue-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-petgreen-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Profissionais</p>
                <p className="text-2xl font-bold text-petgreen-600 mt-1">{kpis.totalProfessionals}</p>
              </div>
              <Shield className="w-8 h-8 text-petgreen-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Agendamentos</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{kpis.totalAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Receita Total</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(kpis.revenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-yellow-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Inscrições</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{kpis.subscriptions}</p>
              </div>
              <Check className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Pendentes</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{kpis.pendingVerifications}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-200" />
            </div>
          </div>
        </div>

        {/* Alert for pending verifications */}
        {kpis.pendingVerifications > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900">Profissionais Aguardando Verificação</h3>
              <p className="text-sm text-orange-700 mt-1">
                Você tem {kpis.pendingVerifications} profissional(is) aguardando verificação de documentos.
              </p>
            </div>
            <Link
              href="/dashboard/admin/profissionais"
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap"
            >
              Revisar
            </Link>
          </div>
        )}

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Receita - Últimos 10 Dias</h2>
          <div className="flex items-end justify-between h-32 gap-1">
            {revenueData.map(item => (
              <div key={item.day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-petblue-400 to-petblue-500 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                  title={`Dia ${item.day}: ${formatCurrency(item.value)}`}
                />
                <p className="text-xs text-gray-400 mt-2">{item.day}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-gray-900">Agendamentos Recentes</h2>
              <Link
                href="/dashboard/admin/financeiro"
                className="text-petblue-600 hover:text-petblue-700 text-sm font-semibold flex items-center gap-1"
              >
                Ver Tudo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentAppointments.map(apt => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{apt.patient}</p>
                    <p className="text-xs text-gray-500">{apt.professional}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-petgreen-600">{formatCurrency(apt.amount)}</p>
                    <span
                      className={`text-xs font-semibold ${
                        apt.status === 'completed'
                          ? 'text-green-600'
                          : apt.status === 'scheduled'
                          ? 'text-blue-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {apt.status === 'completed' ? 'Concluído' : apt.status === 'scheduled' ? 'Agendado' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-gray-900">Usuários Recentes</h2>
              <Link
                href="/dashboard/admin/usuarios"
                className="text-petblue-600 hover:text-petblue-700 text-sm font-semibold flex items-center gap-1"
              >
                Ver Tudo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : user.role === 'professional'
                        ? 'bg-petblue-100 text-petblue-700'
                        : 'bg-petgreen-100 text-petgreen-700'
                    }`}
                  >
                    {user.role === 'admin' ? 'Admin' : user.role === 'professional' ? 'Profissional' : 'Paciente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Acesso Rápido</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/dashboard/admin/usuarios"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-petblue-50 hover:bg-petblue-100 rounded-2xl transition-colors"
            >
              <Users className="w-6 h-6 text-petblue-600" />
              <span className="text-sm font-semibold text-gray-700 text-center">Usuários</span>
            </Link>
            <Link
              href="/dashboard/admin/profissionais"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-petgreen-50 hover:bg-petgreen-100 rounded-2xl transition-colors"
            >
              <Shield className="w-6 h-6 text-petgreen-600" />
              <span className="text-sm font-semibold text-gray-700 text-center">Profissionais</span>
            </Link>
            <Link
              href="/dashboard/admin/financeiro"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-colors"
            >
              <DollarSign className="w-6 h-6 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-700 text-center">Financeiro</span>
            </Link>
            <Link
              href="/dashboard/admin/relatorios"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors"
            >
              <Eye className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700 text-center">Relatórios</span>
            </Link>
            <Link
              href="/dashboard/admin/configuracoes"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-colors"
            >
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-semibold text-gray-700 text-center">Config.</span>
            </Link>
            <Link
              href="/"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <Calendar className="w-6 h-6 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700 text-center">Home</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
