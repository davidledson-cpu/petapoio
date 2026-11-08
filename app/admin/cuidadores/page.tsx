import Link from 'next/link'
import { EmptyState, PanelHeader, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateOnly, PSYCH_STATUS } from '@/lib/format'
import { LEVELS, SERVICES } from '@/lib/cuida-shared'
import type { Caregiver } from '@/types/db'

const FILTERS = [
  ['pendente', 'Em análise'],
  ['aprovado', 'Aprovados'],
  ['recusado', 'Não aprovados'],
  ['suspenso', 'Suspensos'],
  ['todos', 'Todos'],
] as const

const TONE = { pendente: 'atencao', aprovado: 'ok', recusado: 'erro', suspenso: 'erro' } as const

export default async function AdminCuidadoresPage({ searchParams }: { searchParams: Promise<{ status?: string; erro?: string }> }) {
  await requireSession(['admin'], '/admin/cuidadores')
  const { status = 'pendente', erro } = await searchParams
  const supabase = await createClient()
  let q = supabase.from('caregivers').select('*').order('created_at', { ascending: false })
  if (status !== 'todos') q = q.eq('status', status)
  const { data } = await q.returns<Caregiver[]>()
  const { data: all } = await supabase.from('caregivers').select('status, level, neighborhood').returns<Pick<Caregiver, 'status' | 'level' | 'neighborhood'>[]>()
  const count = (s: string) => (s === 'todos' ? all?.length : all?.filter((c) => c.status === s).length) ?? 0

  const approved = (all ?? []).filter((c) => c.status === 'aprovado')
  const byHood = Object.entries(
    approved.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.neighborhood]: (acc[c.neighborhood] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1])

  return (
    <>
      <PanelHeader
        title="Cuidadores"
        intro="Confira identidade, referências e cursos antes de aprovar e definir o nível. Só aprovados aparecem na busca do Cuida."
        action={<Link href="/seja-parceiro/cuidadores" className="btn btn-secundario">Formulário de candidatura</Link>}
      />
      {erro && <p role="alert" className="mb-6 rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta">{erro}</p>}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(LEVELS).map(([k, l]) => (
          <div key={k} className="rounded-2xl bg-white p-5 shadow-[0_1px_0_var(--color-areia)]">
            <p className="text-sm text-grafite-suave">Aprovados · {l.label}</p>
            <p className="mt-1 font-serif text-3xl">{approved.filter((c) => c.level === k).length}</p>
          </div>
        ))}
      </div>
      {byHood.length > 0 && (
        <p className="mb-6 text-[0.95rem] text-grafite-suave">
          <strong className="text-grafite">Cobertura por bairro:</strong> {byHood.map(([h, n]) => `${h} (${n})`).join(' · ')}
        </p>
      )}

      <nav aria-label="Filtrar por status" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(([value, label]) => (
          <Link key={value} href={`/admin/cuidadores?status=${value}`} aria-current={status === value ? 'page' : undefined}
            className={`rounded-full px-4 py-1.5 text-[0.95rem] ${status === value ? 'bg-salvia-funda text-linho' : 'bg-areia hover:bg-areia-escura'}`}>
            {label} ({count(value)})
          </Link>
        ))}
      </nav>

      {data && data.length > 0 ? (
        <ul className="divide-y divide-areia border-y border-areia">
          {data.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/cuidadores/${c.id}`} className="grid gap-1 py-4 hover:bg-linho-escuro sm:grid-cols-[1.4fr_1.4fr_1fr_auto] sm:items-center sm:gap-4 sm:px-2">
                <span>
                  <span className="block font-semibold">{c.full_name}</span>
                  <span className="text-sm text-grafite-suave">{c.neighborhood} · até {c.radius_km} km</span>
                </span>
                <span className="text-[0.95rem] text-grafite-suave">{c.services.map((s) => SERVICES[s].short).join(', ')}</span>
                <span className="text-[0.95rem] text-grafite-suave">{LEVELS[c.level].label} · desde {dateOnly(c.created_at)}</span>
                <StatusBadge tone={TONE[c.status]}>{PSYCH_STATUS[c.status]}</StatusBadge>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Nenhum cuidador neste filtro">
          Divulgue o formulário de candidatura em grupos de bairro, pet shops e clínicas da região-piloto.
        </EmptyState>
      )}
    </>
  )
}
