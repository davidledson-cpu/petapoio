import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

const APPOINTMENTS = [
  { day: 1, hour: '09:00', patient: 'Ana Carolina', duration: 50, status: 'confirmed' },
  { day: 1, hour: '14:00', patient: 'Bruno Martins', duration: 50, status: 'confirmed' },
  { day: 3, hour: '10:00', patient: 'Carla Ferreira', duration: 50, status: 'pending' },
  { day: 4, hour: '15:00', patient: 'Diego Alves', duration: 50, status: 'confirmed' },
  { day: 5, hour: '11:00', patient: 'Elaine Santos', duration: 50, status: 'confirmed' },
]

export default async function ProfessionalAgendaPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) { try { user = JSON.parse(sessionCookie) } catch {} }
  if (!user) redirect('/auth/login')

  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })

  return (
    <DashboardLayout userRole="professional" userName={user.name || 'Profissional'} userAvatar={user.avatar}>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">Agenda</h1>
            <p className="text-gray-500 text-sm mt-1">Gerencie sua disponibilidade e consultas</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-petblue-400 text-white text-sm font-bold hover:bg-petblue-500 transition-colors">
            <Plus className="w-4 h-4" />
            Adicionar horário
          </button>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-petblue-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
            <h2 className="font-bold text-gray-800">
              {startOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} – {weekDates[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </h2>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-8 mb-2">
                <div className="text-xs text-gray-400 p-2" />
                {weekDates.map((d, i) => (
                  <div key={i} className={`text-center p-2 rounded-xl ${d.toDateString() === today.toDateString() ? 'bg-petblue-400 text-white' : ''}`}>
                    <div className="text-xs font-semibold">{WEEK_DAYS[i]}</div>
                    <div className="text-lg font-bold">{d.getDate()}</div>
                  </div>
                ))}
              </div>
              {HOURS.map(hour => (
                <div key={hour} className="grid grid-cols-8 border-t border-gray-50">
                  <div className="text-xs text-gray-400 p-2 flex items-center">{hour}</div>
                  {weekDates.map((_, dayIdx) => {
                    const apt = APPOINTMENTS.find(a => a.day === dayIdx && a.hour === hour)
                    return (
                      <div key={dayIdx} className="p-1 min-h-[48px] border-l border-gray-50 hover:bg-petblue-50/30 cursor-pointer transition-colors">
                        {apt && (
                          <div className={`text-xs rounded-lg px-2 py-1 font-semibold leading-tight ${apt.status === 'confirmed' ? 'bg-petblue-100 text-petblue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            <div className="truncate">{apt.patient}</div>
                            <div className="font-normal opacity-70">{apt.duration}min</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-petblue-400" />
            Disponibilidade padrão
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(day => (
              <div key={day} className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">{day}</span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>08:00 – 18:00</span>
                  <div className="w-8 h-4 rounded-full bg-petblue-400 flex items-center justify-end pr-0.5">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 px-5 py-2.5 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 transition-colors">Salvar disponibilidade</button>
        </div>
      </div>
    </DashboardLayout>
  )
}