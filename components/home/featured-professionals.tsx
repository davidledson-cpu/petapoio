import Link from 'next/link'
import { Star, Clock, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Static featured professionals for the landing page
const professionals = [
  {
    id: '1',
    name: 'Dra. Ana Paula Ferreira',
    specialty: 'Luto Animal • Trauma',
    rating: 5.0,
    reviews: 48,
    price: 150,
    duration: 50,
    avatar: '👩‍⚕️',
    available: true,
    bio: 'Psicóloga clínica com 8 anos de especialização em luto por perda de animais de estimação.',
  },
  {
    id: '2',
    name: 'Dr. Carlos Mendes',
    specialty: 'Luto • Ansiedade • TCC',
    rating: 4.9,
    reviews: 63,
    price: 130,
    duration: 60,
    avatar: '👨‍⚕️',
    available: true,
    bio: 'Terapeuta cognitivo-comportamental especializado em perdas e transições de vida.',
  },
  {
    id: '3',
    name: 'Dra. Mariana Costa',
    specialty: 'Luto Complicado • Família',
    rating: 5.0,
    reviews: 35,
    price: 170,
    duration: 50,
    avatar: '👩‍💼',
    available: false,
    bio: 'Especialista em luto complicado e terapia familiar. Atua com grupos de apoio semanais.',
  },
]

export function FeaturedProfessionals() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-petbeige-100 text-petblue-600 text-xs font-bold uppercase tracking-widest mb-4">
              Profissionais
            </span>
            <h2 className="font-serif text-4xl font-bold text-gray-800">
              Conheça nossos especialistas
            </h2>
          </div>
          <Link
            href="/profissionais"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-petblue-500 hover:gap-3 transition-all"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {professionals.map((pro) => (
            <div key={pro.id} className="bg-white rounded-2xl border border-petblue-100 shadow-sm card-hover overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-petblue-50">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-petblue-50 flex items-center justify-center text-3xl flex-shrink-0">
                    {pro.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{pro.name}</h3>
                    <p className="text-xs text-petblue-500 mt-1">{pro.specialty}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-gray-700">{pro.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({pro.reviews} avaliações)</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 leading-relaxed line-clamp-2">{pro.bio}</p>
              </div>

              {/* Footer */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {pro.duration} min
                  </div>
                  <div className="font-bold text-petblue-600 text-sm mt-0.5">
                    {formatCurrency(pro.price)}<span className="text-gray-400 font-normal text-xs">/sessão</span>
                  </div>
                </div>
                <Link
                  href={`/profissionais/${pro.id}`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    pro.available
                      ? 'bg-petblue-400 text-white hover:bg-petblue-500'
                      : 'bg-gray-100 text-gray-400 cursor-default'
                  }`}
                >
                  {pro.available ? 'Agendar' : 'Lista de espera'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/profissionais"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-petblue-400 text-petblue-500 font-bold text-sm hover:bg-petblue-50"
          >
            Ver todos os profissionais <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
