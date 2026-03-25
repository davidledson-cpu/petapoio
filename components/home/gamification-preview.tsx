import Link from 'next/link'

const levels = [
  { emoji: '🌱', name: 'Semente', points: '0–199', color: 'bg-green-50 border-green-200' },
  { emoji: '🌿', name: 'Broto',   points: '200–499', color: 'bg-emerald-50 border-emerald-200' },
  { emoji: '🌸', name: 'Flor',    points: '500–999', color: 'bg-pink-50 border-pink-200' },
  { emoji: '🌳', name: 'Árvore',  points: '1000–2499', color: 'bg-green-100 border-green-300' },
  { emoji: '✨', name: 'Luz',     points: '2500+', color: 'bg-yellow-50 border-yellow-200' },
]

const badges = ['🐾', '💬', '🗓️', '❤️', '🌟', '👥', '🏆']

export function GamificationPreview() {
  return (
    <section className="py-24 bg-petbeige-50">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-petblue-50 text-petblue-600 text-xs font-bold uppercase tracking-widest mb-4">
              Jornada de Cura
            </span>
            <h2 className="font-serif text-4xl font-bold text-gray-800 mb-5">
              Cada passo importa na sua recuperação
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Nossa gamificação terapêutica celebra seu progresso. Ganhe pontos em cada sessão,
              suba de nível e desbloqueie conquistas que marcam sua jornada de cura.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { action: 'Realizar uma consulta', points: '+30 pts' },
                { action: 'Check-in emocional diário', points: '+5 pts' },
                { action: 'Manter sequência semanal', points: '+20 pts/semana' },
                { action: 'Avaliar o profissional', points: '+15 pts' },
              ].map(item => (
                <div key={item.action} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white border border-petblue-100">
                  <span className="text-sm text-gray-600">{item.action}</span>
                  <span className="text-sm font-bold text-petgreen-500">{item.points}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/cadastro"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 transition-all"
            >
              Começar minha jornada
            </Link>
          </div>

          <div className="space-y-4">
            {/* Level progression */}
            <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
              <h3 className="font-bold text-sm text-gray-700 mb-4">Níveis da Jornada de Cura</h3>
              <div className="grid grid-cols-5 gap-3">
                {levels.map((lvl) => (
                  <div key={lvl.name} className={`rounded-xl p-3 border text-center ${lvl.color}`}>
                    <div className="text-2xl mb-1">{lvl.emoji}</div>
                    <div className="text-xs font-bold text-gray-700">{lvl.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{lvl.points}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
              <h3 className="font-bold text-sm text-gray-700 mb-4">Conquistas Desbloqueáveis</h3>
              <div className="flex gap-3 flex-wrap">
                {badges.map((badge, i) => (
                  <div key={i} className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${i < 3 ? 'border-petblue-300 bg-petblue-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                    {badge}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">3 de 7 conquistas desbloqueadas</p>
            </div>

            {/* Sample progress bar */}
            <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌸</span>
                  <div>
                    <div className="font-bold text-sm text-gray-800">Nível 3 — Flor</div>
                    <div className="text-xs text-gray-400">650 / 1000 pontos para o próximo nível</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-petblue-500">65%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-petblue-50 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-petblue-400 to-petgreen-400 transition-all" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
