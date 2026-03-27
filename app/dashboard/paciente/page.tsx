import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart, Calendar, Trophy, Star, Flame, ArrowRight, CheckCircle, Clock, Sparkles, ArrowLeft } from 'lucide-react'
import { getLevelInfo, getNextLevelPoints, BADGES, formatDateTime } from '@/lib/utils'

export default async function PatientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/dashboard/paciente')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/auth/login')
  }

  // Fetch upcoming appointments
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, professional:professional_id(full_name)')
    .eq('patient_id', user.id)
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(5)

  // Fetch completed appointments count
  const { count: completedCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', user.id)
    .eq('status', 'completed')

  // Fetch badges
  const { data: badges } = await supabase
    .from('patient_badges')
    .select('*')
    .eq('user_id', user.id)

  const level = getLevelInfo(profile.points || 0)
  const nextLevelPoints = getNextLevelPoints(profile.points || 0)
  const progressPercent = nextLevelPoints > 0
    ? Math.min(((profile.points || 0) - level.minPoints) / (nextLevelPoints - level.minPoints) * 100, 100)
    : 100

  const earnedBadgeIds = badges?.map(b => b.badge_id) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-petblue-50 via-white to-petgreen-50">
      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-petblue-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-petblue-600 fill-petblue-600" />
                </div>
                <span className="font-bold text-gray-900">PetApoio</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/paciente/perfil"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <div className="w-8 h-8 bg-petblue-100 rounded-full flex items-center justify-center text-petblue-600 font-semibold text-sm">
                  {profile.full_name?.charAt(0) || 'P'}
                </div>
                <span className="hidden sm:block">{profile.full_name?.split(' ')[0]}</span>
              </Link>
              <form action="/auth/signout" method="post">
                <button className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Olá, {profile.full_name?.split(' ')[0] || 'Paciente'} {level.emoji}
          </h1>
          <p className="text-gray-500 mt-1">Aqui está um resumo da sua jornada de cuidado</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedCount || 0}</p>
            <p className="text-sm text-gray-500">Sessões feitas</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{profile.points || 0}</p>
            <p className="text-sm text-gray-500">Pontos</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{level.emoji} {level.name}</p>
            <p className="text-sm text-gray-500">Nível atual</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{profile.streak_days || 0}</p>
            <p className="text-sm text-gray-500">Dias seguidos</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Appointments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between p-6 pb-4">
                <h2 className="text-lg font-bold text-gray-900">Próximas Consultas</h2>
                <Link href="/dashboard/paciente/agendamentos" className="text-sm text-petblue-600 hover:text-petblue-700 font-medium flex items-center gap-1">
                  Ver todas <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {appointments && appointments.length > 0 ? (
                <div className="px-6 pb-6 space-y-3">
                  {appointments.map((apt: any) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-petblue-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-petblue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-petblue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {apt.professional?.full_name || 'Profissional'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(apt.scheduled_at)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {apt.status === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" /> Confirmada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3" /> Pendente
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 pb-6">
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">Nenhuma consulta agendada</p>
                    <Link
                      href="/profissionais"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-petblue-500 text-white rounded-xl text-sm font-semibold hover:bg-petblue-600 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Encontrar um Psicólogo
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Gamification */}
          <div className="space-y-6">
            {/* Level Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Seu Progresso</h2>

              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{level.emoji}</div>
                <p className="text-lg font-bold text-gray-900">{level.name}</p>
                <p className="text-sm text-gray-500">Nível {level.level}</p>
              </div>

              <div className="bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-petblue-400 to-petblue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 text-center">{profile.points || 0} / {nextLevelPoints || '∞'} pontos
              </p>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Conquistas</h2>
                <Link href="/dashboard/paciente/conquistas" className="text-sm text-petblue-600 hover:text-petblue-700 font-medium">
                  Ver todas
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {Object.entries(BADGES).map(([id, badge]) => {
                  const earned = earnedBadgeIds.includes(id)
                  return (
                    <div
                      key={id}
                      className={`relative group cursor-help`}
                      title={`${badge.name}: ${badge.description}`}
                    >
                      <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-2xl ${
                        earned
                          ? 'bg-petblue-100 shadow-sm'
                          : 'bg-gray-100 opacity-40 grayscale'
                      }`}>
                        {badge.emoji}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-petblue-500 to-petblue-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Precisa de apoio?</h3>
              <p className="text-petblue-100 text-sm mb-4">
                Encontre um psicólogo especializado em luto animal.
              </p>
              <Link
                href="/profissionais"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-petblue-600 rounded-xl text-sm font-semibold hover:bg-petblue-50 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Buscar Profissional
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

