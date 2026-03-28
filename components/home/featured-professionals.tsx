'use client'

import Link from 'next/link'
import { Star, Clock, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

const approachFilters = [
  { key: 'todos', label: 'Todos' },
  { key: 'tcc', label: 'TCC' },
  { key: 'psicanalise', label: 'Psicanálise' },
  { key: 'behaviorismo', label: 'Behaviorismo' },
  { key: 'humanismo', label: 'Humanismo' },
]

// Static featured professionals for the landing page
const professionals = [
  {
    id: '1',
    name: 'Dra. Ana Paula Ferreira',
    specialty: 'Luto Animal • Trauma',
    approach: 'psicanalise',
    approachLabel: 'Psicanálise',
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
    approach: 'tcc',
    approachLabel: 'TCC',
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
    approach: 'humanismo',
    approachLabel: 'Humanismo',
    rating: 5.0,
    reviews: 35,
    price: 170,
    duration: 50,
    avatar: '👩‍💼',
    available: false,
    bio: 'Especialista em luto complicado e terapia familiar. Atua com grupos de apoio semanais.',
  },
  {
    id: '4',
    name: 'Dr. Ricardo Lima',
    specialty: 'Comportamento • Luto',
    approach: 'behaviorismo',
    approachLabel: 'Behaviorismo',
    rating: 4.8,
    reviews: 29,
    price: 140,
    duration: 50,
    avatar: '👨‍⚕️',
    available: true,
    bio: 'Analista do comportamento com foco em estratégias práticas para lidar com a perda de pets.',
  },
]

export function FeaturedProfessionals() {
  const [activeFilter, setActiveFilter] = useState('todos')

  const filtered = activeFilter === 'todos'
    ? professionals
    : professionals.filter(p => p.approach === activeFilter)

  return (
    <section className="py-24 bg-petbeige-50">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-petblue-100 text-petblue-700 text-xs font-bold uppercase tracking-widest mb-4">
              Profissionais
            </span>
            <h2 className="font-serif text-4xl font-bold text-gray-800">
              Conheça nossos especialistas
            </h2>
          </div>
          <Link
            href="/profissionais"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-petblue-600 hover:gap-3 transition-all"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Approach Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {approachFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === filter.key
                  ? 'bg-petblue-500 text-white shadow-md shadow-petblue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-petblue-300 hover:text-petblue-600 shadow-sm'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((pro) => (
            <div
              key={pro.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl card-hover overflow-hidden transition-shadow duration-300"
            >
              {/* Approach Badge */}
              <div className="px-6 pt-5">
                <span className="inline-block px-3 py-1 rounded-full bg-petblue-50 text-petblue-600 text-[11px] font-bold uppercase tracking-wide">
                  {pro.approachLabel}
                </span>
              </div>

              {/* Header */}
              <div className="p-6 pt-3 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-petblue-50 flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
                    {pro.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">
                      {pro.name}
                    </h3>
                    <p className="text-xs text-petblue-600 mt-1 font-medium">{pro.specialty}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-gray-700">
                        {pro.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({pro.reviews} avaliações)
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4 leading-relaxed line-clamp-2">
                  {pro.bio}
                </p>
              </div>

              {/* Footer */}
              <div className="p-4 flex items-center justify-between bg-gray-50/50">
                <div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> {pro.duration} min
                  </div>
                  <div className="font-bold text-petblue-700 text-sm mt-0.5">
                    {formatCurrency(pro.price)}
                    <span className="text-gray-500 font-normal text-xs">/sessão</span>
                  </div>
                </div>
                <Link
                  href={`/profissionais/${pro.id}`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    pro.available
                      ? 'bg-petblue-500 text-white hover:bg-petblue-600 shadow-sm'
                      : 'bg-gray-100 text-gray-500 cursor-default'
                  }`}
                >
                  {pro.available ? 'Agendar' : 'Lista de espera'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">
              Nenhum profissional encontrado com esta abordagem. Tente outro filtro.
            </p>
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/profissionais"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-petblue-500 text-petblue-600 font-bold text-sm hover:bg-petblue-50 shadow-sm"
          >
            Ver todos os profissionais <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
