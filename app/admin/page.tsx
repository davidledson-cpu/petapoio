import Link from 'next/link'
import { PanelHeader, Stat } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { money } from '@/lib/format'
import { isSplitConfigured, isMercadoPagoConfigured } from '@/lib/env'

export default async function AdminPage() {
  await requireSession(['admin'], '/admin')
  const supabase = await createClient()
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(3, 0, 0, 0)

  const count = (q: PromiseLike<{ count: number | null }>) => q.then((r) => r.count ?? 0)
  const [pending, approved, users, paidSessions, paidOrders, newOrders, signups] = await Promise.all([
    count(supabase.from('psychologists').select('*', { count: 'exact', head: true }).eq('status', 'pendente')),
    count(supabase.from('psychologists').select('*', { count: 'exact', head: true }).eq('status', 'aprovado')),
    count(supabase.from('profiles').select('*', { count: 'exact', head: true })),
    supabase.from('appointments').select('price_cents, platform_fee_cents').in('status', ['confirmado', 'concluido', 'nao_compareceu']).gte('paid_at', monthStart.toISOString()),
    supabase.from('orders').select('total_cents').in('status', ['pago', 'em_producao', 'enviado', 'entregue']).gte('paid_at', monthStart.toISOString()),
    count(supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pago')),
    count(supabase.from('interest_signups').select('*', { count: 'exact', head: true })),
  ])
  const sessions = paidSessions.data ?? []
  const gross = sessions.reduce((n, s) => n + s.price_cents, 0)
  const fees = sessions.reduce((n, s) => n + s.platform_fee_cents, 0)
  const store = (paidOrders.data ?? []).reduce((n, o) => n + o.total_cents, 0)

  const pendencias = [
    pending > 0 && { href: '/admin/psicologos?status=pendente', text: `${pending} ${pending === 1 ? 'psicólogo aguarda' : 'psicólogos aguardam'} aprovação` },
    newOrders > 0 && { href: '/admin/pedidos?status=pago', text: `${newOrders} ${newOrders === 1 ? 'pedido pago aguarda' : 'pedidos pagos aguardam'} produção` },
    !isMercadoPagoConfigured() && { href: '/admin/configuracoes', text: 'Pagamentos da loja ainda não configurados (MP_ACCESS_TOKEN)' },
    !isSplitConfigured() && { href: '/admin/configuracoes', text: 'Split das sessões ainda não configurado (aplicação Mercado Pago)' },
  ].filter(Boolean) as { href: string; text: string }[]

  return (
    <>
      <PanelHeader title="Visão geral" intro="Números do mês corrente." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Sessões pagas no mês" value={sessions.length} hint={`${money(gross)} em sessões`} />
        <Stat label="Comissão PetApoio no mês" value={money(fees)} />
        <Stat label="Vendas da loja no mês" value={money(store)} />
        <Stat label="Contas" value={users} hint={`${approved} psicólogos aprovados · ${signups} inscrições em listas`} />
      </div>
      <section className="mt-10" aria-labelledby="pendencias">
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
    </>
  )
}
