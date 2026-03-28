'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, TrendingUp, Zap, Lock } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { getSession } from '@/lib/auth/session'

function getLevelInfo(points: number) {
  const levels = [
    { name: 'Semente', emoji: '🌱', minPoints: 0, maxPoints: 100 },
    { name: 'Broto', emoji: '🌿', minPoints: 100, maxPoints: 250 },
    { name: 'Floração', emoji: '🌸', minPoints: 250, maxPoints: 500 },
    { name: 'Fruto', emoji: '🌻', minPoints: 500, maxPoints: 1000 },
    { name: 'Árvore', emoji: '🌳', minPoints: 1000, maxPoints: Infinity },
  ]
  return levels.find(l => points >= l.minPoints && points < l.maxPoints) || levels[0]
}

const BADGES = [
  { id: 'first_session', name: 'Primeira Sessão', emoji: '🎉', description: 'Complete sua primeira sessão', points: 10 },
  { id: 'thirty_checkins', name: '30 Check-ins', emoji: '📊', description: 'Registre seu humor 30 vezes', points: 50 },
  { id: 'five_sessions', name: '5 Sessões', emoji: '🚀', description: 'Complete 5 sessões', points: 30 },
  { id: 'ten_sessions', name: '10 Sessões', emoji: '💪', description: 'Complete 10 sessões', points: 100 },
  { id: 'week_streak', name: 'Semana de Ouro', emoji: '⭐', description: 'Mantenha 7 dias de check-in consecutivos', points: 40 },
  { id: 'five_stars', name: 'Crítica Perfeita', emoji: '⭐⭐⭐⭐⭐', description: 'Deixe uma avaliação de 5 estrelas', points: 25 },
  { id: 'month_commitment', name: 'Compromisso Mensal', emoji: '📅', description: 'Sessões em 20+ dias do mês', points: 80 },
]

export default function ConquistasPage() {
  const router = useRouter()
  const session = getSession()

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
    }
  }, [session, router])

  if (!session) return null

  // Mock data
  const points = 145
  const levelInfo = getLevelInfo(points)
  const earnedBadgeIds = ['first_session', 'thirty_checkins']
  const completedCheckIns = 28
  const completedSessions = 3

  const earnedBadges = BADGES.filter(b => earnedBadgeIds.includes(b.id))
  const lockedBadges = BADGES.filter(b => !earnedBadgeIds.includes(b.id))

  return (
    <DashboardLayout userRole="patient" userName={session.name}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-petblue-400" />
            Conquistas
          </h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe seus badges e progresso na plataforma</p>
        </div>

        {/* Level Section */}
        <div className="bg-gradient-to-br from-petblue-50 to-petgreen-50 rounded-2xl p-8 border border-petblue-100 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{levelInfo.emoji}</div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-gray-800">{levelInfo.name}</h2>
                  <p className="text-gray-600">Seu nível atual</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">Você está em excelente progressão! Continue participando e ganhando pontos para evoluir seus níveis.</p>
            </div>

            <div>
              <div className="bg-white rounded-xl p-6 border border-petblue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Progresso</h3>
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-sm text-gray-600 mb-3">{points} / 250 pontos para próximo nível</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-petblue-400 to-petgreen-400 h-3 rounded-full" style={{ width: `${(points / 250) * 100}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-3">Ganhe pontos completando sessões e check-ins diários</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-petblue-400" />
              <span className="text-xs text-gray-500">Total de Pontos</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{points}</div>
            <p className="text-xs text-gray-400 mt-2">+15 esta semana</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-gray-500">Badges Conquistadas</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{earnedBadges.length}</div>
            <p className="text-xs text-gray-400 mt-2">de {BADGES.length} total</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-gray-500">Check-ins</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{completedCheckIns}</div>
            <p className="text-xs text-gray-400 mt-2">dias registrados</p>
          </div>
        </div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-gray-800">Badges Conquistadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedBadges.map(badge => (
                <div key={badge.id} className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 shadow-sm">
                  <div className="text-5xl mb-3">{badge.emoji}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-700">+{badge.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-gray-800">Próximos Desafios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map(badge => (
              <div key={badge.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm opacity-60">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-5xl opacity-40">{badge.emoji}</div>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-600 mb-1">{badge.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{badge.description}</p>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-500">+{badge.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-petblue-50 to-petgreen-50 rounded-2xl p-8 border border-petblue-200 text-center">
          <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">Continue sua jornada!</h3>
          <p className="text-gray-600 mb-6">Mantenha seu commitment com check-ins diários e sessões regulares para desbloquear mais badges.</p>
          <Link
            href="/dashboard/paciente/diario"
            className="inline-block px-6 py-3 rounded-lg bg-petblue-400 text-white font-bold hover:bg-petblue-500 transition-colors"
          >
            Fazer Check-in Agora
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
