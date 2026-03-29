import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProfessionalFilters } from '@/components/booking/professional-filters'
import { Search, Star, Clock, Zap } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

// Static professionals data (until Supabase is properly configured)
const allProfessionals = [
  {
    id: '1',
    full_name: 'Dra. Ana Paula Ferreira',
    avatar_emoji: '👩‍⚕️',
    specialty: ['Luto Animal', 'Trauma'],
    approach: 'Psicanálise',
    short_bio: 'Psicóloga clínica com 8 anos de especialização em luto por perda de animais de estimação. Abordagem acolhedora e personalizada.',
    session_price: 150,
    session_duration: 50,
    rating_avg: 5.0,
    total_sessions: 48,
    accepts_emergency: true,
  },
  {
    id: '2',
    full_name: 'Dr. Carlos Mendes',
    avatar_emoji: '👨‍⚕️',
    specialty: ['Luto', 'Ansiedade', 'TCC'],
    approach: 'TCC',
    short_bio: 'Terapeuta cognitivo-comportamental especializado em perdas e transições de vida. Sessões práticas e orientadas a resultados.',
    session_price: 130,
    session_duration: 60,
    rating_avg: 4.9,
    total_sessions: 63,
    accepts_emergency: true,
  },
  {
    id: '3',
    full_name: 'Dra. Mariana Costa',
    avatar_emoji: '👩‍💼',
    specialty: ['Luto Complicado', 'Família'],
    approach: 'Humanismo',
    short_bio: 'Especialista em luto complicado e terapia familiar. Atua com grupos de apoio semanais e terapia individual.',
    session_price: 170,
    session_duration: 50,
    rating_avg: 5.0,
    total_sessions: 35,
    accepts_emergency: false,
  },
  {
    id: '4',
    full_name: 'Dr. Ricardo Lima',
    avatar_emoji: '👨‍💼',
    specialty: ['Comportamento', 'Luto'],
    approach: 'Behaviorismo',
    short_bio: 'Analista do comportamento com foco em estratégias práticas para lidar com a perda e reconstrução emocional.',
    session_price: 140,
    session_duration: 50,
    rating_avg: 4.8,
    total_sessions: 29,
    accepts_emergency: true,
  },
  {
    id: '5',
    full_name: 'Dra. Juliana Alves',
    avatar_emoji: '👩‍🔬',
    specialty: ['Luto Animal', 'Depressão'],
    approach: 'Psicanálise',
    short_bio: 'Psicanalista com experiência em processos de luto e depressão. Atendimento sensível e profundo.',
    session_price: 160,
    session_duration: 50,
    rating_avg: 4.9,
    total_sessions: 42,
    accepts_emergency: false,
  },
  {
    id: '6',
    full_name: 'Dr. Felipe Santos',
    avatar_emoji: '👨‍⚕️',
    specialty: ['Ansiedade', 'Trauma', 'TCC'],
    approach: 'TCC',
    short_bio: 'Especialista em ansiedade e trauma com técnicas de TCC. Ajuda tutores a processar a perda de forma saudável.',
    session_price: 120,
    session_duration: 50,
    rating_avg: 4.7,
    total_sessions: 56,
    accepts_emergency: true,
  },
]

interface SearchParams {
  q?: string
  specialty?: string
  maxPrice?: string
}

export default function ProfissionaisPage({ searchParams }: { searchParams: SearchParams }) {
  let filtered = [...allProfessionals]

  if (searchParams.q) {
    const q = searchParams.q.toLowerCase()
    filtered = filtered.filter(p =>
      p.full_name.toLowerCase().includes(q) ||
      p.specialty.some(s => s.toLowerCase().includes(q)) ||
      p.approach.toLowerCase().includes(q)
    )
  }

  if (searchParams.maxPrice) {
    filtered = filtered.filter(p => p.session_price <= Number(searchParams.maxPrice))
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        {/* Header */}
        <div className="gradient-hero py-16">
          <div className="container text-center text-white">
            <h1 className="font-serif text-4xl font-bold mb-3">Encontre seu Psicólogo</h1>
            <p className="text-white/80 text-base max-w-lg mx-auto mb-8">
              Todos os profissionais são verificados e especializados em luto animal.
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <form>
                <input
                  name="q"
                  defaultValue={searchParams.q}
                  placeholder="Buscar por nome ou especialidade..."
                  className="w-full pl-12 pr-5 py-4 rounded-2xl text-gray-800 text-sm focus:outline-none shadow-lg"
                />
              </form>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters sidebar */}
            <aside className="md:w-64 flex-shrink-0">
              <ProfessionalFilters />
            </aside>

            {/* Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-800">{filtered.length}</span> profissionais encontrados
                </p>
              </div>

              {filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((pro) => (
                    <div key={pro.id} className="bg-white rounded-2xl border border-petblue-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      {pro.accepts_emergency && (
                        <div className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Disponível hoje para urgência
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-petblue-50 flex items-center justify-center text-3xl flex-shrink-0">
                            {pro.avatar_emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-gray-800 leading-tight">{pro.full_name}</h3>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {pro.specialty.slice(0, 2).map(s => (
                                <span key={s} className="px-2 py-0.5 rounded-full bg-petblue-50 text-petblue-600 text-[10px] font-semibold">
                                  {s}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-bold text-gray-700">{pro.rating_avg.toFixed(1)}</span>
                              <span className="text-xs text-gray-400">({pro.total_sessions} sessões)</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{pro.short_bio}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              {pro.session_duration} min
                            </div>
                            <div className="font-bold text-petblue-600 text-sm">
                              {formatCurrency(pro.session_price)}
                              <span className="text-xs font-normal text-gray-400">/sessão</span>
                            </div>
                          </div>
                          <Link
                            href={`/profissionais/${pro.id}`}
                            className="px-4 py-2 rounded-full bg-petblue-400 text-white text-xs font-bold hover:bg-petblue-500 transition-colors"
                          >
                            Ver Perfil
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">Nenhum resultado</h3>
                  <p className="text-gray-500 text-sm">Tente ajustar os filtros ou buscar com outros termos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

