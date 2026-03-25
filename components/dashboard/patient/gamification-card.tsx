import Link from 'next/link'
import { Trophy } from 'lucide-react'

interface Props {
  points: number
  levelInfo: { emoji: string; name: string; color: string }
  progress: number
  nextLevel: number
  badgeCount: number
}

export function GamificationCard({ points, levelInfo, progress, nextLevel, badgeCount }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Sua Jornada
        </h3>
        <Link href="/dashboard/paciente/conquistas" className="text-xs text-petblue-500 hover:underline font-semibold">
          Ver tudo
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{levelInfo.emoji}</span>
        <div>
          <div className="font-bold text-gray-800 text-sm">N√≠vel: {levelInfo.name}</div>
          <div className="text-xs text-gray-400">{points} pontos totais</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>{points} pts</span>
          <span>PrÃ≥ü[À {nextLevel} pts</span>
        </div>
        <div className="h-2.5 rounded-full bg-petblue-50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-petblue-400 to-petgreen-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-petblue-50 flex items-center justify-between">
        <span className="text-xs text-gray-500">{badgeCount} conquista{badgeCount !== 1 ? 's' : ''} desbloqueada{badgeCount !== 1 ? 's' : ''}</span>
        <span className="text-lg">üèÜ</span>
      </div>
    </div>
  )
}
