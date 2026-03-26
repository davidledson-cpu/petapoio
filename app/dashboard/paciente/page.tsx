import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Star, TrendingUp, Clock, CheckCircle, Plus } from 'lucide-react'
import { getLevelInfo, getNextLevelPoints } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/layout'
import { CheckInWidget } from '@/components/dashboard/patient/check-in-widget'
import { GamificationCard } from '@/components/dashboard/patient/gamification-card'

// Mock upcoming sessions for demo
const MOCK_SESSIONS = [
  {
    id: '1',
    professional: { full_name: 'Dra. Camila Torres', specialty: 'Luto animal' },
    scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration_min: 50,
    status: 'confirmed',
    video_room_url: null,
  },
  {
    id: '2',
    professional: { full_name: 'Dr. Ricardo Souza', specialty: 'Psicologia clínica' },
    scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration_min: 50,
    status: 'pending',
    video_room_url: null,
  },
]

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

export default async function PatientDashboardPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) {
    try { user = JSON.parse(sessionCookie) } catch {}
  }
  if (!user) redirect('/auth/login')

  const completedCount = 3
  const points = 150
  const levelInfo = getLevelInfo(points)
  const nextLevel = getNextLevelPoints(points)
  const progress = Math.min((points / nextLevel) * 100, 100)
  const badgeCount = 2

  return (
    <DashboardLayout userRole="patient" userName={user.name || 'Tutor'} userAvatar={user.avatar}>
      <div className="space-y-8">
        {/* Welcome header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">
              Olá, {(user.name || 'Tutor').split(' ')[0]} {levelInfo.emoji}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {completedCount === 0
                ? 'Bem-vindo à sua jornada de cura. Agende sua primeira sessão.'
                : `${completedCount} sessões realizadas. Continue sua jornada.`
              }
            </p>
          </div>
          <Link
            href="/dashboard/paciente/profissionais"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-petblue-400 text-white text-sm font-bold hover:bg-petblue-500 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Sessão
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Sessões realizadas', value: completedCount, icon: CheckCircle, color: 'text-petgreen-500' },
            { label: 'Pontos ganhos', value: points, icon: Star, color: 'text-yellow-500' },
            { label: 'Nível atual', value: levelInfo.name, icon: TrendingUp, color: 'text-petblue-500' },
            { label: 'Sequência', value: '5 dias', icon: Clock, color: 'text-orange-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <div className="font-serif text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Upcoming sessions */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-petblue-400" />
                Próximas Sessões
              </h2>
              <Link href="/dashboard/paciente/sessoes" className="text-xs text-petblue-500 hover:underline font-semibold">
                Ver todas
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_SESSIONS.map(apt => (
                <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-petblue-50 border border-petblue-100">
                  <div className="w-12 h-12 rounded-xl bg-petblue-100 flex items-center justify-center text-2xl flex-shrink-0">
                    👩‍⚕️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800 truncate">{apt.professional.full_name}</div>
                    <div className="text-xs text-gray-500">{formatDateTime(apt.scheduled_at)} • {apt.duration_min}min</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {apt.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <GamificationCard
              points={points}
              levelInfo={levelInfo}
              progress={progress}
              nextLevel={nextLevel}
              badgeCount={badgeCount}
            />
            <CheckInWidget userId={user.id} lastCheckIn={null} />
          </div>
        </div>

        {/* Demo notice */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
          <strong>🧪 Modo demo:</strong> Os dados exibidos são ilustrativos. Configure o Supabase para persistência real.
        </div>
      </div>
    </DashboardLayout>
  )
}
