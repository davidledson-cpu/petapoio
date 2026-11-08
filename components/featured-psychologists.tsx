import Link from 'next/link'
import { publicFileUrl } from '@/lib/supabase/storage'
import { money } from '@/lib/format'
import { listDirectory } from '@/lib/directory'
import { isDemoSlug } from '@/lib/demo'
import type { DirectoryEntry } from '@/types/db'

const MODALITY: Record<DirectoryEntry['modality'], string> = {
  online: 'Online',
  presencial: 'Presencial',
  ambos: 'Online e presencial',
}

function initials(name: string) {
  return name
    .replace(/\(.*\)/, '')
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

/** Cartão de profissional no estilo vitrine: abordagem, quem é, valor, duração e "Agendar". */
export function PsychologistCard({ entry }: { entry: DirectoryEntry }) {
  const photo = publicFileUrl('avatars', entry.photo_path)
  const where = entry.modality === 'online' ? null : [entry.city, entry.state].filter(Boolean).join('/')
  const bookable = entry.mp_connected && entry.session_price_cents != null
  const demo = entry.slug ? isDemoSlug(entry.slug) : false
  const href = `/psicologos/${entry.slug}`

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-areia bg-white shadow-[0_18px_40px_-32px_rgba(46,42,39,.55)] transition-shadow hover:shadow-[0_24px_48px_-28px_rgba(46,42,39,.6)]">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {entry.approach ? (
            <span className="rounded-full bg-nevoa-clara px-3 py-1 text-xs font-bold uppercase tracking-wide text-nevoa">{entry.approach}</span>
          ) : (
            <span />
          )}
          {demo ? (
            <span className="rounded-full bg-[#f3e8cf] px-2.5 py-0.5 text-xs font-semibold text-[#6b4f12]">Demonstração</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-salvia-funda">
              <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 3.5 4v5.5c0 4 2.8 7.4 6.5 9 3.7-1.6 6.5-5 6.5-9V4L10 1.5Z" fill="currentColor" opacity=".2" /><path d="m6.8 10.2 2.2 2.2 4.4-4.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              CRP conferido
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="size-16 shrink-0 overflow-hidden rounded-2xl bg-salvia-clara">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="size-full object-cover" loading="lazy" />
            ) : (
              <span aria-hidden="true" className="flex size-full items-center justify-center font-serif text-2xl text-salvia-noite">
                {initials(entry.full_name) || 'P'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-sans text-lg font-bold leading-snug">
              <Link href={href} className="hover:text-salvia-funda">
                {entry.full_name}
              </Link>
            </h3>
            <p className="text-sm text-salvia-funda">
              {[entry.pet_grief_experience ? 'Luto pet' : null, ...entry.specialties.filter((s) => s !== 'Luto pet')].filter(Boolean).slice(0, 3).join(' · ')}
            </p>
            <p className="text-sm text-grafite-suave">CRP {entry.crp}/{entry.crp_state}</p>
          </div>
        </div>

        {entry.headline && <p className="mt-4 line-clamp-3 text-[0.97rem] text-grafite-suave">{entry.headline}</p>}

        <ul className="mt-4 flex flex-wrap gap-1.5 text-xs font-medium">
          <li className="rounded-full bg-areia px-2.5 py-1">{MODALITY[entry.modality]}{where && ` · ${where}`}</li>
          {entry.serves_children && <li className="rounded-full bg-areia px-2.5 py-1">Crianças</li>}
          {entry.serves_families && <li className="rounded-full bg-areia px-2.5 py-1">Famílias</li>}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-areia bg-linho/60 px-6 py-4">
        <div className="text-sm leading-tight">
          <span className="flex items-center gap-1 text-grafite-suave">
            <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M10 6v4.3l2.8 1.7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            {entry.session_minutes} min
          </span>
          {entry.session_price_cents != null ? (
            <span>
              <b className="text-base">{money(entry.session_price_cents)}</b>
              <span className="text-grafite-suave">/sessão</span>
            </span>
          ) : (
            <span className="text-grafite-suave">Valor em breve</span>
          )}
        </div>
        <Link href={`${href}#agendar`} className={`btn !min-h-10 !px-5 !py-2 ${bookable ? 'btn-primario' : 'btn-secundario'}`}>
          {bookable ? 'Agendar' : 'Ver perfil'}
          <span className="sr-only"> com {entry.full_name}</span>
        </Link>
      </div>
    </article>
  )
}

const APPROACHES = ['TCC', 'Psicanálise', 'Humanista', 'Análise do comportamento']

/** Vitrine de profissionais para a home, com atalhos por abordagem. */
export async function FeaturedPsychologists() {
  const data = (await listDirectory({})) ?? []
  const shown = data.slice(0, 3)

  return (
    <section className="bg-linho-escuro py-20" aria-labelledby="profissionais-destaque">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-salvia-funda">Profissionais</p>
            <h2 id="profissionais-destaque" className="mt-1 text-4xl md:text-5xl">Converse com quem entende essa perda</h2>
          </div>
          <Link href="/psicologos" className="link font-semibold">Ver todos os profissionais</Link>
        </div>

        <nav aria-label="Filtrar por abordagem" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            <li><Link href="/psicologos#profissionais" className="inline-block rounded-full bg-salvia-funda px-4 py-2 text-[0.95rem] font-semibold text-linho">Todos</Link></li>
            {APPROACHES.map((a) => (
              <li key={a}>
                <Link href={`/psicologos?abordagem=${encodeURIComponent(a)}#profissionais`} className="inline-block rounded-full border border-areia-escura bg-white px-4 py-2 text-[0.95rem] font-medium hover:border-salvia-funda">
                  {a}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {shown.length > 0 ? (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((entry) => (
              <li key={entry.id}>
                <PsychologistCard entry={entry} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-2xl border border-areia bg-white p-8">
            <h3 className="font-sans text-xl font-bold">Os primeiros perfis estão em verificação</h3>
            <p className="mt-2 max-w-[60ch] text-grafite-suave">
              Conferimos o registro no CRP de cada profissional antes de publicar. Deixe seu e-mail na página de psicólogos e avisamos quando a agenda abrir.
            </p>
            <Link href="/psicologos" className="btn btn-primario mt-5">Quero ser avisado</Link>
          </div>
        )}
      </div>
    </section>
  )
}
