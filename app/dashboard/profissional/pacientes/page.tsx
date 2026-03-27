'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Users, Search, Filter, ChevronRight, MessageSquare, Calendar, TrendingUp } from 'lucide-react'

interface Session {
  id: string
  email: string
  name: string
  role: string
}

interface Patient {
  id: string
  name: string
  email: string
  animal: string
  animal_name: string
  sessions_count: number
  last_session: string
  status: 'active' | 'inactive' | 'new'
  evolution: 'improving' | 'stable' | 'needs_attention'
  next_appointment: string | null
}

export default function PacientesPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const patients: Patient[] = [
    { id: '1', name: 'Ana Carolina Silva', email: 'ana@email.com', animal: 'Gato', animal_name: 'Mimi', sessions_count: 8, last_session: '2026-03-25', status: 'active', evolution: 'improving', next_appointment: '2026-03-28' },
    { id: '2', name: 'Pedro Santos', email: 'pedro@email.com', animal: 'Cachorro', animal_name: 'Rex', sessions_count: 5, last_session: '2026-03-24', status: 'active', evolution: 'stable', next_appointment: '2026-03-28' },
    { id: '3', name: 'Maria Souza', email: 'maria@email.com', animal: 'Coelho', animal_name: 'Fluffy', sessions_count: 3, last_session: '2026-03-20', status: 'active', evolution: 'improving', next_appointment: '2026-03-29' },
    { id: '4', name: 'Carlos Lima', email: 'carlos@email.com', animal: 'Cachorro', animal_name: 'Thor', sessions_count: 12, last_session: '2026-03-15', status: 'active', evolution: 'needs_attention', next_appointment: null },
    { id: '5', name: 'Julia Costa', email: 'julia@email.com', animal: 'Gato', animal_name: 'Luna', sessions_count: 2, last_session: '2026-03-10', status: 'new', evolution: 'stable', next_appointment: '2026-04-01' },
    { id: '6', name: 'Roberto Alves', email: 'roberto@email.com', animal: 'P\u00e1ssaro', animal_name: 'Kiki', sessions_count: 6, last_session: '2026-02-28', status: 'inactive', evolution: 'stable', next_appointment: null },
  ]

  useEffect(() => {
    const checkSession = () => {
      const currentSession = getSession()
      if (!currentSession) { router.push('/auth/login'); return }
      setSession(currentSession)
      setLoading(false)
    }
    checkSession()
  }, [router])

  if (loading) {
    return (<DashboardLayout userRole="professional" userName="Carregando..."><div className="flex items-center justify-center h-screen"><div className="text-gray-500">Carregando...</div></div></DashboardLayout>)
  }

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.animal_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const statusColors: Record<string, string> = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-600', new: 'bg-blue-100 text-blue-700' }
  const statusLabels: Record<string, string> = { active: 'Ativo', inactive: 'Inativo', new: 'Novo' }
  const evolutionColors: Record<string, string> = { improving: 'text-green-600', stable: 'text-blue-600', needs_attention: 'text-orange-600' }
  const evolutionLabels: Record<string, string> = { improving: 'Melhorando', stable: 'Est\u00e1vel', needs_attention: 'Aten\u00e7\u00e3o' }

  return (
    <DashboardLayout userRole="professional" userName={session?.name || ''}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3 mb-2"><Users className="w-8 h-8 text-petblue-500" />Meus Pacientes</h1>
          <p className="text-gray-600">{patients.length} pacientes cadastrados</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Buscar por nome ou animal..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petblue-300" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-xl text-sm">
            <option value="all">Todos</option><option value="active">Ativos</option><option value="new">Novos</option><option value="inactive">Inativos</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
            <div className="text-2xl font-serif font-bold text-gray-900">{patients.filter(p => p.status === 'active').length}</div>
            <div className="text-sm text-green-700">Pacientes ativos</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
            <div className="text-2xl font-serif font-bold text-gray-900">{patients.filter(p => p.status === 'new').length}</div>
            <div className="text-sm text-blue-700">Novos pacientes</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
            <div className="text-2xl font-serif font-bold text-gray-900">{patients.filter(p => p.evolution === 'needs_attention').length}</div>
            <div className="text-sm text-orange-700">Precisam de aten\u00e7\u00e3o</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Paciente</th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Animal</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Sess\u00f5es</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Evolu\u00e7\u00e3o</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Status</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Pr\u00f3xima</th>
                <th className="px-6 py-4"></th>
              </tr></thead>
              <tbody>
                {filteredPatients.map(p => (<tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedPatient(p)}>
                  <td className="px-6 py-4"><div className="font-semibold text-gray-900">{p.name}</div><div className="text-xs text-gray-500">{p.email}</div></td>
                  <td className="px-6 py-4"><div className="text-gray-900">{p.animal_name}</div><div className="text-xs text-gray-500">{p.animal}</div></td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-900">{p.sessions_count}</td>
                  <td className="px-6 py-4 text-center"><span className={`font-semibold ${evolutionColors[p.evolution]}`}>{evolutionLabels[p.evolution]}</span></td>
                  <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[p.status]}`}>{statusLabels[p.status]}</span></td>
                  <td className="px-6 py-4 text-center text-gray-600">{p.next_appointment ? new Date(p.next_appointment).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-6 py-4"><ChevronRight className="w-5 h-5 text-gray-400" /></td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedPatient && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-bold text-gray-900">Detalhes: {selectedPatient.name}</h2>
              <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-gray-600">\u2715</button>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl"><div className="text-sm text-gray-600">Animal</div><div className="font-semibold">{selectedPatient.animal_name} ({selectedPatient.animal})</div></div>
              <div className="p-4 bg-gray-50 rounded-xl"><div className="text-sm text-gray-600">Total de Sess\u00f5es</div><div className="font-semibold">{selectedPatient.sessions_count}</div></div>
              <div className="p-4 bg-gray-50 rounded-xl"><div className="text-sm text-gray-600">\u00daltima Sess\u00e3o</div><div className="font-semibold">{new Date(selectedPatient.last_session).toLocaleDateString('pt-BR')}</div></div>
              <div className="p-4 bg-gray-50 rounded-xl"><div className="text-sm text-gray-600">Evolu\u00e7\u00e3o</div><div className={`font-semibold ${evolutionColors[selectedPatient.evolution]}`}>{evolutionLabels[selectedPatient.evolution]}</div></div>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-petblue-500 text-white rounded-lg font-semibold text-sm hover:bg-petblue-600 flex items-center gap-2"><MessageSquare className="w-4 h-4" />Enviar Mensagem</button>
              <button className="px-4 py-2 bg-petgreen-500 text-white rounded-lg font-semibold text-sm hover:bg-petgreen-600 flex items-center gap-2"><Calendar className="w-4 h-4" />Agendar Sess\u00e3o</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
