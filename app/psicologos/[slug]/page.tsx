import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookingPicker } from '@/components/booking-picker'
import { JsonLd } from '@/components/json-ld'
import { getDirectoryEntry } from '@/lib/directory'
import { getSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { publicFileUrl } from '@/lib/supabase/storage'
import { computeSlots } from '@/lib/slots'
import { money } from '@/lib/format'
import { MODALITY_LABEL } from '@/lib/psychologist'
import { absoluteUrl } from '@/lib/site'
import { isSplitConfigured } from '@/lib/env'
import type { Availability } from '@/types/db'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ horario?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await getDirectoryEntry(slug)
  if (!p) return { title: 'Profissional não encontrado' }
  return {
    title: `${p.full_name} — psicóloga(o) para o luto`,
    description: p.headline ?? `Converse com ${p.full_name}, CRP ${p.crp}/${p.crp_state}, pelo PetApoio.`,
    alternates: { canonical: `/psicologos/${slug}` },
  }
}

export default async function PsychologistPage({ params, searchParams }: Props) {
  const [{ slug }, { horario }] = await Promise.all([params, searchParams])
  const p = await getDirectoryEntry(slug)
  if (!p) notFound()

  const session = await getSession()
  const supabase = await createClient()
  const now = new Date()
  const to = new Date(now.getTime() + 22 * 86400_000)
  const [{ data: availability }, { data: busy }, { data: settings }] = await Promise.all([
    supabase.from('availability').select('weekday, start_time, end_time').eq('psychologist_id', p.id),
    supabase.rpc('busy_ranges', { p_psychologist: p.id, p_from: now.toISOString(), p_to: to.toISOString() }),
    supabase.from('platform_settings').select('min_notice_hours').single<{ min_notice_hours: number }>(),
  ])

  const bookable = p.mp_connected && p.session_price_cents != null && isSplitConfigured()
  const days = bookable
    ? computeSlots({
        availability: (availability ?? []) as Pick<Availability, 'weekday' | 'start_time' | 'end_time'>[],
        busy: (busy ?? []) as { starts_at: string; ends_at: string }[],
        sessionMinutes: p.session_minutes,
        minNoticeHours: settings?.min_notice_hours ?? 12,
        now,
      })
    : []

  const photo = publicFileUrl('avatars', p.photo_path)
  const place = p.modality !== 'online' ? [p.city, p.state].filter(Boolean).join('/') : null

  return (
    <div className="container-page pt-10 md:pt-14">
      <Link href="/psicologos" className="link text-[0.95rem]">Todos os profissionais</Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <article>
          <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="size-32 shrink-0 overflow-hidden rounded-full bg-salvia-clara">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={`Foto de ${p.full_name}`} className="size-full object-cover" />
              ) : null}
            </div>
            <div>
              <h1 className="text-[2.3rem] leading-tight md:text-5xl">{p.full_name}</h1>
              <p className="mt-2 text-grafite-suave">
                Psicóloga(o) · CRP {p.crp}/{p.crp_state} <span className="ml-1 rounded-full bg-salvia-clara px-2 py-0.5 text-sm text-salvia-noite">Registro conferido</span>
              </p>
            </div>
          </header>

          {p.headline && <p className="mt-8 font-serif text-2xl leading-snug">{p.headline}</p>}

          <dl className="mt-8 grid gap-x-8 gap-y-4 border-y border-areia py-6 sm:grid-cols-2">
            <div><dt className="text-sm text-grafite-suave">Atendimento</dt><dd>{MODALITY_LABEL[p.modality]}{place && ` · ${place}`}</dd></div>
            <div><dt className="text-sm text-grafite-suave">Sessão</dt><dd>{p.session_minutes} min · {money(p.session_price_cents)}</dd></div>
            {p.approach && <div><dt className="text-sm text-grafite-suave">Abordagem</dt><dd>{p.approach}</dd></div>}
            <div><dt className="text-sm text-grafite-suave">Idiomas</dt><dd>{p.languages.join(', ')}</dd></div>
          </dl>

          <ul className="mt-6 flex flex-wrap gap-2 text-sm">
            {p.pet_grief_experience && <li className="rounded-full bg-salvia-clara px-3 py-1 text-salvia-noite">Experiência com luto pet</li>}
            {p.serves_children && <li className="rounded-full bg-areia px-3 py-1">Atende crianças</li>}
            {p.serves_families && <li className="rounded-full bg-areia px-3 py-1">Atende famílias</li>}
            {p.specialties.map((s) => <li key={s} className="rounded-full bg-areia px-3 py-1">{s}</li>)}
          </ul>

          {p.bio && (
            <section className="mt-10" aria-labelledby="sobre">
              <h2 id="sobre" className="text-3xl">Sobre</h2>
              <div className="texto mt-4 whitespace-pre-line">{p.bio}</div>
            </section>
          )}
          {p.education && (
            <section className="mt-10" aria-labelledby="formacao">
              <h2 id="formacao" className="text-3xl">Formação</h2>
              <p className="mt-4 whitespace-pre-line text-grafite-suave">{p.education}</p>
            </section>
          )}
        </article>

        <aside id="agendar" className="h-fit rounded-[1.75rem] bg-white p-6 shadow-[0_1px_0_var(--color-areia),0_24px_48px_-36px_rgba(46,42,39,.45)] md:p-8 lg:sticky lg:top-24">
          <h2 className="text-3xl">Agendar uma sessão</h2>
          <p className="mt-2 text-grafite-suave">{p.session_minutes} minutos, por vídeo · {money(p.session_price_cents)}</p>
          <div className="mt-6">
            {bookable ? (
              <BookingPicker
                days={days}
                psychologistId={p.id}
                slug={slug}
                priceLabel={money(p.session_price_cents)}
                preselected={horario}
                loggedIn={Boolean(session)}
              />
            ) : (
              <p className="text-grafite-suave">
                A agenda online deste profissional ainda está sendo ativada. Volte em breve.
              </p>
            )}
          </div>
        </aside>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: p.full_name,
          jobTitle: 'Psicóloga(o)',
          url: absoluteUrl(`/psicologos/${slug}`),
          ...(photo && { image: photo }),
        }}
      />
    </div>
  )
}
