'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, Save, X } from 'lucide-react'

interface Session {
  id: string
  email: string
  name: string
  role: string
}

interface AvailabilitySlot {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

interface BlockedPeriod {
  id: string
  blocked_from: string
  blocked_until: string
  reason: string
}

export default function AgendaPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { id: '1', day_of_week: 1, start_time: '08:00', end_time: '18:00', is_active: true },
    { id: '2', day_of_week: 2, start_time: '08:00', end_time: '18:00', is_active: true },
    { id: '3', day_of_week: 3, start_time: '08:00', end_time: '18:00', is_active: true },
    { id: '4', day_of_week: 4, start_time: '08:00', end_time: '18:00', is_active: true },
    { id: '5', day_of_week: 5, start_time: '08:00', end_time: '18:00', is_active: true },
  ])
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([
    {
      id: 'block-1',
      blocked_from: '2026-04-15T00:00:00',
      blocked_until: '2026-04-22T23:59:59',
      reason: 'F\u00e9rias',
    },
  ])
  const [showBlockForm, setShowBlockForm] = useState(false)
  const [blockReason, setBlockReason] = useState('')
  const [blockFromDate, setBlockFromDate] = useState('')
  const [blockToDate, setBlockToDate] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const bookedAppointments = [
    { id: 'apt-1', time: '10:00', dayIndex: 1, patient: 'Ana Carolina', status: 'confirmed' },
    { id: 'apt-2', time: '14:30', dayIndex: 2, patient: 'Pedro Santos', status: 'confirmed' },
    { id: 'apt-3', time: '16:00', dayIndex: 3, patient: 'Maria Souza', status: 'pending' },
  ]

  useEffect(() => {
    const checkSession = () => {
      const currentSession = getSession()
      if (!currentSession) {
        router.push('/auth/login')
        return
      }
      setSession(currentSession)
      setLoading(false)
    }
    checkSession()
  }, [router])

  if (loading) {
    return (
      <DashboardLayout userRole="professional" userName="Carregando...">
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-500">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  const saveAvailability = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const blockPeriod = () => {
    if (!blockReason || !blockFromDate || !blockToDate) return
    const newBlock: BlockedPeriod = {
      id: `block-${Date.now()}`,
      blocked_from: blockFromDate,
      blocked_until: blockToDate,
      reason: blockReason,
    }
    setBlockedPeriods([...blockedPeriods, newBlock])
    setBlockReason('')
    setBlockFromDate('')
    setBlockToDate('')
    setShowBlockForm(false)
  }

  const deleteBlock = (blockId: string) => {
    setBlockedPeriods(blockedPeriods.filter(b => b.id !== blockId))
  }

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
  const hours = Array.from({ length: 11 }, (_, i) => i + 8)

  const getAppointmentsForSlot = (dayIndex: number, hour: number) => {
    return bookedAppointments.filter(apt => {
      const [aptHour] = apt.time.split(':')
      return apt.dayIndex === dayIndex && parseInt(aptHour) === hour
    })
  }

  return (
    <DashboardLayout userRole="professional" userName={session?.name || ''}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-petblue-500" />
            Agenda
          </h1>
          <p className="text-gray-600">Gerencie sua disponibilidade e consultas agendadas</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-gray-900">Calend\u00e1rio da Semana</h2>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() - 7*24*60*60*1000))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
              <span className="text-sm font-semibold text-gray-600 min-w-40 text-center">
                {currentWeekStart.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })} - {new Date(currentWeekStart.getTime() + 6*24*60*60*1000).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
              </span>
              <button onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() + 7*24*60*60*1000))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr>
                <th className="text-left w-20 px-3 py-3 text-gray-600 font-semibold">Hor\u00e1rio</th>
                {days.map((day, i) => (<th key={i} className="px-3 py-3 text-center text-gray-700 font-semibold"><div>{day}</div><div className="text-xs text-gray-400 mt-1">{new Date(currentWeekStart.getTime() + i*24*60*60*1000).toLocaleDateString('pt-BR', { day: '2-digit' })}</div></th>))}
              </tr></thead>
              <tbody>
                {hours.map(hour => (<tr key={hour} className="border-t border-gray-100">
                  <td className="px-3 py-3 text-gray-600 font-semibold">{hour}:00</td>
                  {days.map((_, dayIndex) => { const appts = getAppointmentsForSlot(dayIndex, hour); return (<td key={dayIndex} className="px-3 py-3 text-center bg-gray-50 hover:bg-gray-100">{appts.map(apt => (<div key={apt.id} className={`text-xs font-bold text-white rounded-lg p-2 mb-1 ${apt.status === 'confirmed' ? 'bg-petgreen-500' : 'bg-yellow-500'}`}>{apt.patient.split(' ')[0]}</div>))}</td>)})}
                </tr>))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Disponibilidade Semanal</h2>
            <div className="space-y-4">
              {[0,1,2,3,4,5,6].map(dayIndex => { const slot = availability.find(s => s.day_of_week === dayIndex); return (
                <div key={dayIndex} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-20 font-semibold text-sm text-gray-700">{days[dayIndex]}</div>
                  <input type="checkbox" checked={slot?.is_active ?? false} onChange={(e) => { if (e.target.checked && !slot) { setAvailability([...availability, { id: `new-${dayIndex}`, day_of_week: dayIndex, start_time: '08:00', end_time: '18:00', is_active: true }]) } else if (!e.target.checked && slot) { setAvailability(availability.filter(s => s.day_of_week !== dayIndex)) } }} className="w-5 h-5 rounded cursor-pointer" />
                  {slot?.is_active && (<div className="flex items-center gap-2 flex-1">
                    <input type="time" value={slot.start_time} onChange={(e) => setAvailability(availability.map(s => s.day_of_week === dayIndex ? { ...s, start_time: e.target.value } : s))} className="px-2 py-1 text-sm border border-gray-200 rounded-lg flex-1" />
                    <span className="text-gray-400">\u2014</span>
                    <input type="time" value={slot.end_time} onChange={(e) => setAvailability(availability.map(s => s.day_of_week === dayIndex ? { ...s, end_time: e.target.value } : s))} className="px-2 py-1 text-sm border border-gray-200 rounded-lg flex-1" />
                  </div>)}
                </div>)})}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-gray-900">Per\u00edodos Bloqueados</h2>
                <button onClick={() => setShowBlockForm(!showBlockForm)} className="p-2 hover:bg-gray-100 rounded-lg"><Plus className="w-5 h-5 text-petblue-500" /></button>
              </div>
              {showBlockForm && (<div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <input type="datetime-local" value={blockFromDate} onChange={(e) => setBlockFromDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <input type="datetime-local" value={blockToDate} onChange={(e) => setBlockToDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <input type="text" placeholder="Motivo" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <div className="flex gap-2">
                  <button onClick={blockPeriod} className="flex-1 px-3 py-2 bg-petblue-500 text-white rounded-lg font-bold text-sm">Bloquear</button>
                  <button onClick={() => setShowBlockForm(false)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
              </div>)}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {blockedPeriods.length === 0 ? (<p className="text-sm text-gray-500 text-center py-4">Nenhum per\u00edodo bloqueado</p>) : blockedPeriods.map(block => (
                  <div key={block.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="text-sm"><div className="font-semibold text-yellow-900">{block.reason}</div><div className="text-xs text-yellow-700">{new Date(block.blocked_from).toLocaleDateString('pt-BR')} - {new Date(block.blocked_until).toLocaleDateString('pt-BR')}</div></div>
                    <button onClick={() => deleteBlock(block.id)} className="p-1 hover:bg-yellow-100 rounded"><X className="w-4 h-4 text-yellow-600" /></button>
                  </div>))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {saveSuccess && (<div className="px-4 py-2 bg-petgreen-50 text-petgreen-700 rounded-lg text-sm font-semibold flex items-center gap-2 border border-petgreen-200">\u2713 Salvo com sucesso</div>)}
          <button onClick={saveAvailability} className="px-6 py-3 bg-petblue-500 text-white rounded-xl font-bold hover:bg-petblue-600 flex items-center gap-2"><Save className="w-5 h-5" />Salvar Altera\u00e7\u00f5es</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
