import { PanelHeader, EmptyState, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { APPOINTMENT_STATUS, dateTime, money } from '@/lib/format'
import { adminCancelSession } from '../actions'
import type { Appointment } from '@/types/db'

export default async function AdminSessoesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  await requireSession(['admin'], '/admin/sessoes')
  const supabase = await createClient()
  let q = supabase.from('appointments').select('*').order('starts_at', { ascending: false }).limit(200)
  if (status && status in APPOINTMENT_STATUS) q = q.eq('status', status)
  const { data } = await q
  const rows = (data ?? []) as Appointment[]
  const ids = [...new Set(rows.flatMap((a) => [a.patient_id, a.psychologist_id]))]
  const { data: people } = ids.length ? await supabase.from('profiles').select('id, full_name').in('id', ids) : { data: [] }
  const name = (id: string) => (people ?? []).find((p) => p.id === id)?.full_name || '—'

  return (
    <>
      <PanelHeader title="Sessões" />
      <nav aria-label="Filtrar por status" className="mb-6 flex flex-wrap gap-2">
        {[['', 'Todas'], ...Object.entries(APPOINTMENT_STATUS)].map(([v, l]) => (
          <a key={v} href={v ? `?status=${v}` : '?'} aria-current={(status ?? '') === v ? 'page' : undefined}
            className={`rounded-full px-3 py-1.5 text-[0.95rem] ${(status ?? '') === v ? 'bg-salvia-funda text-linho' : 'bg-areia hover:bg-areia-escura'}`}>{l}</a>
        ))}
      </nav>
      {rows.length === 0 ? (
        <EmptyState title="Nenhuma sessão" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-[0.95rem]">
            <thead className="border-b border-areia-escura text-sm text-grafite-suave">
              <tr><th className="py-2 pr-4 font-semibold">Quando</th><th className="pr-4 font-semibold">Paciente</th><th className="pr-4 font-semibold">Psicólogo</th><th className="pr-4 font-semibold">Valor</th><th className="pr-4 font-semibold">Comissão</th><th className="pr-4 font-semibold">Status</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-areia">
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 pr-4 capitalize">{dateTime(a.starts_at)}</td>
                  <td className="pr-4">{name(a.patient_id)}</td>
                  <td className="pr-4">{name(a.psychologist_id)}</td>
                  <td className="pr-4">{money(a.price_cents)}</td>
                  <td className="pr-4">{money(a.platform_fee_cents)}</td>
                  <td className="pr-4"><StatusBadge tone={a.status === 'confirmado' || a.status === 'concluido' ? 'ok' : a.status === 'aguardando_pagamento' ? 'atencao' : 'neutro'}>{APPOINTMENT_STATUS[a.status]}</StatusBadge>{a.refunded_at && <span className="ml-2 text-sm text-grafite-suave">reembolsada</span>}</td>
                  <td className="text-right">
                    {['aguardando_pagamento', 'confirmado'].includes(a.status) && new Date(a.starts_at) > new Date() && (
                      <form action={adminCancelSession}><input type="hidden" name="id" value={a.id} /><button className="link text-sm">Cancelar</button></form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="dica mt-6">Reembolsos de sessões canceladas pela administração são feitos no painel do Mercado Pago do profissional.</p>
    </>
  )
}
