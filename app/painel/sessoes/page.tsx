import Link from 'next/link'
import { PanelHeader, EmptyState, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { APPOINTMENT_STATUS, dateTime, money } from '@/lib/format'
import { payAppointment } from '@/app/psicologos/actions'
import { cancelMySession } from '../actions'
import type { Appointment } from '@/types/db'

const MESSAGES: Record<string, [string, 'ok' | 'erro']> = {
  cancelada: ['Sessão cancelada.', 'ok'],
  reembolso: ['Sessão cancelada. O reembolso foi solicitado ao Mercado Pago e aparece em até 7 dias úteis, conforme o meio de pagamento.', 'ok'],
  'sem-reembolso': ['Sessão cancelada. Como faltavam menos de 24 horas, o valor não é devolvido automaticamente. Se precisar, fale com a gente.', 'ok'],
  expirada: ['A reserva expirou. Escolha um novo horário.', 'erro'],
  pagamento: ['Não conseguimos abrir o pagamento agora. Tente de novo em alguns minutos.', 'erro'],
  reembolso_falhou: ['A sessão foi cancelada, mas o reembolso automático falhou. Escreva para contato@petapoio.com.br que resolvemos.', 'erro'],
}

/** Separa sessões futuras (ativas) do histórico. Fora do componente: depende do relógio. */
function splitByTime<T extends Appointment>(rows: T[]) {
  const now = Date.now()
  const upcoming = rows.filter((a) => new Date(a.ends_at).getTime() >= now && ['confirmado', 'aguardando_pagamento'].includes(a.status))
  return { upcoming, past: rows.filter((a) => !upcoming.includes(a)) }
}

type Row = Appointment & { psychologist: { slug: string | null; full_name: string; meeting_url: string | null } | null }

export default async function SessoesPage({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string; sessao?: string }> }) {
  const { ok, erro, sessao } = await searchParams
  const { userId } = await requireSession(undefined, '/painel/sessoes')
  const supabase = await createClient()
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', userId)
    .not('status', 'eq', 'expirado')
    .order('starts_at', { ascending: false })
  const appts = (data ?? []) as Appointment[]

  // Nome e link da sala: o diretório é público; o link só é lido para sessões confirmadas do próprio paciente.
  const ids = [...new Set(appts.map((a) => a.psychologist_id))]
  const { data: dir } = ids.length
    ? await supabase.from('psychologist_directory').select('id, slug, full_name').in('id', ids)
    : { data: [] }
  const { data: rooms } = await supabase.rpc('my_session_rooms')
  const roomFor = new Map(((rooms ?? []) as { appointment_id: string; meeting_url: string | null }[]).map((r) => [r.appointment_id, r.meeting_url]))
  const rows: Row[] = appts.map((a) => {
    const d = (dir ?? []).find((x) => x.id === a.psychologist_id)
    return { ...a, psychologist: d ? { slug: d.slug, full_name: d.full_name, meeting_url: roomFor.get(a.id) ?? null } : null }
  })

  const { upcoming, past } = splitByTime(rows)
  const flash = ok ? MESSAGES[ok] : erro ? (MESSAGES[erro === 'reembolso' ? 'reembolso_falhou' : erro] ?? [erro, 'erro']) : null
  const justPaid = sessao ? rows.find((a) => a.id === sessao) : undefined

  return (
    <>
      <PanelHeader title="Minhas sessões" action={<Link href="/psicologos" className="btn btn-primario">Agendar nova sessão</Link>} />

      {flash && (
        <p role={flash[1] === 'erro' ? 'alert' : 'status'} className={`mb-6 rounded-lg px-4 py-3 ${flash[1] === 'ok' ? 'bg-salvia-clara text-salvia-noite' : 'bg-[#f6e7e3] text-alerta'}`}>
          {flash[0]}
        </p>
      )}
      {justPaid && justPaid.status === 'aguardando_pagamento' && (
        <p role="status" className="mb-6 rounded-lg bg-[#f3e8cf] px-4 py-3 text-[#6b4f12]">
          Estamos aguardando a confirmação do pagamento. Pix costuma ser aprovado em segundos; atualize a página em instantes.
        </p>
      )}

      <section aria-labelledby="proximas">
        <h2 id="proximas" className="text-2xl">Próximas</h2>
        <div className="mt-4 space-y-4">
          {upcoming.length === 0 ? (
            <EmptyState title="Nenhuma sessão marcada" action={<Link href="/psicologos" className="btn btn-primario">Encontrar um psicólogo</Link>} />
          ) : (
            upcoming.map((a) => (
              <article key={a.id} className="rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-2xl capitalize">{dateTime(a.starts_at)}</p>
                    <p className="mt-1 text-grafite-suave">
                      com{' '}
                      {a.psychologist?.slug ? (
                        <Link href={`/psicologos/${a.psychologist.slug}`} className="link">{a.psychologist.full_name}</Link>
                      ) : (
                        a.psychologist?.full_name ?? 'profissional'
                      )}{' '}
                      · {money(a.price_cents)}
                    </p>
                  </div>
                  <StatusBadge tone={a.status === 'confirmado' ? 'ok' : 'atencao'}>{APPOINTMENT_STATUS[a.status]}</StatusBadge>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {a.status === 'aguardando_pagamento' && (
                    <form action={payAppointment.bind(null, a.id)}>
                      <button type="submit" className="btn btn-primario">Pagar agora</button>
                    </form>
                  )}
                  {a.status === 'confirmado' && a.psychologist?.meeting_url && (
                    <a href={a.psychologist.meeting_url} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
                      Entrar na sala da sessão
                    </a>
                  )}
                  {a.status === 'confirmado' && !a.psychologist?.meeting_url && (
                    <p className="text-grafite-suave">O profissional vai enviar o link da sala antes da sessão.</p>
                  )}
                  <form action={cancelMySession}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="btn btn-secundario">Cancelar sessão</button>
                  </form>
                </div>
                {a.status === 'aguardando_pagamento' && a.hold_expires_at && (
                  <p className="dica mt-3">Reserva válida até {dateTime(a.hold_expires_at)}.</p>
                )}
              </article>
            ))
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="mt-12" aria-labelledby="historico">
          <h2 id="historico" className="text-2xl">Histórico</h2>
          <ul className="mt-4 divide-y divide-areia border-y border-areia">
            {past.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <span>
                  <span className="capitalize">{dateTime(a.starts_at)}</span>
                  <span className="text-grafite-suave"> · {a.psychologist?.full_name ?? 'profissional'}</span>
                </span>
                <span className="flex items-center gap-3">
                  {a.refunded_at && <span className="text-sm text-grafite-suave">Reembolsada</span>}
                  <StatusBadge tone={a.status === 'concluido' ? 'ok' : 'neutro'}>{APPOINTMENT_STATUS[a.status]}</StatusBadge>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="dica mt-10">
        Cancelamentos com pelo menos 24 horas de antecedência têm o valor devolvido integralmente.
      </p>
    </>
  )
}
