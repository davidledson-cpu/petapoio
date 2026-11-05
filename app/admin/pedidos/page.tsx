import Link from 'next/link'
import { EmptyState, PanelHeader } from '@/components/panel-shell'
import { OrderStatusBadge } from '@/components/loja/order-status-badge'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateOnly, money, ORDER_STATUS } from '@/lib/format'
import type { Order } from '@/types/db'

export default async function AdminPedidosPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireSession(['admin'], '/admin/pedidos')
  const { status } = await searchParams
  const filter = status && status in ORDER_STATUS ? status : undefined

  const supabase = await createClient()
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200)
  if (filter) query = query.eq('status', filter)
  const { data } = await query
  const orders = (data ?? []) as Order[]

  return (
    <>
      <PanelHeader title="Pedidos" intro="Pedidos da loja, do mais recente para o mais antigo." />
      <nav aria-label="Filtrar por status" className="mb-6">
        <ul className="flex flex-wrap gap-2">
          {[['', 'Todos'], ...Object.entries(ORDER_STATUS)].map(([v, l]) => {
            const current = (filter ?? '') === v
            return (
              <li key={v}>
                <Link
                  href={v ? `/admin/pedidos?status=${v}` : '/admin/pedidos'}
                  aria-current={current ? 'page' : undefined}
                  className={`inline-block rounded-full px-3.5 py-1.5 text-[0.95rem] ${current ? 'bg-salvia-funda text-linho' : 'bg-areia hover:bg-areia-escura'}`}
                >
                  {l}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {orders.length === 0 ? (
        <EmptyState title={filter ? 'Nenhum pedido com este status' : 'Nenhum pedido ainda'} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-[0.97rem]">
            <thead className="border-b border-areia-escura text-sm text-grafite-suave">
              <tr>
                <th className="py-2 pr-4 font-semibold">Pedido</th>
                <th className="py-2 pr-4 font-semibold">Cliente</th>
                <th className="py-2 pr-4 font-semibold">Data</th>
                <th className="py-2 pr-4 font-semibold">Total</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="py-3 pr-4"><Link href={`/admin/pedidos/${o.id}`} className="link font-semibold">{o.code}</Link></td>
                  <td className="py-3 pr-4">{o.full_name}<span className="block text-sm text-grafite-suave">{o.email}</span></td>
                  <td className="py-3 pr-4">{dateOnly(o.created_at)}</td>
                  <td className="py-3 pr-4">{money(o.total_cents)}</td>
                  <td className="py-3"><OrderStatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
