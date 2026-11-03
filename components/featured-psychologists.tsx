import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { publicFileUrl } from '@/lib/supabase/storage'
import { money } from '@/lib/format'
import type { DirectoryEntry } from '@/types/db'

const MODALITY: Record<DirectoryEntry['modality'], string> = {
  online: 'Online',
  presencial: 'Presencial',
  ambos: 'Online e presencial',
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

/** Cartão de um profissional no diretório e na home. */
export function PsychologistCard({ entry }: { entry: DirectoryEntry }) {
  const photo = publicFileUrl('avatars', entry.photo_path)
  const where = entry.modality === 'online' ? null : [entry.city, entry.state].filter(Boolean).join('/')
  const bookable = entry.mp_connected && entry.session_price_cents != null

  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia),0_18px_36px_-30px_rgba(46,42,39,.4)]">
      <div className="flex items-start gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-full bg-salvia-clara">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="size-full object-cover" loading="lazy" />
          ) : (
            <span aria-hidden="true" className="flex size-full items-center justify-center font-serif text-2xl text-salvia-noite">
              {initials(entry.full_name)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-[1.45rem] leading-tight">
            <Link href={`/psicologos/${entry.slug}`} className="hover:text-salvia-funda">
              {entry.full_name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-grafite-suave">
            CRP {entry.crp}/{entry.crp_state}
            {entry.approach && ` · ${entry.approach}`}
          </p>
        </div>
      </div>

      {entry.headline && <p className="mt-4 text-grafite-suave">{entry.headline}</p>}

      <ul className="mt-4 flex flex-wrap gap-1.5 text-sm">
        {entry.pet_grief_experience && <li className="rounded-full bg-salvia-clara px-2.5 py-0.5 text-salvia-noite">Experiência com luto pet</li>}
        <li className="rounded-full bg-areia px-2.5 py-0.5">{MODALITY[entry.modality]}{where && ` · ${where}`}</li>
        {entry.serves_children && <li className="rounded-full bg-areia px-2.5 py-0.5">Atende crianças</li>}
        {entry.serves_families && <li className="rounded-full bg-areia px-2.5 py-0.5">Atende famílias</li>}
      </ul>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
        <p>
          {entry.session_price_cents != null ? (
            <>
              <span className="font-serif text-2xl">{money(entry.session_price_cents)}</span>
              <span className="text-sm text-grafite-suave"> / {entry.session_minutes} min</span>
            </>
          ) : (
            <span className="text-sm text-grafite-suave">Valor em breve</span>
          )}
        </p>
        <Link href={`/psicologos/${entry.slug}`} className={`btn ${bookable ? 'btn-primario' : 'btn-secundario'}`}>
          {bookable ? 'Ver horários' : 'Ver perfil'}
          <span className="sr-only"> de {entry.full_name}</span>
        </Link>
      </div>
    </article>
  )
}

async function loadFeatured(): Promise<DirectoryEntry[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('psychologist_directory')
      .select('*')
      .eq('mp_connected', true)
      .not('session_price_cents', 'is', null)
      .order('approved_at', { ascending: true })
      .limit(3)
      .returns<DirectoryEntry[]>()
    return data ?? []
  } catch {
    return []
  }
}

/** Até 3 profissionais aprovados e com pagamento ativo, para a home. */
export async function FeaturedPsychologists() {
  const data = await loadFeatured()
  if (data.length === 0) return null

  return (
    <section className="container-page py-16" aria-labelledby="profissionais-destaque">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="profissionais-destaque" className="text-4xl">Profissionais que entendem essa perda</h2>
          <p className="mt-2 max-w-[60ch] text-grafite-suave">CRP conferido, experiência com luto e agenda online com pagamento seguro.</p>
        </div>
        <Link href="/psicologos" className="link font-semibold">Ver todos os profissionais</Link>
      </div>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((entry) => (
          <li key={entry.id}>
            <PsychologistCard entry={entry} />
          </li>
        ))}
      </ul>
    </section>
  )
}
