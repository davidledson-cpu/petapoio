import Link from 'next/link'
import { Icon } from '@/components/icon'
import { money } from '@/lib/format'
import { LEVELS, priceFor, SERVICES, SPECIES, type CareService } from '@/lib/cuida-shared'
import type { CaregiverResult } from '@/lib/cuida'

const LEVEL_TONE = {
  cadastrado: 'bg-areia text-grafite',
  verificado: 'bg-nevoa-clara text-nevoa',
  qualificado: 'bg-salvia-clara text-salvia-noite',
  especializado: 'bg-salvia-funda text-linho',
} as const

export function initials(name: string) {
  return name
    .replace(/\(.*\)/, '')
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function LevelBadge({ level }: { level: keyof typeof LEVELS }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${LEVEL_TONE[level]}`}>
      <Icon name="shield" className="size-3.5" />
      {LEVELS[level].label}
    </span>
  )
}

/** Cartão de cuidador: bairro aproximado, distância, nível, serviços e preço do serviço buscado. */
export function CaregiverCard({ c, service, index }: { c: CaregiverResult; service?: CareService | null; index?: number }) {
  const shown = service && c.services.includes(service) ? service : c.services.find((s) => priceFor(c, s) != null) ?? c.services[0]
  const price = shown ? priceFor(c, shown) : null

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-areia bg-white shadow-[0_18px_40px_-32px_rgba(46,42,39,.55)] transition-shadow hover:shadow-[0_24px_48px_-28px_rgba(46,42,39,.6)]">
      <div className="relative flex h-28 items-end justify-between bg-[linear-gradient(135deg,var(--color-salvia-clara),var(--color-nevoa-clara))] px-5 pb-3">
        <span aria-hidden="true" className="absolute right-4 top-3 text-salvia/50"><Icon name="paw" className="size-12" /></span>
        <span className="flex size-16 translate-y-8 items-center justify-center rounded-2xl border-4 border-white bg-salvia-funda font-serif text-2xl text-linho">
          {initials(c.full_name) || 'C'}
        </span>
        {typeof index === 'number' && (
          <span className="flex size-7 items-center justify-center rounded-full bg-grafite text-sm font-bold text-linho" aria-label={`Ponto ${index + 1} no mapa`}>
            {index + 1}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 pt-10">
        <div className="flex flex-wrap items-center gap-2">
          {c.demo && <span className="rounded-full bg-[#f3e8cf] px-2.5 py-0.5 text-xs font-semibold text-[#6b4f12]">Demonstração</span>}
          <LevelBadge level={c.level} />
        </div>
        <h3 className="mt-2 font-sans text-lg font-bold">{c.full_name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-[0.95rem] text-grafite-suave">
          <Icon name="pin" className="size-4" />
          {c.neighborhood}
          {c.distance != null && <> · {c.distance < 1 ? 'menos de 1 km' : `~${c.distance.toFixed(1).replace('.', ',')} km`}</>}
        </p>
        {c.headline && <p className="mt-3 line-clamp-3 flex-1 text-grafite-suave">{c.headline}</p>}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Serviços">
          {c.services.map((s) => (
            <li key={s} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s === service ? 'bg-salvia-funda text-linho' : 'bg-linho-escuro text-grafite'}`}>
              {SERVICES[s].short}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-grafite-suave">{c.species.map((s) => SPECIES[s]).join(' · ')}</p>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-areia pt-4">
          <p>
            <span className="font-serif text-2xl">{money(price)}</span>
            {shown && <span className="text-sm text-grafite-suave"> / {SERVICES[shown].unit}</span>}
          </p>
          <Link href={`/cuida/${c.slug}`} className="btn btn-primario !min-h-10 !px-4 !py-2">
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  )
}
