'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Star, TrendingUp, Clock, CheckCircle, Plus } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { getSession } from '@/lib/auth/session'

// Mock level info
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

function getNextLevelPoints(points: number) {
  const levels = [100, 250, 500, 1000, 2000]
  return levels.find(l => l > points) || 2000
}

export default function PatientDashboardPage() {
  const router = useRouter()
  const session = getSession()

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
    }
  }, [session, router])

  if (!session) return null

  const completedCount = 3
  const points = 145
  const levelInfo = getLevelInfo(points)
  const nextLevel = getNextLevelPoints(points)
  const progress = Math.min((points / nextLevel) * 100, 100)
  const streakDays = 7

  const upcomingAppointments = [
    {
      id: '1',
      professional: { full_name: 'Dr. Marcos Oliveira', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos' },
      scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration_min: 50,
      status: 'confirmed',
      video_room_url: 'https://meet.google.com/abc-defg-hij',
    },
    {
      id: '2',
      professional: { full_name: 'Dra. Sofia Costa', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia' },
      scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration_min: 50,
      status: 'pending',
      video_room_url: null,
    },
  ]

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <DashboardLayout userRole="patient" userName={session.name}>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">
              Olá, {session.name.split(' ')[0]} {levelInfo.emoji}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {completedCount === 0
                ? 'Bem-vindo à sua jornada de cura. Agende sua primeira sessão.'
                : `${completedCount} sessão${completedCount !== 1 ? 'ões' : ''} realizada${completedCount !== 1 ? 's' : ''}. Continue sua jornada.`
              }
            </p>
          </div>
          <Link
            href="/profissionais"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-petblue-400 text-white text-sm font-bold hover:bg-petblue-500 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Sessão
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Sessões realizadas', value: completedCount || 0, icon: CheckCircle, color: 'text-petgreen-500' },
            { label: 'Pontos ganhos', value: points, icon: Star, color: 'text-yellow-500' },
            { label: 'Nível atual', value: levelInfo.name, icon: TrendingUp, color: 'text-petblue-500' },
            { label: 'Sequência', value: `${streakDays} dias`, icon: Clock, color: 'text-orange-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <div className="font-serif text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-petblue-400" />
                Próximas Sessões
              </h2>
              <Link href="/dashboard/paciente/agendamentos" className="text-xs text-petblue-500 hover:underline font-semibold">
                Ver todas
              </Link>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((apt: any) => (
                  <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-petblue-50 border border-petblue-100">
                    <div className="w-12 h-12 rounded-xl bg-petblue-100 flex items-center justify-center text-2xl flex-shrink-0">
                      👩‍⚕️
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-800 truncate">{apt.professional?.full_name}</div>
                      <div className="text-xs text-gray-500">{formatDateTime(apt.scheduled_at)} • {apt.duration_min}min</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {apt.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                      </div>
                      {apt.video_room_url && (
                        <a href={apt.video_room_url} target="_blank" rel="noopener noreferrer"
                          className="block mt-1.5 text-xs text-petblue-500 hover:underline font-semibold">
                          Entrar na sala →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">🗓️</div>
                <p className="text-gray-500 text-sm mb-4">Nenhuma sessão agendada</p>
                <Link href="/profissionais" className="text-sm text-petblue-500 font-bold hover:underline">
                  Encontrar um psicólogo →
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Gamificação</h3>
                <Link href="/dashboard/paciente/conquistas" className="text-xs text-petblue-500 hover:underline">
                  Ver mais
                </Link>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">{points} / {nextLevel} pontos</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-petblue-400 h-2 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="text-xs text-gray-500">Próximo nível: {getNextLevelPoints(points)} pontos</div>
            </div>

            <div className="bg-gradient-to-br from-petgreen-50 to-petblue-50 rounded-2xl p-6 border border-petgreen-100 shadow-sm">
              <div className="text-center">
                <div className="text-4xl mb-3">😊</div>
                <h3 className="font-semibold text-gray-800 mb-2">Como está se sentindo?</h3>
                <p className="text-xs text-gray-500 mb-4">Registre seu humor diário</p>
                <Link
                  href="/dashboard/paciente/diario"
                  className="inline-block px-4 py-2 rounded-lg bg-petgreen-400 text-white text-xs font-bold hover:bg-petgreen-500 transition-colors"
                >
                  Registrar Mood
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
