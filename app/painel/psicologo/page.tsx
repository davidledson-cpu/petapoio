import Link from 'next/link'
import { EmptyState, PanelHeader, Stat, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ensurePsychologistRow, profileChecklist } from '@/lib/psychologist'
import { dateTime, money, TZ } from '@/lib/format'
import type { Appointment } from '@/types/db'

export default async function PsicologoHomePage() {
  const session = await requireSession(['psicologo'], '/painel/psicologo')
  const psych = await ensurePsychologistRow(session)
  if (!psych) {
    return (
      <EmptyState title="Não conseguimos abrir seu perfil profissional">
        Tente recarregar a página. Se continuar, escreva para contato@petapoio.com.br.
      </EmptyState>
    )
  }

  const supabase = await createClient()
  const now = new Date()
  // Início do mês em São Paulo.
  const [y, m] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit' })
    .format(now)
    .split('-')
  const monthStart = new Date(`${y}-${m}-01T00:00:00-03:00`).toISOString()

  const [{ count: slots }, { data: upcoming }, { data: month }] = await Promise.all([
    supabase.from('availability').select('id', { count: 'exact', head: true }).eq('psychologist_id', psych.id),
    supabase
      .from('appointments')
      .select('*')
      .eq('psychologist_id', psych.id)
      .eq('status', 'confirmado')
      .gte('starts_at', now.toISOString())
      .order('starts_at')
      .limit(5)
      .returns<Appointment[]>(),
    supabase
      .from('appointments')
      .select('price_cents, platform_fee_cents, status')
      .eq('psychologist_id', psych.id)
      .in('status', ['confirmado', 'concluido', 'nao_compareceu'])
      .gte('starts_at', monthStart)
      .returns<Pick<Appointment, 'price_cents' | 'platform_fee_cents' | 'status'>[]>(),
  ])

  const checklist = profileChecklist(psych, (slots ?? 0) > 0)
  const pending = checklist.filter((c) => !c.done)
  const gross = (month ?? []).reduce((n, a) => n + a.price_cents, 0)
  const fee = (month ?? []).reduce((n, a) => n + a.platform_fee_cents, 0)

  const statusText = {
    pendente: pending.length
      ? 'Complete os itens abaixo. Assim que o documento for enviado, nossa equipe confere seu registro.'
      : 'Tudo enviado. Estamos conferindo seu registro no CRP; você recebe uma notificação quando o perfil for aprovado.',
    aprovado: psych.mp_connected
      ? 'Seu perfil está publicado e recebendo agendamentos.'
      : 'Seu perfil foi aprovado. Conecte o Mercado Pago para começar a receber agendamentos.',
    recusado: 'Seu cadastro não foi aprovado. Veja a observação da equipe e fale com a gente se tiver dúvidas.',
    suspenso: 'Seu perfil está suspenso e não aparece para pacientes. Fale com a equipe para entender os próximos passos.',
  }[psych.status]

  return (
    <>
      <PanelHeader
        title="Visão geral"
        action={
          psych.status === 'aprovado' && psych.slug ? (
            <Link href={`/psicologos/${psych.slug}`} className="btn btn-secundario">Ver meu perfil público</Link>
          ) : undefined
        }
      />

      <section className="rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)] md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl">Status do perfil</h2>
          <StatusBadge tone={psych.status === 'aprovado' ? 'ok' : psych.status === 'pendente' ? 'atencao' : 'erro'}>
            {{ pendente: 'Em análise', aprovado: 'Publicado', recusado: 'Não aprovado', suspenso: 'Suspenso' }[psych.status]}
          </StatusBadge>
        </div>
        <p className="mt-2 text-grafite-suave">{statusText}</p>
        {psych.review_note && psych.status !== 'aprovado' && (
          <p className="mt-3 rounded-lg bg-linho-escuro px-4 py-3 text-[0.97rem]">
            <strong>Observação da equipe:</strong> {psych.review_note}
          </p>
        )}
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {checklist.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-linho-escuro"
              >
                <span
                  aria-hidden="true"
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-sm ${
                    item.done ? 'bg-salvia-funda text-linho' : 'border-[1.5px] border-areia-escura'
                  }`}
                >
                  {item.done ? '✓' : ''}
                </span>
                <span className={item.done ? 'text-grafite-suave' : 'font-semibold'}>{item.label}</span>
                <span className="sr-only">{item.done ? '(concluído)' : '(pendente)'}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Números do mês">
        <Stat label="Sessões no mês" value={month?.length ?? 0} />
        <Stat label="Valor bruto" value={money(gross)} />
        <Stat label="Comissão PetApoio" value={money(fee)} />
        <Stat label="Seu líquido" value={money(gross - fee)} hint="Antes das taxas do Mercado Pago" />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-2xl">Próximas sessões</h2>
          <Link href="/painel/psicologo/agenda" className="link">Ver agenda completa</Link>
        </div>
        {upcoming && upcoming.length > 0 ? (
          <ul className="divide-y divide-areia border-y border-areia">
            {upcoming.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
                <span className="font-semibold">{dateTime(a.starts_at)}</span>
                <span className="text-grafite-suave">{money(a.price_cents - a.platform_fee_cents)} líquido</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Nenhuma sessão confirmada por enquanto">
            {psych.status === 'aprovado' && psych.mp_connected
              ? 'Mantenha seus horários atualizados para aparecer disponível para quem procura apoio.'
              : 'As sessões aparecem aqui depois que seu perfil for publicado.'}
          </EmptyState>
        )}
      </section>
    </>
  )
}
