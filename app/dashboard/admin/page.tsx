import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Settings, Users, Calendar, Mail, BarChart2, Shield } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'

export default async function AdminDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard/paciente')

  const { count: totalUsers } = await supabase
    .from('users').select('*', { count: 'exact', head: true })

  const { count: totalProfessionals } = await supabase
    .from('users').select('*', { count: 'exact', head: true })
    .eq('role', 'professional')

  const { count: totalAppointments } = await supabase
    .from('appointments').select('*', { count: 'exact', head: true })

  const { count: pendingVerifications } = await supabase
    .from('professional_profiles').select('*', { count: 'exact', head: true })
    .eq('is_verified', false)

  return (
    <DashboardLayout userRole="admin" userName={profile.full_name}>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">
            Painel Administrativo
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie a plataforma PetApoio
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Usuarios totais', value: totalUsers || 0, icon: Users, color: 'text-petblue-500' },
            { label: 'Profissionais', value: totalProfessionals || 0, icon: Shield, color: 'text-petgreen-500' },
            { label: 'Agendamentos', value: totalAppointments || 0, icon: Calendar, color: 'text-purple-500' },
            { label: 'Verificacoes pendentes', value: pendingVerifications || 0, icon: Settings, color: 'text-orange-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <div className="font-serif text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/dashboard/admin/configuracoes"
            className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-petblue-50 flex items-center justify-center group-hover:bg-petblue-100 transition-colors">
                <Mail className="w-6 h-6 text-petblue-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Configuracoes de Notificacao</h3>
                <p className="text-sm text-gray-500 mt-0.5">Configurar emails para receber notificacoes de agendamentos</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Relatorios</h3>
                <p className="text-sm text-gray-500 mt-0.5">Em breve — relatorios de uso da plataforma</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
