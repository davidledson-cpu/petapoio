import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/icon'
import { initials, LevelBadge } from '@/components/cuida/caregiver-card'
import { RequestForm } from '@/components/cuida/request-form'
import { careFeePercent, getCaregiver } from '@/lib/cuida'
import { getSession } from '@/lib/auth'
import { money } from '@/lib/format'
import { LEVELS, priceFor, SERVICES, SIZES, SPECIES } from '@/lib/cuida-shared'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getCaregiver((await params).slug)
  if (!c) return { title: 'Cuidador não encontrado' }
  return {
    title: `${c.full_name} · Cuidador em ${c.neighborhood}`,
    description: c.headline ?? `Cuidador verificado no bairro ${c.neighborhood}, ${c.city}.`,
    robots: c.demo ? { index: false } : undefined,
  }
}

export default async function CaregiverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = await getCaregiver(slug)
  if (!c || !c.slug) notFound()
  const [fee, session] = await Promise.all([careFeePercent(), getSession()])
  const canRequest = c.demo || Boolean(session)
  const facts = [
    c.has_yard && 'Casa com área externa',
    c.gives_medication && 'Dá medicação prescrita pelo veterinário',
    c.accepts_seniors && 'Aceita pets idosos',
    c.accepts_puppies && 'Aceita filhotes',
  ].filter(Boolean) as string[]

  return (
    <div className="container-page pb-16 pt-8 md:pt-12">
      <nav aria-label="Trilha" className="text-[0.95rem] text-grafite-suave">
        <Link href="/cuida" className="hover:underline">PetApoio Cuida</Link> <span aria-hidden="true">/</span> {c.neighborhood}
      </nav>

      {c.demo && (
        <p role="note" className="mt-5 rounded-xl bg-[#f3e8cf] px-4 py-3 text-[#6b4f12]">
          <strong>Demonstração:</strong> perfil de exemplo para mostrar como funciona. Nenhuma solicitação é enviada e nada é cobrado.
        </p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div>
          <header className="flex flex-wrap items-center gap-5">
            <span className="flex size-24 shrink-0 items-center justify-center rounded-3xl bg-salvia-funda font-serif text-4xl text-linho">
              {initials(c.full_name) || 'C'}
            </span>
            <div>
              <LevelBadge level={c.level} />
              <h1 className="mt-2 text-4xl md:text-5xl">{c.full_name}</h1>
              <p className="mt-1 flex items-center gap-1 text-grafite-suave">
                <Icon name="pin" className="size-4" /> {c.neighborhood}, {c.city} · atende em até {c.radius_km} km
              </p>
            </div>
          </header>
          {c.headline && <p className="mt-6 font-serif text-2xl leading-snug">{c.headline}</p>}

          <section className="mt-10" aria-labelledby="servicos">
            <h2 id="servicos" className="text-2xl">Serviços e preços</h2>
            <ul className="mt-4 divide-y divide-areia rounded-2xl border border-areia bg-white">
              {c.services.map((s) => (
                <li key={s} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <span>
                    <span className="block font-semibold">{SERVICES[s].label}</span>
                    <span className="text-[0.95rem] text-grafite-suave">{SERVICES[s].text}</span>
                  </span>
                  <span className="shrink-0 font-serif text-xl">
                    {money(priceFor(c, s))}<span className="font-sans text-sm text-grafite-suave"> / {SERVICES[s].unit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 grid gap-6 sm:grid-cols-2" aria-label="Detalhes">
            <div className="rounded-2xl bg-linho-escuro p-6">
              <h2 className="font-sans text-lg font-bold">Recebe</h2>
              <p className="mt-2 text-grafite-suave">{c.species.map((s) => SPECIES[s]).join(', ')} · porte {c.pet_sizes.map((s) => SIZES[s].toLowerCase()).join(', ')}</p>
              {facts.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {facts.map((f) => <li key={f} className="flex items-center gap-2"><Icon name="check" className="size-4 text-salvia-funda" />{f}</li>)}
                </ul>
              )}
            </div>
            <div className="rounded-2xl bg-linho-escuro p-6">
              <h2 className="font-sans text-lg font-bold">Nível {LEVELS[c.level].label.toLowerCase()}</h2>
              <p className="mt-2 text-grafite-suave">{LEVELS[c.level].requirement}</p>
              {c.qualifications && <p className="mt-3 text-[0.95rem]"><strong>Formação:</strong> {c.qualifications}</p>}
            </div>
          </section>

          {(c.bio || c.experience) && (
            <section className="mt-10" aria-labelledby="sobre">
              <h2 id="sobre" className="text-2xl">Sobre</h2>
              {c.bio && <p className="mt-3 whitespace-pre-line text-lg text-grafite-suave">{c.bio}</p>}
              {c.experience && c.experience !== c.bio && <p className="mt-3 whitespace-pre-line text-grafite-suave">{c.experience}</p>}
            </section>
          )}

          <section className="mt-10 rounded-2xl border border-areia p-6" aria-labelledby="limites">
            <h2 id="limites" className="font-sans text-lg font-bold">O que o cuidador não faz</h2>
            <p className="mt-2 text-grafite-suave">
              Cuidadores não são veterinários: não fazem diagnóstico, não prescrevem e não realizam procedimentos clínicos.
              Em caso de urgência, seguem o contato de emergência e a autorização que você deixar na reserva.
            </p>
          </section>
        </div>

        <aside className="rounded-[1.75rem] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(46,42,39,.6)] md:p-8 lg:sticky lg:top-24" aria-labelledby="solicitar">
          <h2 id="solicitar" className="text-2xl">Solicitar reserva</h2>
          <p className="mt-1 text-[0.95rem] text-grafite-suave">Você vê o total antes de enviar. Nenhuma cobrança agora.</p>
          <div className="mt-5">
            {canRequest ? (
              <RequestForm
                caregiver={{
                  id: c.id, slug: c.slug, services: c.services, species: c.species, pet_sizes: c.pet_sizes,
                  price_hosting_cents: c.price_hosting_cents, price_visit_cents: c.price_visit_cents,
                  price_walk_cents: c.price_walk_cents, price_daycare_cents: c.price_daycare_cents,
                }}
                feePercent={fee}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-grafite-suave">Entre ou crie sua conta para enviar a solicitação e acompanhar a resposta.</p>
                <Link href={`/entrar?next=${encodeURIComponent(`/cuida/${c.slug}`)}`} className="btn btn-primario w-full">Entrar para solicitar</Link>
                <Link href={`/cadastro?next=${encodeURIComponent(`/cuida/${c.slug}`)}`} className="btn btn-secundario w-full">Criar conta</Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
