'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Download, BarChart3, Users, Heart, TrendingUp, Star } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ChartDataPoint {
  month: string
  value: number
}

export default function RelatoriosPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null)

  useEffect(() => {
    const userSession = getSession()
    if (!userSession) {
      router.push('/auth/login')
      return
    }
    setSession(userSession)
  }, [router])

  // Mock data for charts
  const userGrowthData: ChartDataPoint[] = [
    { month: 'Abr 23', value: 45 },
    { month: 'Mai 23', value: 52 },
    { month: 'Jun 23', value: 68 },
    { month: 'Jul 23', value: 85 },
    { month: 'Ago 23', value: 112 },
    { month: 'Set 23', value: 145 },
    { month: 'Out 23', value: 189 },
    { month: 'Nov 23', value: 234 },
    { month: 'Dez 23', value: 298 },
    { month: 'Jan 24', value: 385 },
    { month: 'Fev 24', value: 456 },
    { month: 'Mar 24', value: 523 },
  ]

  const sessionsPerMonthData: ChartDataPoint[] = [
    { month: 'Abr 23', value: 12 },
    { month: 'Mai 23', value: 28 },
    { month: 'Jun 23', value: 45 },
    { month: 'Jul 23', value: 87 },
    { month: 'Ago 23', value: 134 },
    { month: 'Set 23', value: 189 },
    { month: 'Out 23', value: 245 },
    { month: 'Nov 23', value: 312 },
    { month: 'Dez 23', value: 398 },
    { month: 'Jan 24', value: 521 },
    { month: 'Fev 24', value: 678 },
    { month: 'Mar 24', value: 845 },
  ]

  const revenuePerMonthData: ChartDataPoint[] = [
    { month: 'Abr 23', value: 1800 },
    { month: 'Mai 23', value: 4200 },
    { month: 'Jun 23', value: 6750 },
    { month: 'Jul 23', value: 13050 },
    { month: 'Ago 23', value: 20100 },
    { month: 'Set 23', value: 28350 },
    { month: 'Out 23', value: 36750 },
    { month: 'Nov 23', value: 46800 },
    { month: 'Dez 23', value: 59700 },
    { month: 'Jan 24', value: 78150 },
    { month: 'Fev 24', value: 101700 },
    { month: 'Mar 24', value: 127050 },
  ]

  const topProfessionals = [
    { id: 1, name: 'Dra. Ana Costa', rating: 4.9, sessions: 203, revenue: 36540 },
    { id: 2, name: 'Dr. Marcos Oliveira', rating: 4.8, sessions: 156, revenue: 31200 },
    { id: 3, name: 'Dra. Marina Santos', rating: 4.7, sessions: 142, revenue: 19880 },
    { id: 4, name: 'Dr. Felipe Alves', rating: 4.6, sessions: 127, revenue: 21590 },
    { id: 5, name: 'Psic. Roberto Lima', rating: 4.7, sessions: 98, revenue: 15680 },
  ]

  const engagementMetrics = {
    avgSessionsPerUser: 1.6,
    checkInRate: 78.5,
    retentionRate: 82.3,
  }

  const maxUserGrowth = Math.max(...userGrowthData.map(d => d.value))
  const maxSessions = Math.max(...sessionsPerMonthData.map(d => d.value))
  const maxRevenue = Math.max(...revenuePerMonthData.map(d => d.value))

  const handleExportCSV = () => {
    setDownloadStatus('downloading')
    setTimeout(() => {
      setDownloadStatus('success')
      setTimeout(() => setDownloadStatus(null), 3000)
    }, 1500)
  }

  const handleExportPDF = () => {
    setDownloadStatus('downloading')
    setTimeout(() => {
      setDownloadStatus('success')
      setTimeout(() => setDownloadStatus(null), 3000)
    }, 1500)
  }

  if (!session) return null

  const ChartBars = ({ data, maxValue }: { data: ChartDataPoint[]; maxValue: number }) => (
    <div className="flex items-end justify-between h-48 gap-1">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center group">
          <div
            className="w-full bg-gradient-to-t from-petblue-400 to-petblue-500 rounded-t-lg transition-all hover:opacity-80"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
            title={`${item.month}: ${item.value}`}
          />
          <p className="text-xs text-gray-400 mt-2 text-center">{item.month}</p>
        </div>
      ))}
    </div>
  )

  return (
    <DashboardLayout userRole="admin" userName={session.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Relatórios & Analytics</h1>
            <p className="text-gray-500 mt-1">Análise de dados e métricas da plataforma</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              disabled={downloadStatus === 'downloading'}
              className="px-4 py-2.5 bg-petblue-600 text-white rounded-xl font-semibold hover:bg-petblue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloadStatus === 'downloading' ? 'Exportando...' : downloadStatus === 'success' ? 'Baixado!' : 'CSV'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={downloadStatus === 'downloading'}
              className="px-4 py-2.5 bg-petgreen-600 text-white rounded-xl font-semibold hover:bg-petgreen-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloadStatus === 'downloading' ? 'Exportando...' : downloadStatus === 'success' ? 'Baixado!' : 'PDF'}
            </button>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Crescimento de Usuários - Últimos 12 Meses</h2>
          <ChartBars data={userGrowthData} maxValue={maxUserGrowth} />
        </div>

        {/* Sessions Per Month Chart */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Sessões por Mês - Últimos 12 Meses</h2>
          <ChartBars data={sessionsPerMonthData} maxValue={maxSessions} />
        </div>

        {/* Revenue Per Month Chart */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Receita por Mês - Últimos 12 Meses</h2>
          <ChartBars data={revenuePerMonthData} maxValue={maxRevenue} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Professionals */}
          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Top 5 Profissionais por Sessões</h2>
            <div className="space-y-3">
              {topProfessionals.map((prof, idx) => (
                <div key={prof.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{prof.name}</p>
                      <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg">
                        #{idx + 1}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {prof.sessions} sessões • ⭐ {prof.rating} • {formatCurrency(prof.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm space-y-4">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Métricas de Engajamento</h2>

            <div className="bg-gradient-to-br from-petblue-50 to-petblue-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-petblue-900">Média de Sessões por Usuário</p>
                <Users className="w-5 h-5 text-petblue-600" />
              </div>
              <p className="text-3xl font-bold text-petblue-600">{engagementMetrics.avgSessionsPerUser}</p>
            </div>

            <div className="bg-gradient-to-br from-petgreen-50 to-petgreen-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-petgreen-900">Taxa de Check-in Emocional</p>
                <Heart className="w-5 h-5 text-petgreen-600" />
              </div>
              <p className="text-3xl font-bold text-petgreen-600">{engagementMetrics.checkInRate.toFixed(1)}%</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-emerald-900">Taxa de Retenção</p>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-emerald-600">{engagementMetrics.retentionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
