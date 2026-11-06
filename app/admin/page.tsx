import Link from 'next/link'
import { PanelHeader, Stat } from '@/components/panel-shell'
import { Icon, type IconName } from '@/components/icon'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { money } from '@/lib/format'
import { isSplitConfigured, isMercadoPagoConfigured } from '@/lib/env'

type Metric = { label: string; value: React.ReactNode; hint?: string }

function Vertical({ icon, name, role, href, metrics, tone }: {
  icon: IconName
  name: string
  role: string
  href: string
  metrics: Metric[]
  tone: string
}) {
  return (
    <section className="flex flex-col rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)]" aria-label={name}>
      <header className="flex items-center gap-3">
        <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}><Icon name={icon} className="size-6" /></span>
        <div>
          <h2 className="font-sans text-lg font-bold leading-tight">{name}</h2>
          <p className="text-sm text-grafite-suave">{role}</p>
        </div>
      </header>
      <dl className="mt-5 grid flex-1 grid-cols-2 gap-x-4 gap-y-5">
        {metrics.map((m) => (
          <div key={m.label}>
            <dt className="text-sm text-grafite-suave">{m.label}</dt>
            <dd className="mt-0.5 font-serif text-2xl leading-tight">{m.value}</dd>
            {m.hint && <dd className="text-xs text-grafite-suave">{m.hint}</dd>}
          </div>
        ))}
      </dl>
      <Link href={href} className="mt-6 font-semibold text-salvia-funda hover:underline">Abrir {name.split(' ').pop()}</Link>
    </section>
  )
}

function Goal({ label, value, target, note }: { label: string; value: number; target: number; note: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <li>
      <div className="flex flex-wrap justify-between gap-2 text-[0.95rem]">
        <span className="font-semibold">{label}</span>
        <span className="tabular-nums text-grafite-suave">{value} de {target}</span>
      </div>
      <div className="mt-1.5 h-2.5 rounded-full bg-linho-escuro" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-2.5 rounded-full bg-salvia-funda" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-grafite-suave">{note}</p>
    </li>
  )
}

export default async function AdminPage() {
  await requireSession(['admin'], '/admin')
  const supabase = await createClient()
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(3, 0, 0, 0)
  const since = monthStart.toISOString()

  const count = (q: PromiseLike<{ count: number | null }>) => q.then((r) => r.count ?? 0)
  const head = { count: 'exact' as const, head: true }
  const [
    pending, approved, users, paidSessions, paidOrders, newOrders, signups,
    cgPending, cgApproved, careOpen, careMonth, careDone, healthLeads, petStats, usage,
  ] = await Promise.all([
    count(supabase.from('psychologists').select('*', head).eq('status', 'pendente')),
    count(supabase.from('psychologists').select('*', head).eq('status', 'aprovado')),
    count(supabase.from('profiles').select('*', head)),
    supabase.from('appointments').select('price_cents, platform_fee_cents').in('status', ['confirmado', 'concluido', 'nao_compareceu']).gte('paid_at', since),
    supabase.from('orders').select('total_cents').in('status', ['pago', 'em_producao', 'enviado', 'entregue']).gte('paid_at', since),
    count(supabase.from('orders').select('*', head).eq('status', 'pago')),
    count(supabase.from('interest_signups').select('*', head)),
    count(supabase.from('caregivers').select('*', head).eq('status', 'pendente')),
    count(supabase.from('caregivers').select('*', head).eq('status', 'aprovado')),
    count(supabase.from('care_requests').select('*', head).in('status', ['nova', 'em_contato'])),
    supabase.from('care_requests').select('estimated_cents, fee_percent').in('status', ['confirmada', 'concluida']).gte('created_at', since),
    count(supabase.from('care_requests').select('*', head).in('status', ['confirmada', 'concluida'])),
    count(supabase.from('health_leads').select('*', head)),
    supabase.rpc('admin_pet_stats').maybeSingle<{ pets: number; owners: number; events: number; due_30d: number; overdue: number }>(),
    supabase.rpc('admin_vertical_usage').maybeSingle<{ acolhe: number; cuida: number; saude: number; multi: number; total: number }>(),
  ])

  const sessions = paidSessions.data ?? []
  const gross = sessions.reduce((n, s) => n + s.price_cents, 0)
  const sessionFees = sessions.reduce((n, s) => n + s.platform_fee_cents, 0)
  const store = (paidOrders.data ?? []).reduce((n, o) => n + o.total_cents, 0)
  const care = careMonth.data ?? []
  const careGmv = care.reduce((n, r) => n + r.estimated_cents, 0)
  const careFees = care.reduce((n, r) => n + Math.round((r.estimated_cents * Number(r.fee_percent)) / 100), 0)
  const pets = petStats.data
  const u = usage.data

  const pendencias = [
    careOpen > 0 && { href: '/admin/reservas', text: `${careOpen} ${careOpen === 1 ? 'solicitação do Cuida aguarda' : 'solicitações do Cuida aguardam'} confirmação com o cuidador` },
    cgPending > 0 && { href: '/admin/cuidadores?status=pendente', text: `${cgPending} ${cgPending === 1 ? 'cuidador aguarda' : 'cuidadores aguardam'} verificação` },
    pending > 0 && { href: '/admin/psicologos?status=pendente', text: `${pending} ${pending === 1 ? 'psicólogo aguarda' : 'psicólogos aguardam'} aprovação` },
    newOrders > 0 && { href: '/admin/pedidos?status=pago', text: `${newOrders} ${newOrders === 1 ? 'pedido pago aguarda' : 'pedidos pagos aguardam'} produção` },
    !isMercadoPagoConfigured() && { href: '/admin/configuracoes', text: 'Pagamentos da loja ainda não configurados (MP_ACCESS_TOKEN)' },
    !isSplitConfigured() && { href: '/admin/configuracoes', text: 'Split das sessões ainda não configurado (aplicação Mercado Pago)' },
  ].filter(Boolean) as { href: string; text: string }[]

  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date())

  return (
    <>
      <PanelHeader title="Visão geral" intro={`Ecossistema PetApoio em ${monthName}. Receita = o que fica com a PetApoio, não o volume total transacionado.`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Receita da plataforma no mês" value={money(sessionFees + careFees + store)} hint="comissões + vendas da loja" />
        <Stat label="Volume transacionado no mês" value={money(gross + careGmv + store)} hint="sessões, reservas e loja" />
        <Stat label="Contas" value={users} hint={`${signups} inscrições em listas`} />
        <Stat
          label="Usam mais de uma vertical"
          value={u && u.total ? `${Math.round((u.multi / u.total) * 100)}%` : '—'}
          hint={u ? `${u.multi} de ${u.total} tutores ativos` : undefined}
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Vertical
          icon="heart" name="PetApoio Acolhe" role="Propósito e confiança" href="/admin/psicologos" tone="bg-salvia-clara text-salvia-noite"
          metrics={[
            { label: 'Sessões pagas', value: sessions.length, hint: money(gross) },
            { label: 'Comissão', value: money(sessionFees) },
            { label: 'Psicólogos', value: approved, hint: `${pending} em análise` },
            { label: 'Loja no mês', value: money(store) },
          ]}
        />
        <Vertical
          icon="paw" name="PetApoio Cuida" role="Frequência e aquisição" href="/admin/reservas" tone="bg-nevoa-clara text-nevoa"
          metrics={[
            { label: 'Reservas no mês', value: care.length, hint: money(careGmv) },
            { label: 'Comissão estimada', value: money(careFees) },
            { label: 'Cuidadores', value: cgApproved, hint: `${cgPending} em verificação` },
            { label: 'Em aberto', value: careOpen, hint: 'aguardando confirmação' },
          ]}
        />
        <Vertical
          icon="plus" name="PetApoio Saúde" role="Recorrência e retenção" href="/admin/saude" tone="bg-[#f3e8cf] text-[#6b4f12]"
          metrics={[
            { label: 'Pets na carteira', value: pets?.pets ?? 0, hint: `${pets?.owners ?? 0} tutores` },
            { label: 'Lista do clube', value: healthLeads },
            { label: 'Lembretes em 30 dias', value: pets?.due_30d ?? 0 },
            { label: 'Parceiros de saúde', value: 0, hint: 'nenhum contrato ainda' },
          ]}
        />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="pendencias">
          <h2 id="pendencias" className="text-2xl">O que precisa de atenção</h2>
          {pendencias.length === 0 ? (
            <p className="mt-3 text-grafite-suave">Nada pendente agora.</p>
          ) : (
            <ul className="mt-4 divide-y divide-areia border-y border-areia">
              {pendencias.map((p) => (
                <li key={p.text} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  {p.text}
                  <Link href={p.href} className="link font-semibold">Resolver</Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-linho-escuro p-6" aria-labelledby="metas">
          <h2 id="metas" className="text-2xl">Metas da Fase 1 · validação</h2>
          <p className="mt-1 text-sm text-grafite-suave">Do plano de expansão (0 a 90 dias). Metas de operação, não previsões de receita.</p>
          <ul className="mt-5 space-y-5">
            <Goal label="Cuidadores aprovados na região-piloto" value={cgApproved} target={30} note="Rede mínima para testar oferta e procura." />
            <Goal label="Reservas acompanhadas" value={careDone} target={100} note="Confirmadas ou concluídas, com a equipe acompanhando." />
            <Goal label="Psicólogos com CRP conferido" value={approved} target={10} note="Meta sugerida para a rede inicial do Acolhe." />
            <Goal label="Pessoas na lista do Saúde" value={healthLeads} target={300} note="Meta sugerida: base para negociar com 2 ou 3 parceiros." />
          </ul>
        </section>
      </div>
    </>
  )
}
