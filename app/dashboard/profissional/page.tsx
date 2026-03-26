import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Users, DollarSign, Star, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'

const MOCK_APPOINTMENTS = [
  {
    id: '1',
    patient: { full_name: 'Ana Carolina Silva' },
    scheduled_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    duration_min: 50,
    status: 'confirmed',
    amount: 180,
  },
  {
    id: '2',
    patient: { full_name: 'Bruno Martins' },
    scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration_min: 50,
    status: 'pending',
    amount: 180,
  },
  {
    id: '3',
    patient: { full_name: 'Carla Ferreira' },
    scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration_min: 50,
    status: 'confirmed',
    amount: 180,
  },
]

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function ProfessionalDashboardPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) {
    try { user = JSON.parse(sessionCookie) } catch {}
  }
  if (!user) redirect('/auth/login')
  if (user.role !== 'professional') redirect('/dashboard/paciente')

  return (
    <DashboardLayout userRole="professional" userName={user.name || 'Profissional'} userAvatar={user.avatar}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">
              Olá, {(user.name || 'Profissional').split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Seu perfil está ativo e recebendo pacientes.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
            ✅ Perfil verificado
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Sessões realizadas', value: '24', icon: CheckCircle, color: 'text-petblue-500' },
            { label: 'Receita este mês', value: 'R$ 2.340', icon: DollarSign, color: 'text-petgreen-500' },
            { label: 'Avaliação média', value: '4,9 ★', icon: Star, color: 'text-yellow-500' },
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

            <div className="space-y-3">
              {MOCK_APPOINTMENTS.map(apt => (
                <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-petblue-100 flex items-center justify-center font-bold text-petblue-600 text-sm flex-shrink-0">
                    {apt.patient.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800">{apt.patient.full_name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(apt.scheduled_at)} • {apt.duration_min}min
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {apt.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
              <h3 className="font-bold text-sm text-gray-800 mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                {[
                  { label: 'Configurar disponibilidade', href: '/dashboard/profissional/agenda', icon: '🗓️' },
                  { label: 'Ver extrato financeiro', href: '/dashboard/profissional/financeiro', icon: '💰' },
                  { label: 'Editar perfil público', href: '/dashboard/profissional/perfil', icon: '✏️' },
                  { label: 'Lista de pacientes', href: '/dashboard/profissional/pacientes', icon: '👥' },
                ].map(action => (
                  <Link key={action.href} href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-petblue-50 transition-colors text-sm font-semibold text-gray-600">
                    <span className="text-lg">{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-petblue-50 rounded-2xl p-5 border border-petblue-100">
              <h3 className="font-bold text-sm text-petblue-700 mb-2">✅ Perfil Verificado</sh>
              <p className="text-xs text-petblue-600 leading-relaxed">
                Seu perfil está público e visível para pacientes que buscam apoio.
              </p>
            </div>
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
