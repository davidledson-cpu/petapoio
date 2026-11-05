import { PanelHeader, EmptyState } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateOnly } from '@/lib/format'

const LISTS: Record<string, string> = { newsletter: 'Textos de acolhimento', psicologos: 'Aviso de psicólogos', loja: 'Aviso da loja' }

export default async function InscricoesPage({ searchParams }: { searchParams: Promise<{ lista?: string }> }) {
  const { lista } = await searchParams
  await requireSession(['admin'], '/admin/inscricoes')
  const supabase = await createClient()
  let q = supabase.from('interest_signups').select('id, email, list, consented_at').order('consented_at', { ascending: false }).limit(500)
  if (lista && lista in LISTS) q = q.eq('list', lista)
  const { data } = await q
  const rows = data ?? []
  return (
    <>
      <PanelHeader title="Inscrições em listas" intro="Pessoas que pediram para receber e-mails. Use só para o que cada uma pediu." />
      <nav aria-label="Filtrar por lista" className="mb-6 flex flex-wrap gap-2">
        {[['', 'Todas'], ...Object.entries(LISTS)].map(([v, l]) => (
          <a key={v} href={v ? `?lista=${v}` : '?'} aria-current={(lista ?? '') === v ? 'page' : undefined}
            className={`rounded-full px-3 py-1.5 text-[0.95rem] ${(lista ?? '') === v ? 'bg-salvia-funda text-linho' : 'bg-areia hover:bg-areia-escura'}`}>{l}</a>
        ))}
      </nav>
      {rows.length === 0 ? <EmptyState title="Nenhuma inscrição ainda" /> : (
        <ul className="divide-y divide-areia border-y border-areia">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap justify-between gap-3 py-3">
              <span>{r.email}</span>
              <span className="text-sm text-grafite-suave">{LISTS[r.list]} · {dateOnly(r.consented_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
