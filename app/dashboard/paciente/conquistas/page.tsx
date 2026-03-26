import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Trophy, Star, Lock } from 'lucide-react'
import { getLevelInfo, getNextLevelPoints } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/layout'

const BADGES = [
  { id: 'b1', name: 'Primeiro Passo', emoji: '🌱', description: 'Completou sua primeira sessão', unlocked: true, date: '2026-01-15' },
  { id: 'b2', name: 'Coragem', emoji: '💜', description: 'Realizou 3 sessões seguidas', unlocked: true, date: '2026-02-01' },
  { id: 'b3', name: 'Check-in Diário', emoji: '📅', description: 'Fez check-in por 7 dias consecutivos', unlocked: false, date: null },
  { id: 'b4', name: 'Guerreiro', emoji: '⚔️', description: 'Completou 5 sessões', unlocked: false, date: null },
  { id: 'b5', name: 'Dedicação', emoji: '🎯', description: 'Completou 10 sessões', unlocked: false, date: null },
  { id: 'b6', name: 'Superação', emoji: '🦋', description: 'Completou 20 sessões', unlocked: false, date: null },
  { id: 'b7', name: 'Comunidade', emoji: '🤝', description: 'Participou de grupo de apoio', unlocked: false, date: null },
  { id: 'b8', name: 'Gratidão', emoji: '🙏', description: 'Deixou uma avaliação para o profissional', unlocked: false, date: null },
]

const LEVELS = [
  { name: 'Iniciante', emoji: '🌱', min: 0, max: 100 },
  { name: 'Crescendo', emoji: '🌿', min: 100, max: 300 },
  { name: 'Florescendo', emoji: '🌸', min: 300, max: 600 },
  { name: 'Iluminado', emoji: '☀️', min: 600, max: 1000 },
  { name: 'Mestre', emoji: '🌟', min: 1000, max: Infinity },
]

export default async function PatientAchievementsPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) { try { user = JSON.parse(sessionCookie) } catch {} }
  if (!user) redirect('/auth/login')

  const points = 150
  const levelInfo = getLevelInfo(points)
  const nextLevel = getNextLevelPoints(points)
  const progress = Math.min((points / nextLevel) * 100, 100)
  const unlocked = BADGES.filter(b => b.unlocked)

  return (
    <DashboardLayout userRole="patient" userName={user.name || 'Tutor'} userAvatar={user.avatar}>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Minhas Conquistas</h1>
          <p className="text-gray-500 text-sm mt-1">{unlocked.length} de {BADGES.length} conquistas desbloqueadas</p>
        </div>

        {/* Level card */}
        <div className="bg-gradient-to-br from-petblue-400 to-petblue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-5xl">{levelInfo.emoji}</span>
            <div>
              <div className="text-lg font-bold">Nível: {levelInfo.name}</div>
              <div className="text-white/70 text-sm">{points} pontos totais</div>
            </div>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span>{points} pts</span>
            <span>Próximo nível: {nextLevel} pts</span>
          </div>
          <div className="h-3 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Level roadmap */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Jornada de Níveis
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {LEVELS.map((lvl, i) => {
              const active = points >= lvl.min && (lvl.max === Infinity || points < lvl.max)
              const done = points >= lvl.max
              return (
                <div key={lvl.name} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`flex flex-col items-center p-3 rounded-2xl min-w-[80px] text-center transition-all ${active ? 'bg-petblue-400 text-white scale-105 shadow-md' : done ? 'bg-petgreen-50 text-petgreen-600' : 'bg-gray-50 text-gray-400'}`}>
                    <span className="text-2xl">{lvl.emoji}</span>
                    <span className="text-xs font-bold mt-1">{lvl.name}</span>
                    <span className="text-[10px] opacity-70">{lvl.min}+ pts</span>
                  </div>
                  {i < LEVELS.length - 1 && <div className="w-6 h-0.5 bg-gray-200 flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Distintivos
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {BADGES.map(badge => (
              <div
                key={badge.id}
                className={`bg-white rounded-2xl p-5 border text-center transition-all ${
                  badge.unlocked
                    ? 'border-petblue-100 shadow-sm hover:shadow-md'
                    : 'border-gray-100 opacity-50 grayscale'
                }`}
              >
                <div className="text-4xl mb-2">{badge.emoji}</div>
                <div className="font-bold text-sm text-gray-800">{badge.name}</div>
                <div className="text-xs text-gray-500 mt-1 leading-tight">{badge.description}</div>
                {badge.unlocked ? (
                  <div className="mt-2 text-xs text-petgreen-500 font-semibold">
                    ✅ {new Date(badge.date!).toLocaleDateString('pt-BR')}
                  </div>
                ) : (
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                    <Lock className="w-3 h-3" />
                    Bloqueado
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
