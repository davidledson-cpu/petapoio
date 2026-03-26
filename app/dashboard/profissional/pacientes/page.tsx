import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Users, Star, MessageSquare, Calendar } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'

const MOCK_PATIENTS = [
  { id: 'pt1', name: 'Ana Carolina Silva', email: 'ana@email.com', sessions: 5, lastSession: '2026-03-20', status: 'active', rating: 5, note: 'Luto pela perda de Mel (cachorra, 12 anos)', avatar: 'A' },
  { id: 'pt2', name: 'Bruno Martins', email: 'bruno@email.com', sessions: 3, lastSession: '2026-03-15', status: 'active', rating: 5, note: 'Perda repentina de Simba (gato, 8 anos)', avatar: 'B' },
  { id: 'pt3', name: 'Carla Ferreira', email: 'carla@email.com', sessions: 2, lastSession: '2026-03-10', status: 'active', rating: 4, note: 'Separação forçada por mudança', avatar: 'C' },
  { id: 'pt4', name: 'Diego Alves', email: 'diego@email.com', sessions: 1, lastSession: '2026-02-28', status: 'new', rating: null, note: 'Nova paciente — 1ª sessão agendada', avatar: 'D' },
  { id: 'pt5', name: 'Elaine Santos', email: 'elaine@email.com', sessions: 8, lastSession: '2026-02-20', status: 'active', rating: 5, note: 'Luto prolongado — acompanhamento contínuo', avatar: 'E' },
]

export default async function ProfessionalPatientsPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) { try { user = JSON.parse(sessionCookie) } catch {} }
  if (!user) redirect('/auth/login')

  return (
    <DashboardLayout userRole="professional" userName={user.name || 'Profissional'} userAvatar={user.avatar}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">Meus Pacientes</h1>
            <p className="text-gray-500 text-sm mt-1">{MOCK_PATIENTS.length} pacientes em acompanhamento</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-petblue-50 border border-petblue-100 text-petblue-600 text-sm font-semibold">
            <Users className="w-4 h-4" />
            {MOCK_PATIENTS.length} ativos
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total de pacientes', value: MOCK_PATIENTS.length, emoji: '👥' },
            { label: 'Sessões realizadas', value: MOCK_PATIENTS.reduce((s, p) => s + p.sessions, 0), emoji: '✅' },
            { label: 'Avaliação média', value: '4,8 ★', emoji: '⭐' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm text-center">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="font-serif text-2xl font-bold text-gray-800">{item.value}</div>
              <div className="text-xs text-gray-400 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-petblue-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-petblue-50"><h3 className="font-bold text-gray-800">Lista de Pacientes</h3></div>
          <div className="divide-y divide-gray-50">
            {MOCK_PATIENTS.map(pt => (
              <div key={pt.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-petblue-100 flex items-center justify-center font-bold text-petblue-600 flex-shrink-0">{pt.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-800">{pt.name}</span>
                    {pt.status === 'new' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-petblue-100 text-petblue-600">Novo</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{pt.note}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{pt.sessions} sessões</span>
                    <span>•</span>
                    <span>Última: {new Date(pt.lastSession).toLocaleDateString('pt-BR')}</span>
                    {pt.rating && (<><span>•</span><span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{pt.rating}.0</span></>)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-petblue-50 text-gray-400 hover:text-petblue-500 transition-colors"><MessageSquare className="w-4 h-4" /></button>
                  <button className="p-2 rounded-lg hover:bg-petblue-50 text-gray-400 hover:text-petblue-500 transition-colors"><Calendar className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}