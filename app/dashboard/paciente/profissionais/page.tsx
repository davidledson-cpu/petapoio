import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Star, Clock, MapPin, Search } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'

const PROFESSIONALS = [
  { id: 'p1', name: 'Dra. Camila Torres', specialty: 'Luto animal e saúde emocional', crp: 'CRP 06/12345', rating: 4.9, reviews: 87, price: 180, location: 'São Paulo, SP (online)', avatar: '👩‍⚕️', available: true, tags: ['Luto', 'Ansiedade', 'TCC'], bio: 'Especialista em luto por perda de animais de estimação. Mais de 10 anos de experiência em apoio emocional para tutores.' },
  { id: 'p2', name: 'Dr. Ricardo Souza', specialty: 'Psicologia clínica', crp: 'CRP 06/54321', rating: 4.8, reviews: 62, price: 160, location: 'Rio de Janeiro, RJ (online)', avatar: '👨‍⚕️', available: true, tags: ['Luto', 'Trauma', 'Mindfulness'], bio: 'Psicólogo clínico com foco em perdas e transições de vida, incluindo perda de animais de estimação.' },
  { id: 'p3', name: 'Dra. Fernanda Lima', specialty: 'Terapia Cognitivo-Comportamental', crp: 'CRP 05/98765', rating: 4.7, reviews: 43, price: 150, location: 'Curitiba, PR (online)', avatar: '👩‍⚕️', available: false, tags: ['TCC', 'Luto', 'Depressão'], bio: 'Terapeuta com especialização em TCC e vasta experiência em processos de luto, inclusive luto por pets.' },
  { id: 'p4', name: 'Dr. Paulo Nunes', specialty: 'Psicologia humanista', crp: 'CRP 11/11111', rating: 4.6, reviews: 31, price: 140, location: 'Belo Horizonte, MG (online)', avatar: '👨‍⚕️', available: true, tags: ['Humanismo', 'Luto', 'Autoconhecimento'], bio: 'Acredita no potencial humano de superar perdas. Abordagem humanista e empática para quem perdeu um pet.' },
]

export default async function FindProfessionalsPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) { try { user = JSON.parse(sessionCookie) } catch {} }
  if (!user) redirect('/auth/login')

  return (
    <DashboardLayout userRole="patient" userName={user.name || 'Tutor'} userAvatar={user.avatar}>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Encontrar Profissional</h1>
          <p className="text-gray-500 text-sm mt-1">Psicólogos especializados em luto animal, prontos para apoiar você</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por nome, especialidade ou cidade..." className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors bg-white" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['Todos', 'Luto animal', 'TCC', 'Ansiedade', 'Trauma', 'Online', 'Disponível agora'].map(tag => (
            <button key={tag} className="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:border-petblue-400 hover:text-petblue-600 hover:bg-petblue-50 transition-colors first:bg-petblue-400 first:text-white first:border-petblue-400">{tag}</button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {PROFESSIONALS.map(pro => (
            <div key={pro.id} className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-petblue-50 flex items-center justify-center text-3xl flex-shrink-0">{pro.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{pro.name}</h3>
                      <p className="text-xs text-gray-500">{pro.specialty}</p>
                      <p className="text-xs text-gray-400">{pro.crp}</p>
                    </div>
                    {pro.available ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-600 flex-shrink-0">Disponível</span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">Agenda cheia</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{pro.bio}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {pro.tags.map(tag => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-petblue-50 text-petblue-600 font-medium">{tag}</span>))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-gray-700">{pro.rating}</span>
                  <span>({pro.reviews} avaliações)</span>
                </div>
                <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{pro.location}</div>
              </div>
              <div className="flex items-center justify-between">
                <div><span className="text-lg font-bold text-gray-800">R$ {pro.price}</span><span className="text-xs text-gray-400">/sessão</span></div>
                <button disabled={!pro.available} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${pro.available ? 'bg-petblue-400 text-white hover:bg-petblue-500' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  {pro.available ? 'Agendar sessão' : 'Sem horários'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}