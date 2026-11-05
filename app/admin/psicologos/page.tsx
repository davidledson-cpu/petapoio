import Link from 'next/link'
import { EmptyState, PanelHeader, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateOnly, money, PSYCH_STATUS } from '@/lib/format'
import type { Psychologist } from '@/types/db'

type Row = Psychologist & { profile: { full_name: string } | null }

const FILTERS = [
  ['pendente', 'Em análise'],
  ['aprovado', 'Aprovados'],
  ['recusado', 'Não aprovados'],
  ['suspenso', 'Suspensos'],
  ['todos', 'Todos'],
] as const

const TONE = { pendente: 'atencao', aprovado: 'ok', recusado: 'erro', suspenso: 'erro' } as const

export default async function AdminPsicologosPage({ searchParams }: { searchParams: Promise<{ status?: string; erro?: string }> }) {
  await requireSession(['admin'], '/admin/psicologos')
  const { status = 'pendente', erro } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('psychologists')
    .select('*, profile:profiles!psychologists_id_fkey(full_name)')
    .order('created_at', { ascending: false })
  if (status !== 'todos') query = query.eq('status', status)
  const { data } = await query.returns<Row[]>()

  const { data: counts } = await supabase.from('psychologists').select('status').returns<{ status: string }[]>()
  const count = (s: string) => (s === 'todos' ? counts?.length : counts?.filter((c) => c.status === s).length) ?? 0

  return (
    <>
      <PanelHeader title="Psicólogos" intro="Confira o registro no CRP e o perfil antes de aprovar. Perfis aprovados aparecem no diretório." />
      {erro && <p role="alert" className="mb-6 rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta">{erro}</p>}

      <nav aria-label="Filtrar por status" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/psicologos?status=${value}`}
            aria-current={status === value ? 'page' : undefined}
            className={`rounded-full px-4 py-1.5 text-[0.95rem] ${status === value ? 'bg-salvia-funda text-linho' : 'bg-areia hover:bg-areia-escura'}`}
          >
            {label} ({count(value)})
          </Link>
        ))}
      </nav>

      {data && data.length > 0 ? (
        <ul className="divide-y divide-areia border-y border-areia">
          {data.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/psicologos/${p.id}`} className="grid gap-1 py-4 hover:bg-linho-escuro sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-center sm:gap-4 sm:px-2">
                <span>
                  <span className="block font-semibold">{p.profile?.full_name || 'Sem nome'}</span>
                  <span className="text-sm text-grafite-suave">CRP {p.crp}/{p.crp_state}</span>
                </span>
                <span className="text-[0.95rem] text-grafite-suave">
                  {p.document_path ? 'Documento enviado' : 'Sem documento'} · {p.mp_connected ? 'MP conectado' : 'MP pendente'}
                </span>
                <span className="text-[0.95rem] text-grafite-suave">
                  {money(p.session_price_cents)} · desde {dateOnly(p.created_at)}
                </span>
                <StatusBadge tone={TONE[p.status]}>{PSYCH_STATUS[p.status]}</StatusBadge>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Nenhum psicólogo neste filtro" />
      )}
    </>
  )
}
