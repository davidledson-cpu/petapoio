'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { DollarSign, TrendingUp, Calendar, Download, Filter, Clock } from 'lucide-react'

interface Session {
  id: string
  email: string
  name: string
  role: string
}

interface Transaction {
  id: string
  patient_name: string
  date: string
  amount: number
  status: 'completed' | 'pending' | 'cancelled'
  type: string
}

export default function FinanceiroPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [filterStatus, setFilterStatus] = useState('all')

  const transactions: Transaction[] = [
    { id: '1', patient_name: 'Ana Carolina Silva', date: '2026-03-27', amount: 150, status: 'completed', type: 'Sess\u00e3o Individual' },
    { id: '2', patient_name: 'Pedro Santos', date: '2026-03-26', amount: 150, status: 'completed', type: 'Sess\u00e3o Individual' },
    { id: '3', patient_name: 'Maria Souza', date: '2026-03-25', amount: 200, status: 'completed', type: 'Sess\u00e3o Casal' },
    { id: '4', patient_name: 'Carlos Lima', date: '2026-03-24', amount: 150, status: 'pending', type: 'Sess\u00e3o Individual' },
    { id: '5', patient_name: 'Julia Costa', date: '2026-03-23', amount: 150, status: 'completed', type: 'Sess\u00e3o Individual' },
    { id: '6', patient_name: 'Roberto Alves', date: '2026-03-22', amount: 150, status: 'cancelled', type: 'Sess\u00e3o Individual' },
    { id: '7', patient_name: 'Fernanda Reis', date: '2026-03-21', amount: 200, status: 'completed', type: 'Sess\u00e3o Casal' },
    { id: '8', patient_name: 'Lucas Mendes', date: '2026-03-20', amount: 150, status: 'completed', type: 'Sess\u00e3o Individual' },
  ]

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

  const totalRevenue = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
  const pendingRevenue = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0)
  const completedCount = transactions.filter(t => t.status === 'completed').length
  const filteredTransactions = filterStatus === 'all' ? transactions : transactions.filter(t => t.status === filterStatus)

  const statusColors: Record<string, string> = { completed: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-red-100 text-red-700' }
  const statusLabels: Record<string, string> = { completed: 'Conclu\u00eddo', pending: 'Pendente', cancelled: 'Cancelado' }

  return (
    <DashboardLayout userRole="professional" userName={session?.name || ''}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3 mb-2"><DollarSign className="w-8 h-8 text-petgreen-500" />Financeiro</h1>
            <p className="text-gray-600">Acompanhe seus ganhos e transa\u00e7\u00f5es</p>
          </div>
          <div className="flex gap-2">
            {['week','month','year'].map(period => (<button key={period} onClick={() => setSelectedPeriod(period)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedPeriod === period ? 'bg-petblue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{period === 'week' ? 'Semana' : period === 'month' ? 'M\u00eas' : 'Ano'}</button>))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-petgreen-50 to-petgreen-100 rounded-2xl p-6 border border-petgreen-200">
            <div className="flex items-center justify-between mb-4"><h3 className="text-gray-700 font-medium">Receita Total</h3><DollarSign className="w-5 h-5 text-petgreen-600" /></div>
            <p className="text-3xl font-serif font-bold text-gray-900">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
            <p className="text-sm text-petgreen-600 mt-2 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> +12% vs m\u00eas anterior</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-4"><h3 className="text-gray-700 font-medium">Pendente</h3><Clock className="w-5 h-5 text-yellow-600" /></div>
            <p className="text-3xl font-serif font-bold text-gray-900">R$ {pendingRevenue.toLocaleString('pt-BR')}</p>
            <p className="text-sm text-yellow-600 mt-2">Aguardando confirma\u00e7\u00e3o</p>
          </div>
          <div className="bg-gradient-to-br from-petblue-50 to-petblue-100 rounded-2xl p-6 border border-petblue-200">
            <div className="flex items-center justify-between mb-4"><h3 className="text-gray-700 font-medium">Sess\u00f5es Realizadas</h3><Calendar className="w-5 h-5 text-petblue-600" /></div>
            <p className="text-3xl font-serif font-bold text-gray-900">{completedCount}</p>
            <p className="text-sm text-petblue-600 mt-2">Este m\u00eas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-gray-900">Transa\u00e7\u00f5es</h2>
            <div className="flex gap-2">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="all">Todos</option><option value="completed">Conclu\u00eddos</option><option value="pending">Pendentes</option><option value="cancelled">Cancelados</option>
              </select>
              <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-200 flex items-center gap-2"><Download className="w-4 h-4" /> Exportar</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Paciente</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Tipo</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Data</th>
                <th className="text-right px-4 py-3 text-gray-600 font-semibold">Valor</th>
                <th className="text-center px-4 py-3 text-gray-600 font-semibold">Status</th>
              </tr></thead>
              <tbody>
                {filteredTransactions.map(t => (<tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{t.patient_name}</td>
                  <td className="px-4 py-3 text-gray-600">{t.type}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">R$ {t.amount.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-center"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[t.status]}`}>{statusLabels[t.status]}</span></td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
