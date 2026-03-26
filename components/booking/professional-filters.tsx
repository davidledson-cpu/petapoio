'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Filter } from 'lucide-react'

const specialties = ['Luto Animal', 'Trauma', 'Ansiedade', 'TCC', 'Família', 'Luto Complicado']
const priceRanges = [
  { label: 'Até R$ 100', value: '100' },
  { label: 'Até R$ 150', value: '150' },
  { label: 'Até R$ 200', value: '200' },
  { label: 'Sem limite', value: '' },
]

export function ProfessionalFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(name, value)
    else params.delete(name)
    return params.toString()
  }, [searchParams])

  return (
    <div className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm sticky top-24">
      <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-5">
        <Filter className="w-4 h-4 text-petblue-400" />
        Filtros
      </h3>

      {/* Specialty */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Especialidade</label>
        <div className="space-y-2">
          {specialties.map(s => (
            <label key={s} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="rounded border-gray-300 accent-petblue-400"
                onChange={(e) => {
                  router.push(`?${createQueryString('specialty', e.target.checked ? s : '')}`)
                }}
              />
              <span className="text-sm text-gray-600 group-hover:text-petblue-600">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Valor por sessão</label>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="price"
                className="accent-petblue-400"
                onChange={() => router.push(`?${createQueryString('maxPrice', range.value)}`)}
              />
              <span className="text-sm text-gray-600 group-hover:text-petblue-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Available */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 accent-petblue-400"
            onChange={(e) => router.push(`?${createQueryString('available', e.target.checked ? '1' : '')}`)}
          />
          <span className="text-sm text-gray-600">Apenas disponíveis hoje</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input type="checkbox" className="rounded border-gray-300 accent-petblue-400"
            onChange={(e) => router.push(`?${createQueryString('emergency', e.target.checked ? '1' : '')}`)} />
          <span className="text-sm text-gray-600">Aceita urgência</span>
        </label>
      </div>
    </div>
  )
}
