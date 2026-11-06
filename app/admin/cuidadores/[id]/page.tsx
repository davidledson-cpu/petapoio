import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PanelHeader, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateOnly, money, PSYCH_STATUS } from '@/lib/format'
import { LEVELS, priceFor, SERVICES, SIZES, SPECIES } from '@/lib/cuida-shared'
import { reviewCaregiver } from '../actions'
import type { Caregiver } from '@/types/db'

const CHECKLIST = [
  'Documento com foto confere com o nome e a selfie',
  'Telefone e e-mail confirmados',
  'Endereço confere com o bairro informado',
  'Duas referências contatadas (verificado)',
  'Entrevista feita, regras da casa e rotina claras (verificado)',
  'Certificados de curso conferidos (qualificado)',
  'Fotos do espaço recebidas, se oferece hospedagem',
]

export default async function AdminCuidadorPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ erro?: string; ok?: string }>
}) {
  const { id } = await params
  const { erro, ok } = await searchParams
  await requireSession(['admin'], `/admin/cuidadores/${id}`)
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const supabase = await createClient()
  const { data: c } = await supabase.from('caregivers').select('*').eq('id', id).maybeSingle<Caregiver>()
  if (!c) notFound()
  const { count } = await supabase.from('care_requests').select('*', { count: 'exact', head: true }).eq('caregiver_id', id)

  return (
    <>
      <p className="mb-2 text-[0.95rem]"><Link href="/admin/cuidadores" className="link">Cuidadores</Link></p>
      <PanelHeader
        title={c.full_name}
        intro={<>{c.neighborhood}, {c.city} · candidatura em {dateOnly(c.created_at)} · {count ?? 0} solicitações</>}
        action={c.status === 'aprovado' && c.slug ? <Link href={`/cuida/${c.slug}`} className="btn btn-secundario">Ver perfil público</Link> : undefined}
      />
      {erro && <p role="alert" className="mb-6 rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta">{erro}</p>}
      {ok && <p role="status" className="mb-6 rounded-lg bg-salvia-clara px-4 py-3 text-salvia-noite">Revisão salva.</p>}

      <div className="grid gap-10 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section className="rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)]">
            <h2 className="font-sans text-lg font-bold">Contato (privado)</h2>
            <p className="mt-2"><a className="link" href={`mailto:${c.email}`}>{c.email}</a> · <a className="link" href={`tel:${c.phone}`}>{c.phone}</a></p>
            <p className="mt-1 text-sm text-grafite-suave">Nunca aparece no site. Use para a verificação e para combinar reservas.</p>
          </section>
          <section>
            <h2 className="text-2xl">Serviços e preços</h2>
            <ul className="mt-3 divide-y divide-areia border-y border-areia">
              {c.services.map((s) => (
                <li key={s} className="flex justify-between gap-3 py-3"><span>{SERVICES[s].label}</span><span>{money(priceFor(c, s))} / {SERVICES[s].unit}</span></li>
              ))}
            </ul>
            <p className="mt-3 text-[0.95rem] text-grafite-suave">
              {c.species.map((s) => SPECIES[s]).join(', ')} · porte {c.pet_sizes.map((s) => SIZES[s].toLowerCase()).join(', ')}
              {c.has_yard && ' · área externa'}{c.gives_medication && ' · dá medicação prescrita'}{c.accepts_seniors && ' · aceita idosos'}{c.accepts_puppies && ' · aceita filhotes'}
            </p>
          </section>
          <section>
            <h2 className="text-2xl">Apresentação</h2>
            {c.headline && <p className="mt-3 font-serif text-xl">{c.headline}</p>}
            <p className="mt-3 whitespace-pre-line text-grafite-suave">{c.experience}</p>
            {c.qualifications && <p className="mt-3"><strong>Formação declarada:</strong> {c.qualifications}</p>}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-linho-escuro p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-sans text-lg font-bold">Revisão</h2>
              <StatusBadge tone={c.status === 'aprovado' ? 'ok' : c.status === 'pendente' ? 'atencao' : 'erro'}>{PSYCH_STATUS[c.status]}</StatusBadge>
            </div>
            <ul className="mt-4 space-y-2 text-[0.95rem]">
              {CHECKLIST.map((i) => <li key={i} className="flex gap-2"><span aria-hidden="true">☐</span>{i}</li>)}
            </ul>
            <form action={reviewCaregiver} className="mt-6 space-y-4">
              <input type="hidden" name="id" value={c.id} />
              <div>
                <label htmlFor="level" className="rotulo">Nível</label>
                <select id="level" name="level" defaultValue={c.level} className="campo">
                  {Object.entries(LEVELS).map(([v, l]) => <option key={v} value={v}>{l.order}. {l.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="decision" className="rotulo">Decisão</label>
                <select id="decision" name="decision" defaultValue={c.status === 'pendente' ? 'aprovado' : c.status} className="campo">
                  <option value="aprovado">Aprovar e publicar</option>
                  <option value="pendente">Manter em análise</option>
                  <option value="recusado">Não aprovar</option>
                  <option value="suspenso">Suspender</option>
                </select>
              </div>
              <div>
                <label htmlFor="note" className="rotulo">Observação interna</label>
                <textarea id="note" name="note" rows={3} defaultValue={c.review_note ?? ''} className="campo" />
                <p className="dica">Obrigatória para recusar ou suspender.</p>
              </div>
              <button type="submit" className="btn btn-primario w-full">Salvar revisão</button>
            </form>
          </section>
        </aside>
      </div>
    </>
  )
}
