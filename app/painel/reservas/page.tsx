import Link from 'next/link'
import { EmptyState, PanelHeader, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { money } from '@/lib/format'
import { shortDate } from '@/lib/saude'
import { CARE_REQUEST_STATUS, CARE_REQUEST_TONE, SERVICES } from '@/lib/cuida-shared'
import type { CareRequest } from '@/types/db'

export const metadata = { title: 'Minhas reservas' }


export default async function ReservasPage({ searchParams }: { searchParams: Promise<{ enviada?: string }> }) {
  const { enviada } = await searchParams
  const { userId } = await requireSession(undefined, '/painel/reservas')
  const supabase = await createClient()
  const { data } = await supabase
    .from('care_requests')
    .select('*')
    .eq('tutor_id', userId)
    .order('created_at', { ascending: false })
    .returns<CareRequest[]>()
  // O tutor não lê a tabela de cuidadores (tem contato); usa a vitrine pública.
  const ids = [...new Set((data ?? []).map((r) => r.caregiver_id))]
  const { data: cgs } = ids.length
    ? await supabase.from('caregiver_directory').select('id, full_name, neighborhood, slug').in('id', ids)
    : { data: [] as { id: string; full_name: string; neighborhood: string; slug: string }[] }
  const caregiver = new Map((cgs ?? []).map((c) => [c.id, c]))

  return (
    <>
      <PanelHeader title="Minhas reservas" intro="Solicitações do PetApoio Cuida. A equipe confirma cada uma com o cuidador." />
      {enviada && (
        <p role="status" className="mb-6 rounded-lg bg-salvia-clara px-4 py-3 text-salvia-noite">
          Solicitação enviada. Respondemos em até 1 dia útil e avisamos aqui e nas notificações.
        </p>
      )}
      {data && data.length > 0 ? (
        <ul className="divide-y divide-areia rounded-2xl bg-white shadow-[0_1px_0_var(--color-areia)]">
          {data.map((r) => (
            <li key={r.id} className="grid gap-2 p-5 sm:grid-cols-[1.5fr_1fr_auto] sm:items-center sm:gap-4">
              <div>
                <p className="font-semibold">{SERVICES[r.service].short} para {r.pet_name}</p>
                <p className="text-[0.95rem] text-grafite-suave">
                  {caregiver.get(r.caregiver_id)?.full_name ?? 'Cuidador'}
                  {caregiver.get(r.caregiver_id)?.neighborhood && <> · {caregiver.get(r.caregiver_id)?.neighborhood}</>} · pedido {r.code}
                </p>
              </div>
              <p className="text-[0.95rem]">
                {shortDate(r.start_date)}{r.end_date !== r.start_date && <> a {shortDate(r.end_date)}</>}
                <span className="block text-grafite-suave">{money(r.estimated_cents)} estimado</span>
              </p>
              <StatusBadge tone={CARE_REQUEST_TONE[r.status]}>{CARE_REQUEST_STATUS[r.status]}</StatusBadge>
              {r.admin_note && <p className="text-[0.95rem] text-grafite-suave sm:col-span-3">Equipe PetApoio: {r.admin_note}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Nenhuma reserva ainda" action={<Link href="/cuida" className="btn btn-primario">Encontrar um cuidador</Link>}>
          Precisa viajar ou de alguém para passear com seu pet? Veja cuidadores verificados perto de você.
        </EmptyState>
      )}
    </>
  )
}
