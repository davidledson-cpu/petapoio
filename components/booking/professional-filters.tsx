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
  return (
    <div className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
      <h3 className="font-bold text-sm mb-4"><Filter className="w-4 h-4 inline mr-2" />Filtros</h3>
      <div className="space-y-2">
        {specialties.map(s => (
          <label key={s} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-600">{s}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
