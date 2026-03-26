import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProfessionalCard } from '@/components/booking/professional-card'
import { ProfessionalFilters } from '@/components/booking/professional-filters'
import { Search } from 'lucide-react'

interface SearchParams {
  q?: string
  specialty?: string
  maxPrice?: string
  available?: string
}

export default async function ProfissionaisPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient()

  let query = supabase
    .from('users')
    .select(`
      id, full_name, avatar_url,
      professional_profiles!inner(
        specialty, bio, short_bio, session_price, session_duration,
        is_verified, rating_avg, total_sessions, accepts_emergency,
        video_intro_url, languages
      )
    `)
    .eq('role', 'professional')
    .eq('is_active', true)
    .eq('professional_profiles.is_verified', true)

  if (searchParams.q) {
    query = query.ilike('full_name', `%${searchParams.q}%`)
  }

  if (searchParams.maxPrice) {
    query = query.lte('professional_profiles.session_price', Number(searchParams.maxPrice))
  }

  const { data: professionals } = await query.order('rating_avg', { ascending: false, foreignTable: 'professional_profiles' })

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
            {/* Search bar */}
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
                  <span className="font-bold text-gray-800">{professionals?.length || 0}</span> profissionais encontrados
                </p>
              </div>

              {professionals && professionals.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {professionals.map((pro: any) => (
                    <ProfessionalCard key={pro.id} professional={pro} />
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
