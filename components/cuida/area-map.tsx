import { NEIGHBORHOODS } from '@/lib/cuida-shared'
import type { CaregiverResult } from '@/lib/cuida'

/**
 * Mapa esquemático da região-piloto. Cada cuidador aparece no centro do bairro,
 * nunca no endereço: a localização exata só é combinada depois da reserva confirmada.
 */
export function AreaMap({ origin, radiusKm, results }: { origin: string | null; radiusKm: number; results: CaregiverResult[] }) {
  const W = 560
  const H = 440
  const center: readonly [number, number] = (origin && NEIGHBORHOODS[origin]) || [-19.935, -43.95]
  const kmPerDegLat = 111.32
  const kmPerDegLng = 111.32 * Math.cos((center[0] * Math.PI) / 180)
  // Enquadra os resultados (e o raio escolhido), com uma margem.
  const far = Math.max(0, ...results.map((r) => {
    const c = NEIGHBORHOODS[r.neighborhood]
    if (!c) return 0
    return Math.hypot((c[0] - center[0]) * kmPerDegLat, (c[1] - center[1]) * kmPerDegLng)
  }))
  const spanKm = Math.max(origin ? Math.min(radiusKm || Infinity, far * 1.2 + 1) : far * 1.15 + 1, 3)
  const scale = (Math.min(W, H) / 2 - 24) / spanKm // px por km
  const project = ([lat, lng]: readonly [number, number]) => ({
    x: W / 2 + (lng - center[1]) * kmPerDegLng * scale,
    y: H / 2 - (lat - center[0]) * kmPerDegLat * scale,
  })
  const inside = (p: { x: number; y: number }) => p.x > 8 && p.x < W - 8 && p.y > 8 && p.y < H - 8

  // Vários cuidadores no mesmo bairro: abre os pontos em leque para não sobrepor.
  const seen = new Map<string, number>()
  const pins = results.map((r, i) => {
    const n = seen.get(r.neighborhood) ?? 0
    seen.set(r.neighborhood, n + 1)
    const p = project(NEIGHBORHOODS[r.neighborhood] ?? center)
    const angle = n * 2.1
    return { i, x: p.x + (n ? Math.cos(angle) * 16 : 0), y: p.y + (n ? Math.sin(angle) * 16 : 0) }
  })

  return (
    <figure className="overflow-hidden rounded-2xl border border-areia bg-[#eef2ec]">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img"
        aria-label={`Mapa aproximado com ${results.length} cuidadores${origin ? ` em torno de ${origin}` : ''}`}>
        <defs>
          <pattern id="grade" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0v28" fill="none" stroke="#dfe5dc" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grade)" />
        {origin && radiusKm > 0 && (
          <circle cx={W / 2} cy={H / 2} r={radiusKm * scale} fill="#7c9a86" fillOpacity=".12" stroke="#7c9a86" strokeDasharray="6 6" />
        )}
        {[2, 5].map((km) => (
          <circle key={km} cx={W / 2} cy={H / 2} r={km * scale} fill="none" stroke="#c9d3c6" strokeWidth="1" />
        ))}
        {Object.entries(NEIGHBORHOODS).map(([name, c]) => {
          const p = project(c)
          if (!inside(p)) return null
          // Nome só nos bairros com cuidadores, para o mapa não virar uma sopa de letras.
          const labeled = name !== origin && results.some((r) => r.neighborhood === name)
          return (
            <g key={name}>
              <circle cx={p.x} cy={p.y} r="2.5" fill="#a8b5a6" />
              {labeled && <text x={p.x + 17} y={p.y + 4} fontSize="12" fill="#5a534d" fontFamily="system-ui, sans-serif">{name}</text>}
            </g>
          )
        })}
        {origin && (
          <g>
            <circle cx={W / 2} cy={H / 2} r="9" fill="#5d7381" stroke="#fff" strokeWidth="3" />
            <text x={W / 2} y={H / 2 + 26} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2e2a27" fontFamily="system-ui, sans-serif">Você · {origin}</text>
          </g>
        )}
        {pins.filter(inside).map((p) => (
          <g key={p.i}>
            <circle cx={p.x} cy={p.y} r="13" fill="#3e5a4b" stroke="#fff" strokeWidth="2.5" />
            <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#f6f5f0" fontFamily="system-ui, sans-serif">{p.i + 1}</text>
          </g>
        ))}
        <g transform={`translate(16 ${H - 22})`}>
          <line x1="0" y1="0" x2={2 * scale} y2="0" stroke="#5a534d" strokeWidth="2" />
          <text x={2 * scale + 6} y="4" fontSize="11" fill="#5a534d" fontFamily="system-ui, sans-serif">2 km</text>
        </g>
      </svg>
      <figcaption className="border-t border-areia bg-white px-4 py-2.5 text-sm text-grafite-suave">
        Localização aproximada, pelo centro do bairro. O endereço só é combinado depois da reserva confirmada.
      </figcaption>
    </figure>
  )
}
