'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

const moods = [
  { score: 1, emoji: '😔', label: 'Muito mal' },
  { score: 3, emoji: '😟', label: 'Mal' },
  { score: 5, emoji: '😐', label: 'Regular' },
  { score: 7, emoji: '🙂', label: 'Bem' },
  { score: 10, emoji: '😊', label: 'Ótimo' },
]

interface Props {
  userId: string
  lastCheckIn?: string | null
}

export function CheckInWidget({ userId, lastCheckIn }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  const today = new Date().toDateString()
  const lastDate = lastCheckIn ? new Date(lastCheckIn).toDateString() : null
  const alreadyDone = lastDate === today

  const handleCheckIn = async (score: number) => {
    setSelected(score)
    setDone(true)
    // In demo mode: just record locally. With Supabase, this would save to DB.
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
      <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 mb-4">
        <Heart className="w-4 h-4 text-red-400" />
        Check-in Diário
      </h3>

      {alreadyDone || done ? (
        <div className="text-center py-3">
          <div className="text-3xl mb-2">{selected ? moods.find(m => m.score === selected)?.emoji : '💙'}</div>
          <p className="text-sm text-gray-500">Check-in feito hoje!</p>
          <p className="text-xs text-petgreen-500 font-semibold mt-1">+5 pontos ganhos</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-3">Como você está hoje?</p>
          <div className="flex justify-between gap-1">
            {moods.map(mood => (
              <button
                key={mood.score}
                onClick={() => handleCheckIn(mood.score)}
                className="flex-1 flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-petblue-50 transition-colors group"
                title={mood.label}
              >
                <span className="text-xl group-hover:scale-125 transition-transform">{mood.emoji}</span>
                <span className="text-[10px] text-gray-400">{mood.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
