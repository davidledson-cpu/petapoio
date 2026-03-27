'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { DollarSign, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Transaction {
  id: number
  date: string
  type: 'income' | 'payout' | 'refund'
  description: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  professional?: string
}

interface ProfessionalRevenue {
  id: number
  name: string
  sessionsCount: number
  totalRevenue: number
}

export default function FinanceiroPage() {
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

  // Mock data
  const kpis = {
    totalRevenue: 276050,
    platformFees: 55210,
    professionalPayouts: 220840,
    monthlyRevenue: 23400,
    pendingPayouts: 4200,
  }

  const topProfessionals: ProfessionalRevenue[] = [
    {
      id: 1,
      name: 'Dr. Marcos Oliveira',
      sessionsCount: 156,
      totalRevenue: 31200,
    },
    {
      id: 2,
      name: 'Dra. Ana Costa',
      sessionsCount: 203,
      totalRevenue: 36540,
    },
    {
      id: 3,
      name: 'Psic. Roberto Lima',
      sessionsCount: 98,
      totalRevenue: 15680,
    },
    {
      id: 4,
      name: 'Dra. Marina Santos',
      sessionsCount: 142,
      totalRevenue: 19880,
    },
    {
      id: 5,
      name: 'Dr. Felipe Alves',
      sessionsCount: 127,
      totalRevenue: 21590,
    },
  ]

  const transactions: Transaction[] = [
    {
      id: 1,
      date: '2024-03-27',
      type: 'income',
      description: 'Sessão - Maria Silva com Dr. Marcos Oliveira',
      amount: 200,
      status: 'completed',
      professional: 'Dr. Marcos Oliveira',
    },
    {
      id: 2,
      date: '2024-03-27',
      type: 'payout',
      description: 'Pagamento a Dr. Marcos Oliveira',
      amount: 160,
      status: 'completed',
      professional: 'Dr. Marcos Oliveira',
    },
    {
      id: 3,
      date: '2024-03-27',
      type: 'income',
      description: 'Sessão - João Santos com Dra. Ana Costa',
      amount: 180,
      status: 'completed',
      professional: 'Dra. Ana Costa',
    },
    {
      id: 4,
      date: '2024-03-26',
      type: 'payout',
      description: 'Pagamento a Dra. Ana Costa',
      amount: 144,
      status: 'pending',
      professional: 'Dra. Ana Costa',
    },
    {
      id: 5,
      date: '2024-03-26',
      type: 'income',
      description: 'Sessão - Paula Oliveira com Psic. Roberto Lima',
      amount: 160,
      status: 'completed',
      professional: 'Psic. Roberto Lima',
    },
    {
      id: 6,
      date: '2024-03-26',
      type: 'refund',
      description: 'Reembolso - Cancelamento Lucas Pereira',
      amount: 140,
      status: 'completed',
    },
    {
      id: 7,
      date: '2024-03-25',
      type: 'income',
      description: 'Sessão - Fernanda Costa com Dra. Marina Santos',
      amount: 200,
      status: 'completed',
      professional: 'Dra. Marina Santos',
    },
    {
      id: 8,
      date: '2024-03-25',
      type: 'payout',
      description: 'Pagamento a Dra. Marina Santos',
      amount: 160,
      status: 'failed',
      professional: 'Dra. Marina Santos',
    },
  ]

  if (!session) return null

  const getStatusLabel = (status: string) => {
    if (status === 'completed') return 'Concluído'
    if (status === 'pending') return 'Pendente'
    return 'Falhou'
  }

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'text-green-600 bg-green-50'
    if (status === 'pending') return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getTransactionIcon = (type: string) => {
    if (type === 'income') return '↓'
    if (type === 'payout') return '↑'
    return '↪'
  }

  const getTransactionColor = (type: string) => {
    if (type === 'income') return 'text-green-600'
    if (type === 'payout') return 'text-blue-600'
    return 'text-orange-600'
  }

  return (
    <DashboardLayout userRole="admin" userName={session.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Gestão Financeira</h1>
          <p className="text-gray-500 mt-1">Receitas, taxas e pagamentos da plataforma</p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Receita Total</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(kpis.totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Taxas Plataforma</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(kpis.platformFees)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-petblue-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Pagamentos Profissionais</p>
                <p className="text-2xl font-bold text-petblue-600 mt-1">{formatCurrency(kpis.professionalPayouts)}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-petblue-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-yellow-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Receita Mês</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{formatCurrency(kpis.monthlyRevenue)}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Pagamentos Pendentes</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(kpis.pendingPayouts)}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-200" />
            </div>
          </div>
        </div>

        {/* Top Professionals by Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Top 5 Profissionais por Receita</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-petblue-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Profissional</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Sessões</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Receita Total</th>
                </tr>
              </thead>
              <tbody>
                {topProfessionals.map(prof => (
                  <tr key={prof.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{prof.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{prof.sessionsCount}</td>
                    <td className="px-6 py-4 text-sm font-bold text-petgreen-600 text-right">
                      {formatCurrency(prof.totalRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Histórico de Transações</h2>
          <div className="space-y-3">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getTransactionColor(
                        tx.type,
                      )} bg-opacity-10`}
                      style={{
                        backgroundColor:
                          tx.type === 'income'
                            ? 'rgb(34 197 94 / 0.1)'
                            : tx.type === 'payout'
                            ? 'rgb(59 130 246 / 0.1)'
                            : 'rgb(249 115 22 / 0.1)',
                      }}
                    >
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{tx.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${
                        tx.type === 'income'
                          ? 'text-green-600'
                          : tx.type === 'payout'
                          ? 'text-blue-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '−'} {formatCurrency(tx.amount)}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-block mt-1 ${getStatusColor(
                        tx.status,
                      )}`}
                    >
                      {getStatusLabel(tx.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
