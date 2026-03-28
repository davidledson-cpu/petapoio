'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, BarChart3, Download } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { getSession } from '@/lib/auth/session'

export default function HistoricoPage() {
  const router = useRouter()
  const session = getSession()

  useEffect(() => {
    if (!session) router.push('/auth/login')
  }, [session, router])

  if (!session) return null

  const timeline = [
    { date: '15 Jan 2025', title: 'Primeira Sessão', prof: 'Dr. Marcos Oliveira', type: '🎯 Marco' },
    { date: '22 Jan 2025', title: 'Sessão 2', prof: 'Dr. Marcos Oliveira', type: '📊 Progresso' },
    { date: '29 Jan 2025', title: 'Sessão 3', prof: 'Dra. Sofia Costa', type: '🚀 Avanço' },
    { date: '05 Fev 2025', title: 'Sessão 4', prof: 'Dr. Marcos Oliveira', type: '💪 Força' },
    { date: '12 Fev 2025', title: 'Sessão 5', prof: 'Dra. Sofia Costa', type: '⭐ Milestone' },
  ]

  const monthlySummaries = [
    { month: 'Janeiro 2025', sessions: 3, checkIns: 18, avgMood: 6.2 },
    { month: 'Fevereiro 2025', sessions: 4, checkIns: 22, avgMood: 7.1 },
    { month: 'Março 2025', sessions: 2, checkIns: 15, avgMood: 6.8 },
  ]

  return (
    <DashboardLayout userRole="patient" userName={session.name}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-petblue-400" />
              Minha Jornada
            </h1>
            <p className="text-gray-500 text-sm mt-1">Acompanhe seu histórico de sessões e milestones</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-petgreen-100 text-petgreen-700 text-sm font-bold hover:bg-petgreen-200 transition-colors border border-petgreen-200">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>

        {/* Monthly Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {monthlySummaries.map(summary => (
            <div key={summary.month} className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
              <p className="text-xs text-gray-500 font-semibold mb-3 capitalize">{summary.month}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sessões</span>
                  <span className="font-bold text-lg text-petblue-600">{summary.sessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Check-ins</span>
                  <span className="font-bold text-lg text-petgreen-600">{summary.checkIns}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Humor Médio</span>
                  <span className="font-bold text-lg text-yellow-600">{summary.avgMood}</span>
                </div>
 </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-petblue-400" />
            Timeline
          </h2>
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-petblue-400 flex-shrink-0 mt-1.5" />
                  {i < timeline.length - 1 && <div className="w-0.5 h-full bg-petblue-200 mt-1" />}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-gray-400">{item.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-petblue-50 text-petblue-600 font-semibold">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.prof}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-petblue-50 to-petgreen-50 rounded-2xl p-8 border border-petblue-200 text-center">
          <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">Continue sua jornada!</h3>
          <p className="text-gray-600 mb-4">A continuidade é chave para o progresso.</p>
          <a
            href="/profissionais"
            className="inline-block px-6 py-3 rounded-lg bg-petblue-400 text-white font-bold hover:bg-petblue-500 transition-colors"
          >
            Agendar próxima sessão
          </a>
        </div>
      </div>
    </DashboardLayout>
  )
}
