import Link from 'next/link'
import { EmptyState, PanelHeader, StatusBadge, Stat } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { money } from '@/lib/format'
import { shortDate } from '@/lib/saude'
import { CARE_REQUEST_STATUS, CARE_REQUEST_TONE, SERVICES, SIZES, SPECIES_ONE } from '@/lib/cuida-shared'
import { updateCareRequest } from '../cuidadores/actions'
import type { CareRequest } from '@/types/db'

type Row = CareRequest & {
  caregiver: { full_name: string; neighborhood: string; phone: string } | null
  tutor: { full_name: string; phone: string | null } | null
}

const FILTERS = [['abertas', 'Em aberto'], ['confirmada', 'Confirmadas'], ['concluida', 'Concluídas'], ['cancelada', 'Canceladas'], ['todas', 'Todas']] as const

export default async function AdminReservasPage({ searchParams }: { searchParams: Promise<{ status?: string; erro?: string; ok?: string }> }) {
  await requireSession(['admin'], '/admin/reservas')
  const { status = 'abertas', erro, ok } = await searchParams
  const supabase = await createClient()
  let q = supabase
    .from('care_requests')
    .select('*, caregiver:caregivers(full_name, neighborhood, phone), tutor:profiles!care_requests_tutor_id_fkey(full_name, phone)')
    .order('created_at', { ascending: false })
    .limit(300)
  if (status === 'abertas') q = q.in('status', ['nova', 'em_contato'])
  else if (status !== 'todas') q = q.eq('status', status)
  const { data } = await q.returns<Row[]>()

  const { data: all } = await supabase.from('care_requests').select('status, estimated_cents, fee_percent').returns<Pick<CareRequest, 'status' | 'estimated_cents' | 'fee_percent'>[]>()
  const rows = all ?? []
  const done = rows.filter((r) => r.status === 'confirmada' || r.status === 'concluida')
  const gmv = done.reduce((n, r) => n + r.estimated_cents, 0)
  const fee = done.reduce((n, r) => n + Math.round((r.estimated_cents * Number(r.fee_percent)) / 100), 0)
  const decided = rows.filter((r) => r.status !== 'nova' && r.status !== 'em_contato').length

  return (
    <>
      <PanelHeader title="Reservas do Cuida" intro="Piloto acompanhado: confirme a disponibilidade com o cuidador, combine endereço e regras, e atualize o status. O tutor é notificado." />
      {erro && <p role="alert" className="mb-6 rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta">{erro}</p>}
      {ok && <p role="status" className="mb-6 rounded-lg bg-salvia-clara px-4 py-3 text-salvia-noite">Reserva atualizada.</p>}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Em aberto" value={rows.filter((r) => r.status === 'nova' || r.status === 'em_contato').length} hint="aguardando resposta" />
        <Stat label="Confirmadas + concluídas" value={done.length} hint={decided ? `${Math.round((done.length / decided) * 100)}% das decididas` : undefined} />
        <Stat label="Volume transacionado" value={money(gmv)} hint="estimado, confirmadas e concluídas" />
        <Stat label="Comissão estimada" value={money(fee)} hint="receita da PetApoio" />
      </div>

      <nav aria-label="Filtrar" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(([v, l]) => (
          <Link key={v} href={`/admin/reservas?status=${v}`} aria-current={status === v ? 'page' : undefined}
            className={`rounded-full px-4 py-1.5 text-[0.95rem] ${status === v ? 'bg-salvia-funda text-linho' : 'bg-areia hover:bg-areia-escura'}`}>{l}</Link>
        ))}
      </nav>

      {data && data.length > 0 ? (
        <ul className="space-y-4">
          {data.map((r) => (
            <li key={r.id} id={`r-${r.id}`} className="scroll-mt-24 rounded-2xl bg-white p-5 shadow-[0_1px_0_var(--color-areia)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.code} · {SERVICES[r.service].short} · {shortDate(r.start_date)}{r.end_date !== r.start_date && <> a {shortDate(r.end_date)}</>}</p>
                  <p className="text-[0.95rem] text-grafite-suave">
                    {r.units} × {money(r.unit_cents)} = <strong className="text-grafite">{money(r.estimated_cents)}</strong> · comissão {Number(r.fee_percent)}% ({money(Math.round(r.estimated_cents * Number(r.fee_percent) / 100))})
                  </p>
                </div>
                <StatusBadge tone={CARE_REQUEST_TONE[r.status]}>{CARE_REQUEST_STATUS[r.status]}</StatusBadge>
              </div>
              <div className="mt-4 grid gap-4 text-[0.95rem] md:grid-cols-3">
                <p><span className="block text-sm text-grafite-suave">Tutor</span>{r.tutor?.full_name || '—'}{r.tutor?.phone && <> · <a className="link" href={`tel:${r.tutor.phone}`}>{r.tutor.phone}</a></>}</p>
                <p><span className="block text-sm text-grafite-suave">Cuidador</span>{r.caregiver?.full_name} ({r.caregiver?.neighborhood}){r.caregiver?.phone && <> · <a className="link" href={`tel:${r.caregiver.phone}`}>{r.caregiver.phone}</a></>}</p>
                <p><span className="block text-sm text-grafite-suave">Pet</span>{r.pet_name} · {SPECIES_ONE[r.species]} · {SIZES[r.pet_size].toLowerCase()}</p>
              </div>
              {(r.pet_notes || r.message) && (
                <div className="mt-3 rounded-xl bg-linho p-3 text-[0.95rem]">
                  {r.pet_notes && <p><strong>Rotina:</strong> {r.pet_notes}</p>}
                  {r.message && <p className="mt-1"><strong>Mensagem:</strong> {r.message}</p>}
                </div>
              )}
              <form action={updateCareRequest} className="mt-4 grid gap-3 sm:grid-cols-[12rem_1fr_auto] sm:items-end">
                <input type="hidden" name="id" value={r.id} />
                <div>
                  <label className="rotulo" htmlFor={`s-${r.id}`}>Status</label>
                  <select id={`s-${r.id}`} name="status" defaultValue={r.status} className="campo">
                    {Object.entries(CARE_REQUEST_STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="rotulo" htmlFor={`n-${r.id}`}>Mensagem ao tutor</label>
                  <input id={`n-${r.id}`} name="note" defaultValue={r.admin_note ?? ''} maxLength={1000} className="campo" placeholder="Aparece em Minhas reservas" />
                </div>
                <button type="submit" className="btn btn-primario">Atualizar</button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Nenhuma solicitação neste filtro" />
      )}
    </>
  )
}
