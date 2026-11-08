import Link from 'next/link'
import { EmptyState, PanelHeader, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateOnly, PSYCH_STATUS } from '@/lib/format'
import { SPECIES } from '@/lib/cuida-shared'
import { PRICE_KEYS, TRAINING_FOCUS, TRAINING_FORMATS, TRAINING_MODALITIES, TRAINING_YEARS } from '@/lib/adestra-shared'
import type { Trainer } from '@/types/db'
import { reviewTrainer } from './actions'

const FILTERS = [
  ['pendente', 'Em análise'],
  ['aprovado', 'Aprovados'],
  ['recusado', 'Não aprovados'],
  ['suspenso', 'Suspensos'],
  ['todos', 'Todos'],
] as const

const TONE = { pendente: 'atencao', aprovado: 'ok', recusado: 'erro', suspenso: 'erro' } as const
const money = (c: number | null) => (c == null ? '—' : `R$ ${(c / 100).toFixed(2).replace('.', ',')}`)

export default async function AdminAdestradoresPage({ searchParams }: { searchParams: Promise<{ status?: string; erro?: string; ok?: string }> }) {
  await requireSession(['admin'], '/admin/adestradores')
  const { status = 'pendente', erro, ok } = await searchParams
  const supabase = await createClient()
  let q = supabase.from('trainers').select('*').order('created_at', { ascending: false })
  if (status !== 'todos') q = q.eq('status', status)
  const { data } = await q.returns<Trainer[]>()
  const { data: all } = await supabase.from('trainers').select('status').returns<Pick<Trainer, 'status'>[]>()
  const count = (s: string) => (s === 'todos' ? all?.length : all?.filter((c) => c.status === s).length) ?? 0

  return (
    <>
      <PanelHeader
        title="Adestradores"
        intro="Confira identidade, referências, cursos e o compromisso com reforço positivo antes de aprovar."
        action={<Link href="/seja-parceiro/adestradores" className="btn btn-secundario">Formulário de cadastro</Link>}
      />
      {erro && <p role="alert" className="mb-6 rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta">{erro}</p>}
      {ok && <p role="status" className="mb-6 rounded-lg bg-salvia-clara px-4 py-3 text-salvia-noite">Análise salva.</p>}

      <nav aria-label="Filtrar por status" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(([value, label]) => (
          <Link key={value} href={`/admin/adestradores?status=${value}`} aria-current={status === value ? 'page' : undefined}
            className={`rounded-full px-4 py-1.5 text-[0.95rem] ${status === value ? 'bg-salvia-funda text-linho' : 'bg-areia hover:bg-areia-escura'}`}>
            {label} ({count(value)})
          </Link>
        ))}
      </nav>

      {data && data.length > 0 ? (
        <ul className="space-y-3">
          {data.map((t) => (
            <li key={t.id} id={`t-${t.id}`} className="scroll-mt-24">
              <details className="rounded-2xl bg-white p-5 shadow-[0_1px_0_var(--color-areia)]">
                <summary className="grid cursor-pointer list-none gap-1 sm:grid-cols-[1.4fr_1.6fr_auto] sm:items-center sm:gap-4">
                  <span>
                    <span className="block font-semibold">{t.full_name}</span>
                    <span className="text-sm text-grafite-suave">{t.neighborhood} · até {t.radius_km} km · desde {dateOnly(t.created_at)}</span>
                  </span>
                  <span className="text-[0.95rem] text-grafite-suave">{t.focus.map((f) => TRAINING_FOCUS[f]).join(', ')}</span>
                  <StatusBadge tone={TONE[t.status]}>{PSYCH_STATUS[t.status]}</StatusBadge>
                </summary>
                <div className="mt-5 grid gap-6 border-t border-areia pt-5 lg:grid-cols-[1.5fr_1fr]">
                  <dl className="grid gap-3 text-[0.95rem] sm:grid-cols-2">
                    <div><dt className="text-grafite-suave">Contato</dt><dd>{t.email}<br />{t.phone}</dd></div>
                    <div><dt className="text-grafite-suave">Experiência</dt><dd>{TRAINING_YEARS.find(([v]) => Number(v) === t.years_experience)?.[1]}</dd></div>
                    <div><dt className="text-grafite-suave">Onde atende</dt><dd>{t.modalities.map((m) => TRAINING_MODALITIES[m]).join(', ')}</dd></div>
                    <div><dt className="text-grafite-suave">Pets</dt><dd>{t.species.map((s) => SPECIES[s]).join(', ')}</dd></div>
                    <div className="sm:col-span-2">
                      <dt className="text-grafite-suave">Formatos e preços</dt>
                      <dd>
                        {t.formats.map((f) => `${TRAINING_FORMATS[f].label}: ${money(t[PRICE_KEYS[f]])}${f === 'pacote' && t.package_classes ? ` (${t.package_classes} aulas)` : ''}`).join(' · ')}
                      </dd>
                    </div>
                    {t.headline && <div className="sm:col-span-2"><dt className="text-grafite-suave">Apresentação</dt><dd>{t.headline}</dd></div>}
                    <div className="sm:col-span-2"><dt className="text-grafite-suave">Como trabalha</dt><dd className="whitespace-pre-line">{t.experience}</dd></div>
                    {t.qualifications && <div className="sm:col-span-2"><dt className="text-grafite-suave">Cursos e formação</dt><dd className="whitespace-pre-line">{t.qualifications}</dd></div>}
                    {t.reference_contacts && <div className="sm:col-span-2"><dt className="text-grafite-suave">Referências</dt><dd className="whitespace-pre-line">{t.reference_contacts}</dd></div>}
                    {t.portfolio_url && <div className="sm:col-span-2"><dt className="text-grafite-suave">Portfólio</dt><dd>{t.portfolio_url}</dd></div>}
                    <div className="sm:col-span-2"><dt className="text-grafite-suave">Reforço positivo</dt><dd>{t.positive_methods ? 'Declarou que não usa métodos aversivos' : 'Não declarou'}</dd></div>
                  </dl>
                  <form action={reviewTrainer} className="space-y-3">
                    <input type="hidden" name="id" value={t.id} />
                    <label className="rotulo" htmlFor={`d-${t.id}`}>Decisão</label>
                    <select id={`d-${t.id}`} name="decision" defaultValue={t.status} className="campo">
                      {Object.entries(PSYCH_STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <label className="rotulo" htmlFor={`n-${t.id}`}>Observação interna</label>
                    <textarea id={`n-${t.id}`} name="note" rows={3} maxLength={1000} defaultValue={t.review_note ?? ''} className="campo"
                      placeholder="Obrigatória para recusar ou suspender." />
                    <button type="submit" className="btn btn-primario">Salvar análise</button>
                  </form>
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Nenhum adestrador neste filtro.">Os cadastros feitos em Para adestradores aparecem aqui.</EmptyState>
      )}
    </>
  )
}
