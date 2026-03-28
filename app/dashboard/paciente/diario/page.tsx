'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, TrendingUp, Calendar } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { getSession } from '@/lib/auth/session'

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😊', '😄', '😆', '🥰', '🤗', '😍']

export default function DiarioPage() {
  const router = useRouter()
  const session = getSession()
  const [selectedMood, setSelectedMood] = useState<number>(5)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
    }
  }, [session, router])

  if (!session) return null

  const handleSubmit = () => {
    setNote('')
    setSelectedMood(5)
  }

  const recentEntries = [
    { date: 'Hoje', mood: 7, note: 'Dia bom, consegui pensar melhor', time: '15:30' },
    { date: 'Ontem', mood: 6, note: 'Um pouco ansioso, mas melhorando', time: '18:00' },
    { date: '2 dias atrás', mood: 5, note: 'Dia normal', time: '19:45' },
    { date: '3 dias atrás', mood: 7, note: 'Ótimo! Consegui resolver um problema', time: '14:20' },
    { date: '4 dias atrás', mood: 8, note: 'Excelente dia!', time: '20:15' },
  ]

  const moodData = [
    { mood: 'Muito ruim', count: 2, percent: 7 },
    { mood: 'Ruim', count: 3, percent: 10 },
    { mood: 'Neutro', count: 7, percent: 23 },
    { mood: 'Bom', count: 11, percent: 37 },
    { mood: 'Muito bom', count: 7, percent: 23 },
  ]

  return (
    <DashboardLayout userRole="patient" userName={session.name}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-8 h-8 text-petblue-400" />
            Diário Emocional
          </h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe seu bem-estar ao longo do tempo</p>
        </div>

        {/* Check-in Card */}
        <div className="bg-gradient-to-br from-petgreen-50 to-petblue-50 rounded-2xl p-8 border border-petgreen-200 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Como você está se sentindo agora?</h2>

          {/* Mood Selector */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {MOOD_EMOJIS.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMood(i)}
                  className={`text-4xl transition-all ${
                    selectedMood === i ? 'scale-125' : 'opacity-60 hover:opacity-100 scale-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">
                Pontuação: <span className="text-2xl text-petblue-600">{selectedMood}</span> / 10
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nota (opcional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Como foi seu dia? O que você sente neste momento?"
              className="w-full px-4 py-3 rounded-lg border border-petblue-200 focus:outline-none focus:border-petblue-400 text-sm resize-none"
              rows={3}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 rounded-lg bg-petblue-400 text-white font-bold hover:bg-petblue-500 transition-colors"
          >
            Registrar Sentimento
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-petblue-400" />
              <span className="text-xs text-gray-500">Humor Médio</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">6.2</div>
            <p className="text-xs text-gray-400 mt-2">nos últimos 30 dias</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-petgreen-400" />
              <span className="text-xs text-gray-500">Registros</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">28</div>
            <p className="text-xs text-gray-400 mt-2">este mês</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-gray-500">Melhor Sequência</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">12 dias</div>
            <p className="text-xs text-gray-400 mt-2">registro contínuo</p>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-6">Distribuição de Humor</h3>
          <div className="space-y-3">
            {moodData.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{item.mood}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-petblue-400 to-petgreen-400 h-full flex items-center justify-end pr-3 text-xs font-bold text-white"
                    style={{ width: `${item.percent}%` }}
                  >
                    {item.percent > 5 && `${item.percent}%`}
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{item.count} dias</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Entries */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Entradas Recentes</h3>
          <div className="space-y-3">
            {recentEntries.map((entry, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{MOOD_EMOJIS[entry.mood]}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{entry.date}</p>
                        <p className="text-xs text-gray-500">{entry.time}</p>
                      </div>
                    </div>
                    {entry.note && <p className="text-sm text-gray-700 mt-2">{entry.note}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-petblue-600">{entry.mood}</p>
                    <p className="text-xs text-gray-400">/ 10</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
