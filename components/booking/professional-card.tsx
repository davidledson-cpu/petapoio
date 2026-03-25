import Link from 'next/link'
import { Star, Clock, Zap } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ProfessionalCardProps {
  professional: {
    id: string
    full_name: string
    avatar_url: string | null
    professional_profiles: {
      specialty: string[]
      short_bio: string | null
      session_price: number
      session_duration: number
      rating_avg: number
      total_sessions: number
      accepts_emergency: boolean
    }
  }
}

export function ProfessionalCard({ professional: pro }: ProfessionalCardProps) {
  const pp = pro.professional_profiles

  return (
    <div className="bg-white rounded-2xl border border-petblue-100 shadow-sm card-hover overflow-hidden">
      {pp.accepts_emergency && (
        <div className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 flex items-center gap-1">
          <Zap className="w-3 h-3" /> Disponível hoje para urgência
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-petblue-50 flex items-center justify-center text-3xl flex-shrink-0">
            {pro.avatar_url ? (
              <img src={pro.avatar_url} alt={pro.full_name} className="w-full h-full rounded-2xl object-cover" />
            ) : '👩‍⚕️'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-gray-800 leading-tight">{pro.full_name}</h3>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {pp.specialty.slice(0, 2).map(s => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-petblue-50 text-petblue-600 text-[10px] font-semibold">
                  {s}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-gray-700">{pp.rating_avg.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({pp.total_sessions} sessões)</span>
            </div>
          </div>
        </div>

        {pp.short_bio && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{pp.short_bio}</p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {pp.session_duration} min
            </div>
            <div className="font-bold text-petblue-600 text-sm">
              {formatCurrency(pp.session_price)}
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
  )
}
