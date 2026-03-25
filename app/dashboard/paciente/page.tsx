import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Star, ShoppingBag, TrendingUp, Clock, CheckCircle, Plus } from 'lucide-react'
import { formatDateTime, formatCurrency, getLevelInfo, getNextLevelPoints } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/layout'
import { CheckInWidget } from '@/components/dashboard/patient/check-in-widget'
import { GamificationCard } from '@/components/dashboard/patient/gamification-card'

export default async function PatientDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch upcoming appointments
  const { data: upcoming } = await supabase
    .from('appointments')
    .select(`
      *,
      professional:professional_id(
        full_name,
        avatar_url,
        professional_profiles(specialty, session_price)
      )
    `)
    .eq('patient_id', user.id)
    .in('status', ['pending', 'confirmed'])
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(3)

  // Fetch completed sessions count
  const { count: completedCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', user.id)
    .eq('status', 'completed')

  // Fetch badges
  const { data: badges } = await supabase
    .from('patient_badges')
    .select('*')
    .eq('patient_id', user.id)

  const points = profile?.gamification_points || 0
  const levelInfo = getLevelInfo(points)
  const nextLevel = getNextLevelPoints(points)
  const progress = Math.min((points / nextLevel) * 100, 100)

  return (
    <DashboardLayout userRole="patient" userName={profile?.full_name || 'Tutor'}>
      <div className="space-y-8">
        {/* Welcome header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">
              Olá, {profile?.full_name?.split(' ')[0]} {levelInfo.emoji}
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Sessões realizadas', value: completedCount || 0, icon: CheckCircle, color: 'text-petgreen-500' },
            { label: 'Pontos ganhos', value: points, icon: Star, color: 'text-yellow-500' },
            { label: 'Nível atual', value: levelInfo.name, icon: TrendingUp, color: 'text-petblue-500' },
            { label: 'Sequência', value: `${profile?.streak_days || 0} dias`, icon: Clock, color: 'text-orange-500' },
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
              <Link href="/dashboard/paciente/agendamentos" className="text-xs text-petblue-500 hover:underline font-semibold">
                Ver todas
              </Link>
            </div>

            {upcoming && upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((apt: any) => (
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

          {/* Right column */}
          <div className="space-y-4">
            {/* Gamification card */}
            <GamificationCard
              points={points}
              levelInfo={levelInfo}
              progress={progress}
              nextLevel={nextLevel}
              badgeCount={badges?.length || 0}
            />

            {/* Check-in widget */}
            <CheckInWidget userId={user.id} lastCheckIn={profile?.last_check_in} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
