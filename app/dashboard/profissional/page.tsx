import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Users, DollarSign, Star, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/layout'

export default async function ProfessionalDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*, professional_profiles(*)')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'professional') redirect('/dashboard/paciente')

  // Upcoming appointments
  const { data: upcoming } = await supabase
    .from('appointments')
    .select('*, patient:patient_id(full_name, avatar_url)')
    .eq('professional_id', user.id)
    .in('status', ['pending', 'confirmed'])
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(5)

  // Stats
  const { count: totalSessions } = await supabase
    .from('appointments').select('*', { count: 'exact', head: true })
    .eq('professional_id', user.id).eq('status', 'completed')

  const { data: monthRevenue } = await supabase
    .from('appointments').select('professional_amount')
    .eq('professional_id', user.id).eq('status', 'completed')
    .gte('scheduled_at', new Date(new Date().setDate(1)).toISOString())

  const monthTotal = monthRevenue?.reduce((sum, a) => sum + (a.professional_amount || 0), 0) || 0

  const proProfile = (profile as any).professional_profiles

  return (
    <DashboardLayout userRole="professional" userName={profile.full_name}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">
              Olá, {profile.full_name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {proProfile?.is_verified
                ? 'Seu perfil está ativo e recebendo pacientes.'
                : 'Seu cadastro está em análise. Aguarde aprovação em até 48h.'}
            </p>
          </div>

          {!proProfile?.is_verified && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              Aprovação pendente
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Sessões realizadas', value: totalSessions || 0, icon: Calendar, color: 'text-petblue-500' },
            { label: 'Receita este mês', value: formatCurrency(monthTotal), icon: DollarSign, color: 'text-petgreen-500' },
            { label: 'Avaliação média', value: `${(proProfile?.rating_avg || 0).toFixed(1)} ★`, icon: Star, color: 'text-yellow-500' },
            { label: 'Taxa de retorno', value: '78%', icon: TrendingUp, color: 'text-purple-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <div className="font-serif text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Upcoming appointments */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-petblue-400" />
                Próximas Consultas
              </h2>
              <Link href="/dashboard/profissional/agenda" className="text-xs text-petblue-500 font-semibold hover:underline">
                Ver agenda
              </Link>
            </div>

            {upcoming && upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((apt: any) => (
                  <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-petblue-100 flex items-center justify-center font-bold text-petblue-600 text-sm flex-shrink-0">
                      {apt.patient?.full_name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-800">{apt.patient?.full_name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(apt.scheduled_at)} • {apt.duration_min}min
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="font-semibold text-sm text-petgreen-600">{formatCurrency(apt.professional_amount)}</div>
                      {apt.video_room_url && (
                        <a href={apt.video_room_url} target="_blank" rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-petblue-400 text-white text-xs font-bold hover:bg-petblue-500">
                          Entrar
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">🗓️</div>
                <p className="text-gray-500 text-sm">Nenhuma consulta agendada</p>
                <p className="text-xs text-gray-400 mt-1">Configure sua disponibilidade para receber pacientes</p>
                <Link href="/dashboard/profissional/agenda" className="mt-3 inline-block text-sm text-petblue-500 font-bold hover:underline">
                  Configurar agenda →
                </Link>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
              <h3 className="font-bold text-sm text-gray-800 mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                {[
                  { label: 'Configurar disponibilidade', href: '/dashboard/profissional/agenda', icon: '🗓️' },
                  { label: 'Ver extrato financeiro', href: '/dashboard/profissional/financeiro', icon: '💰' },
                  { label: 'Editar perfil público', href: '/dashboard/profissional/configuracoes', icon: '✏️' },
                  { label: 'Ver avaliações', href: '/dashboard/profissional/pacientes', icon: '⭐' },
                ].map(action => (
                  <Link key={action.href} href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-petblue-50 transition-colors text-sm font-semibold text-gray-600">
                    <span className="text-lg">{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile completion */}
            <div className="bg-petblue-50 rounded-2xl p-5 border border-petblue-100">
              <h3 className="font-bold text-sm text-petblue-700 mb-2">Perfil {proProfile?.is_verified ? '✅ Verificado' : '⏳ Em análise'}</h3>
              <p className="text-xs text-petblue-600 leading-relaxed">
                {proProfile?.is_verified
                  ? 'Seu perfil está público e visível para pacientes.'
                  : 'Nossa equipe está analisando seus documentos. Prazo: até 48h.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
