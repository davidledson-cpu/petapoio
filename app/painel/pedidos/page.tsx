import Link from 'next/link'
import { EmptyState, PanelHeader } from '@/components/panel-shell'
import { OrderStatusBadge } from '@/components/loja/order-status-badge'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateOnly, money } from '@/lib/format'
import type { Order, OrderItem } from '@/types/db'

export default async function MeusPedidosPage() {
  await requireSession(undefined, '/painel/pedidos')
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(product_name, quantity)')
    .order('created_at', { ascending: false })
  const orders = (data ?? []) as (Order & { order_items: Pick<OrderItem, 'product_name' | 'quantity'>[] })[]

  return (
    <>
      <PanelHeader title="Meus pedidos" intro="Pedidos feitos com esta conta. Compras feitas sem entrar aparecem pelo link enviado por e-mail." />
      {orders.length === 0 ? (
        <EmptyState
          title="Você ainda não fez pedidos"
          action={<Link href="/loja" className="btn btn-primario">Ver a loja</Link>}
        >
          Na loja há lembranças e homenagens feitas sob encomenda, com o nome e a foto do seu companheiro.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-areia border-y border-areia">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/loja/pedido/${o.code}`} className="group grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                <div>
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="font-serif text-xl group-hover:text-salvia-funda">Pedido {o.code}</span>
                    <OrderStatusBadge status={o.status} />
                  </p>
                  <p className="mt-1 text-[0.95rem] text-grafite-suave">
                    {dateOnly(o.created_at)} · {o.order_items.map((i) => `${i.quantity} × ${i.product_name}`).join(', ')}
                  </p>
                </div>
                <p className="font-semibold">{money(o.total_cents)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
