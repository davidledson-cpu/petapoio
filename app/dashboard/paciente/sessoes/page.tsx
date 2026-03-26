import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Video, Plus } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'

const MOCK_SESSIONS = [
  { id: '1', professional: { name: 'Dra. Camila Torres', specialty: 'Luto animal' }, date: new Date(Date.now() + 2*24*60*60*1000).toISOString(), duration: 50, status: 'confirmed', type: 'video' },
  { id: '2', professional: { name: 'Dr. Ricardo Souza', specialty: 'Psicologia clínica' }, date: new Date(Date.now() + 7*24*60*60*1000).toISOString(), duration: 50, status: 'pending', type: 'video' },
  { id: '3', professional: { name: 'Dra. Camila Torres', specialty: 'Luto animal' }, date: new Date(Date.now() - 10*24*60*60*1000).toISOString(), duration: 50, status: 'completed', type: 'video' },
  { id: '4', professional: { name: 'Dra. Camila Torres', specialty: 'Luto animal' }, date: new Date(Date.now() - 20*24*60*60*1000).toISOString(), duration: 50, status: 'completed', type: 'video' },
  { id: '5', professional: { name: 'Dr. Ricardo Souza', specialty: 'Psicologia clínica' }, date: new Date(Date.now() - 30*24*60*60*1000).toISOString(), duration: 50, status: 'completed', type: 'video' },
]

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  confirmed: { label: 'Confirmada', class: 'bg-green-100 text-green-700' },
  pending: { label: 'Pendente', class: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Concluída', class: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelada', class: 'bg-red-100 text-red-600' },
}

export default async function PatientSessionsPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) { try { user = JSON.parse(sessionCookie) } catch {} }
  if (!user) redirect('/auth/login')

  const upcoming = MOCK_SESSIONS.filter(s => s.status !== 'completed')
  const past = MOCK_SESSIONS.filter(s => s.status === 'completed')

  return (
    <DashboardLayout userRole="patient" userName={user.name || 'Tutor'} userAvatar={user.avatar}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">Minhas Sessões</h1>
            <p className="text-gray-500 text-sm mt-1">{MOCK_SESSIONS.length} sessões no total</p>
          </div>
          <Link href="/dashboard/paciente/profissionais" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-petblue-400 text-white text-sm font-bold hover:bg-petblue-500 transition-colors">
            <Plus className="w-4 h-4" />
            Agendar sessão
          </Link>
        </div>
        <div>
          <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-petblue-400" />
            Próximas ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-petblue-100">
              <div className="text-5xl mb-3">🗓️</div>
              <p className="text-gray-500 text-sm">Nenhuma sessão agendada</p>
              <Link href="/dashboard/paciente/profissionais" className="mt-3 inline-block text-petblue-500 font-semibold text-sm hover:underline">Encontrar profissional →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(s => (
                <div key={s.id} className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-petblue-50 flex items-center justify-center text-2xl flex-shrink-0">👩‍⚕️</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{s.professional.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(s.date).toLocaleString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      <span>• {s.duration}min</span>
                      {s.type === 'video' && <span className="flex items-center gap-0.5"><Video className="w-3 h-3" /> Online</span>}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_LABELS[s.status].class}`}>{STATUS_LABELS[s.status].label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            Histórico ({past.length})
          </h2>
          <div className="space-y-3">
            {past.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 opacity-80">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">👩‍⚕️</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-700">{s.professional.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{new Date(s.date).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} • {s.duration}min</div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500">Concluída</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}