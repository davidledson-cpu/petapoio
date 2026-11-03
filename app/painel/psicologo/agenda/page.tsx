import Link from 'next/link'
import { EmptyState, PanelHeader, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { APPOINTMENT_STATUS, dateTime, money, timeOnly } from '@/lib/format'
import { cancelByPsychologist, finishSession } from './actions'
import type { Appointment } from '@/types/db'

type Row = Appointment & { patient: { full_name: string } | null }

const TONE: Record<string, 'ok' | 'atencao' | 'erro' | 'neutro'> = {
  confirmado: 'ok',
  concluido: 'neutro',
  aguardando_pagamento: 'atencao',
  cancelado: 'erro',
  nao_compareceu: 'erro',
  expirado: 'neutro',
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string; aviso?: string }>
}) {
  const session = await requireSession(['psicologo'], '/painel/psicologo/agenda')
  const { ok, erro, aviso } = await searchParams
  const supabase = await createClient()
  const now = new Date().toISOString()

  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase
      .from('appointments')
      .select('*, patient:profiles!appointments_patient_id_fkey(full_name)')
      .eq('psychologist_id', session.userId)
      .in('status', ['confirmado', 'aguardando_pagamento'])
      .gte('ends_at', now)
      .order('starts_at')
      .returns<Row[]>(),
    supabase
      .from('appointments')
      .select('*, patient:profiles!appointments_patient_id_fkey(full_name)')
      .eq('psychologist_id', session.userId)
      .or(`ends_at.lt.${now},status.in.(cancelado,concluido,nao_compareceu)`)
      .not('status', 'in', '(expirado,aguardando_pagamento)')
      .order('starts_at', { ascending: false })
      .limit(40)
      .returns<Row[]>(),
  ])

  // Sessões confirmadas que já começaram e aguardam registro.
  const toRecord = (past ?? []).filter((a) => a.status === 'confirmado')
  const history = (past ?? []).filter((a) => a.status !== 'confirmado')

  return (
    <>
      <PanelHeader
        title="Agenda"
        intro="Suas sessões confirmadas e o histórico. O link da videochamada que o paciente recebe é o que está no seu perfil."
        action={<Link href="/painel/psicologo/horarios" className="btn btn-secundario">Editar horários</Link>}
      />

      {(ok || erro || aviso) && (
        <p
          role={erro || aviso ? 'alert' : 'status'}
          className={`mb-6 rounded-lg px-4 py-3 ${erro || aviso ? 'bg-[#f6e7e3] text-alerta' : 'bg-salvia-clara text-salvia-noite'}`}
        >
          {erro ?? aviso ?? ok}
        </p>
      )}

      {toRecord.length > 0 && (
        <section className="mb-10 rounded-2xl bg-[#f3e8cf] p-6">
          <h2 className="text-2xl">Registre como foram estas sessões</h2>
          <ul className="mt-4 divide-y divide-[#e4d4ad]">
            {toRecord.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>
                  <strong>{dateTime(a.starts_at)}</strong> · {a.patient?.full_name || 'Paciente'}
                </span>
                <span className="flex gap-2">
                  <form action={finishSession}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="status" value="concluido" />
                    <button type="submit" className="btn btn-primario !min-h-9 !py-1.5">Realizada</button>
                  </form>
                  <form action={finishSession}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="status" value="nao_compareceu" />
                    <button type="submit" className="btn btn-secundario !min-h-9 !py-1.5">Não compareceu</button>
                  </form>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-2xl">Próximas sessões</h2>
        {upcoming && upcoming.length > 0 ? (
          <ul className="space-y-3">
            {upcoming.map((a) => (
              <li key={a.id} className="grid gap-3 rounded-2xl bg-white p-5 shadow-[0_1px_0_var(--color-areia)] sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-serif text-xl">
                    {dateTime(a.starts_at)} – {timeOnly(a.ends_at)}
                  </p>
                  <p className="mt-1 text-grafite-suave">
                    {a.patient?.full_name || 'Paciente'} · {money(a.price_cents)} (líquido {money(a.price_cents - a.platform_fee_cents)})
                  </p>
                  <div className="mt-2">
                    <StatusBadge tone={TONE[a.status]}>{APPOINTMENT_STATUS[a.status]}</StatusBadge>
                  </div>
                </div>
                {a.status === 'confirmado' && (
                  <details className="group">
                    <summary className="btn btn-secundario cursor-pointer list-none">Cancelar sessão</summary>
                    <div className="mt-3 max-w-xs rounded-xl bg-linho-escuro p-4 text-[0.95rem]">
                      <p>O paciente recebe o valor integral de volta e é avisado do cancelamento.</p>
                      <form action={cancelByPsychologist} className="mt-3">
                        <input type="hidden" name="id" value={a.id} />
                        <button type="submit" className="btn bg-alerta text-linho hover:opacity-90">Confirmar cancelamento</button>
                      </form>
                    </div>
                  </details>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Nenhuma sessão marcada">
            Quando alguém agendar e o pagamento for aprovado, a sessão aparece aqui e você recebe uma notificação.
          </EmptyState>
        )}
      </section>

      {history.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl">Histórico</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-[0.97rem]">
              <thead className="text-sm text-grafite-suave">
                <tr className="border-b border-areia">
                  <th className="py-2 font-normal">Data</th>
                  <th className="py-2 font-normal">Paciente</th>
                  <th className="py-2 font-normal">Status</th>
                  <th className="py-2 text-right font-normal">Valor</th>
                  <th className="py-2 text-right font-normal">Comissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-areia">
                {history.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3">{dateTime(a.starts_at)}</td>
                    <td className="py-3">{a.patient?.full_name || 'Paciente'}</td>
                    <td className="py-3">
                      <StatusBadge tone={TONE[a.status]}>{APPOINTMENT_STATUS[a.status]}</StatusBadge>
                      {a.refunded_at && <span className="ml-2 text-sm text-grafite-suave">reembolsada</span>}
                    </td>
                    <td className="py-3 text-right">{money(a.price_cents)}</td>
                    <td className="py-3 text-right">{money(a.platform_fee_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  )
}
