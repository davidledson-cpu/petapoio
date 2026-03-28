'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { BarChart3, Users, TrendingUp, Star, Zap, Calendar } from 'lucide-react'

interface Session {
  id: string
  email: string
  name: string
  role: string
}

export default function AnalyticsPage() {
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

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
  const weekCounts = [2, 6, 5, 7, 6, 8, 4]
  const weekMax = Math.max(...weekCounts)

  const ratingDistribution = { 5: 32, 4: 12, 3: 3, 2: 1, 1: 0 }
  const totalRatings = Object.values(ratingDistribution).reduce((a, b) => a + b)

  return (
    <DashboardLayout userRole="professional" userName={session?.name || ''}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-petblue-500" />
            Analytics
          </h1>
          <p className="text-gray-600">Acompanhe seu desempenho e tendências</p>
        </div>

        {/* Key metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-petblue-50 to-petblue-100 rounded-2xl p-6 border border-petblue-200">
            <p className="text-sm text-gray-700 font-medium">Sessões por Dia</p>
            <p className="text-3xl font-serif font-bold text-petblue-600 mt-2">6.9</p>
            <p className="text-xs text-gray-600 mt-2">Média semanal</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
            <p className="text-sm text-gray-700 font-medium">Avaliação Média</p>
            <p className="text-3xl font-serif font-bold text-yellow-600 mt-2">4.8</p>
            <p className="text-xs text-gray-600 mt-2">Baseado em 48 avaliações</p>
          </div>

          <div className="bg-gradient-to-br from-petgreen-50 to-petgreen-100 rounded-2xl p-6 border border-petgreen-200">
            <p className="text-sm text-gray-700 font-medium">Taxa de Retenção</p>
            <p className="text-3xl font-serif font-bold text-petgreen-600 mt-2">78%</p>
            <p className="text-xs text-gray-600 mt-2">Pacientes recorrentes</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <p className="text-sm text-gray-700 font-medium">Duração Média</p>
            <p className="text-3xl font-serif font-bold text-purple-600 mt-2">48 min</p>
            <p className="text-xs text-gray-600 mt-2">Tempo por sessão</p>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sessions by day of week */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Sessões por Dia da Semana</h2>
            <div className="flex items-end justify-between gap-2 h-40">
              {weekDays.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-b from-petblue-400 to-petblue-200 rounded-t-lg relative group cursor-pointer hover:from-petblue-500 hover:to-petblue-300 transition-all"
                    style={{ height: `${(weekCounts[i] / weekMax) * 140}px` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {weekCounts[i]}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold mt-3">{day}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Distribuição de Avaliações</h2>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution] || 0
                const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0

                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-20">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 w-16 text-right">
                      {count} ({Math.round(percentage)}%)
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Peak hours heatmap */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Horários de Pico</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((time, idx) => (
              <div key={time} className="text-center">
                <div
                  className="w-full h-12 rounded-lg border border-gray-200 flex items-center justify-center text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${[0.3, 0.5, 0.7, 0.9, 0.6, 0.4][idx]})`,
                    color: [0.3, 0.5, 0.7, 0.9, 0.6, 0.4][idx] > 0.5 ? 'white' : '#1f2937',
                  }}
                >
                  {['3', '5', '7', '9', '6', '4'][idx]}
                </div>
                <p className="text-xs text-gray-600 mt-2">{time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key insights */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-petblue-50 to-petblue-100 rounded-2xl p-6 border border-petblue-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-serif font-bold text-petblue-900">Satisfação</h3>
              <Star className="w-5 h-5 text-petblue-500" />
            </div>
            <p className="text-2xl font-serif font-bold text-petblue-900">4.8/5</p>
            <p className="text-sm text-petblue-700 mt-3">Avaliação média de clientes</p>
          </div>

          <div className="bg-gradient-to-br from-petgreen-50 to-petgreen-100 rounded-2xl p-6 border border-petgreen-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-serif font-bold text-petgreen-900">Retenção</h3>
              <Users className="w-5 h-5 text-petgreen-500" />
            </div>
            <p className="text-2xl font-serif font-bold text-petgreen-900">78%</p>
            <p className="text-sm text-petgreen-700 mt-3">Pacientes que retornam</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-serif font-bold text-orange-900">Crescimento</h3>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-serif font-bold text-orange-900">+12%</p>
            <p className="text-sm text-orange-700 mt-3">Crescimento mensal</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
