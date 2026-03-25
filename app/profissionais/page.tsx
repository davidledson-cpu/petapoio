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
        <div className="gradient-hero py-16">
          <div className="container text-center text-white">
            <h1 className="font-serif text-4xl font-bold mb-3">Encontre seu Psicólogo</h1>
          </div>
        </div>
        <div className="container py-12">
          <div className="grid md:grid-cols-3 gap-5">
            {professionals?.map((pro: any) => (
              <ProfessionalCard key={pro.id} professional={pro} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
