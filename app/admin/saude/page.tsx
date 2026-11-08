import { PanelHeader, Stat, EmptyState } from '@/components/panel-shell'
import { PRODUCT_INTERESTS } from '@/lib/saude-planos'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateOnly } from '@/lib/format'
import { BUDGETS, INTERESTS } from '@/lib/saude'
import type { HealthLead } from '@/types/db'

const SPECIES: Record<string, string> = { cao: 'Cão', gato: 'Gato', outros: 'Outro' }
const AGES: Record<string, string> = { filhote: 'Filhote', adulto: 'Adulto', idoso: 'Idoso' }

function Bars({ title, data, total }: { title: string; data: [string, number][]; total: number }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)]">
      <h2 className="font-sans text-lg font-bold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {data.map(([label, n]) => {
          const pct = total ? Math.round((n / total) * 100) : 0
          return (
            <li key={label}>
              <div className="flex justify-between text-[0.95rem]"><span>{label}</span><span className="tabular-nums text-grafite-suave">{n} · {pct}%</span></div>
              <div className="mt-1 h-2 rounded-full bg-linho-escuro"><div className="h-2 rounded-full bg-salvia-funda" style={{ width: `${pct}%` }} /></div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default async function AdminSaudePage() {
  await requireSession(['admin'], '/admin/saude')
  const supabase = await createClient()
  const [{ data: leads }, { data: stats }] = await Promise.all([
    supabase.from('health_leads').select('*').order('consented_at', { ascending: false }).limit(2000).returns<HealthLead[]>(),
    supabase.rpc('admin_pet_stats').maybeSingle<{ pets: number; owners: number; events: number; due_30d: number; overdue: number }>(),
  ])
  const rows = leads ?? []
  const tally = (pick: (l: HealthLead) => string[]) =>
    rows.reduce<Record<string, number>>((acc, l) => {
      for (const k of pick(l)) acc[k] = (acc[k] ?? 0) + 1
      return acc
    }, {})
  const interests = tally((l) => l.interests)
  const products = tally((l) => l.products ?? [])
  const budgets = tally((l) => (l.budget ? [l.budget] : []))
  const species = tally((l) => [l.species])
  const ages = tally((l) => [l.pet_age])
  const cities = Object.entries(tally((l) => (l.city ? [l.city.trim()] : []))).sort((a, b) => b[1] - a[1]).slice(0, 8)

  return (
    <>
      <PanelHeader
        title="PetApoio Saúde"
        intro="Lista de espera dos planos Saúde, Protege e Despedida e uso da carteira digital. Use estes números na negociação com os parceiros white label."
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Pessoas na lista de espera" value={rows.length} />
        <Stat label="Pets na carteira digital" value={stats?.pets ?? 0} hint={`${stats?.owners ?? 0} tutores · ${stats?.events ?? 0} registros`} />
        <Stat label="Lembretes nos próximos 30 dias" value={stats?.due_30d ?? 0} hint="oportunidade de prevenção" />
        <Stat label="Lembretes vencidos" value={stats?.overdue ?? 0} />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="Ninguém na lista ainda">Divulgue a página /saude e o formulário da lista em conteúdos sobre prevenção e vacinação.</EmptyState>
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <Bars title="Produto de interesse" total={rows.length} data={PRODUCT_INTERESTS.map(([v, l]) => [l, products[v] ?? 0] as [string, number]).sort((a, b) => b[1] - a[1])} />
            <Bars title="O que mais importa" total={rows.length} data={INTERESTS.map(([v, l]) => [l, interests[v] ?? 0] as [string, number]).sort((a, b) => b[1] - a[1])} />
            <Bars title="Disposição a pagar por mês" total={rows.length} data={BUDGETS.map(([v, l]) => [l, budgets[v] ?? 0])} />
            <Bars title="Espécie" total={rows.length} data={Object.entries(SPECIES).map(([v, l]) => [l, species[v] ?? 0])} />
            <Bars title="Fase de vida" total={rows.length} data={Object.entries(AGES).map(([v, l]) => [l, ages[v] ?? 0])} />
          </div>
          {cities.length > 0 && (
            <p className="mt-6 text-[0.95rem] text-grafite-suave"><strong className="text-grafite">Cidades:</strong> {cities.map(([c, n]) => `${c} (${n})`).join(' · ')}</p>
          )}
          <section className="mt-10" aria-labelledby="recentes">
            <h2 id="recentes" className="text-2xl">Inscrições recentes</h2>
            <ul className="mt-4 divide-y divide-areia border-y border-areia">
              {rows.slice(0, 50).map((l) => (
                <li key={l.id} className="flex flex-wrap justify-between gap-3 py-3 text-[0.95rem]">
                  <span>{l.email}</span>
                  <span className="text-grafite-suave">{SPECIES[l.species]} {AGES[l.pet_age]?.toLowerCase()} · {l.city ?? 'cidade não informada'} · {dateOnly(l.consented_at)}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  )
}
