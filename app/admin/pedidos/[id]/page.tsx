import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PanelHeader } from '@/components/panel-shell'
import { OrderStatusBadge } from '@/components/loja/order-status-badge'
import { OrderAdminForm } from '@/components/loja/order-admin-form'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { dateTime, money } from '@/lib/format'
import type { Order, OrderItem } from '@/types/db'

export default async function AdminPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireSession(['admin'], `/admin/pedidos/${id}`)
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound()

  const supabase = await createClient()
  const { data } = await supabase.from('orders').select('*, order_items(*)').eq('id', id).maybeSingle()
  if (!data) notFound()
  const order = data as Order & { order_items: OrderItem[] }

  // Fotos de personalização: bucket privado, links temporários de 1 hora.
  const photos = new Map<string, string>()
  const paths = order.order_items.map((i) => i.personalization_photo).filter((p): p is string => Boolean(p))
  if (paths.length > 0 && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: signed } = await createAdminClient().storage.from('order-uploads').createSignedUrls(paths, 3600)
    for (const s of signed ?? []) if (s.path && s.signedUrl) photos.set(s.path, s.signedUrl)
  }
  const a = order.address

  return (
    <>
      <PanelHeader
        title={`Pedido ${order.code}`}
        intro={
          <span className="flex flex-wrap items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <span>Feito em {dateTime(order.created_at)}</span>
            <Link href="/admin/pedidos" className="link">Voltar para pedidos</Link>
          </span>
        }
      />
      <div className="grid gap-10 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          <section aria-labelledby="itens">
            <h2 id="itens" className="text-2xl">Itens e personalização</h2>
            <ul className="mt-4 divide-y divide-areia border-y border-areia">
              {order.order_items.map((item) => {
                const photo = item.personalization_photo ? photos.get(item.personalization_photo) : undefined
                return (
                  <li key={item.id} className="flex flex-wrap gap-5 py-4">
                    {photo && (
                      <a href={photo} target="_blank" rel="noopener noreferrer" className="block size-28 overflow-hidden rounded-lg bg-areia" title="Abrir a foto enviada">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt={`Foto enviada para ${item.product_name}`} className="h-full w-full object-cover" />
                      </a>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{item.quantity} × {item.product_name}</p>
                      <p className="text-[0.95rem] text-grafite-suave">{money(item.unit_price_cents)} cada</p>
                      {item.personalization_name && <p className="mt-1">Nome para gravar: <strong>{item.personalization_name}</strong></p>}
                      {item.personalization_photo && !photo && (
                        <p className="mt-1 text-[0.95rem] text-alerta">Foto enviada, mas não foi possível gerar o link (verifique a chave service_role).</p>
                      )}
                      {photo && <a href={photo} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[0.95rem] link">Baixar foto em tamanho original</a>}
                    </div>
                  </li>
                )
              })}
            </ul>
            <dl className="mt-4 max-w-sm space-y-1.5">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(order.subtotal_cents)}</dd></div>
              <div className="flex justify-between"><dt>Frete</dt><dd>{money(order.shipping_cents)}</dd></div>
              <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{money(order.total_cents)}</dd></div>
            </dl>
          </section>

          <section aria-labelledby="entrega" className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 id="entrega" className="text-2xl">Entrega</h2>
              <p className="mt-3">{order.full_name}</p>
              <p className="text-grafite-suave">
                {a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ''}<br />
                {a.district} · {a.city}/{a.state}<br />CEP {a.cep}
              </p>
            </div>
            <div>
              <h2 className="text-2xl">Contato</h2>
              <p className="mt-3"><a href={`mailto:${order.email}`} className="link">{order.email}</a></p>
              {order.phone && <p className="text-grafite-suave">{order.phone}</p>}
              <p className="mt-3 text-sm text-grafite-suave">
                {order.mp_payment_id ? `Pagamento Mercado Pago nº ${order.mp_payment_id}` : 'Sem pagamento registrado no Mercado Pago'}
                {order.paid_at && ` · aprovado em ${dateTime(order.paid_at)}`}
              </p>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[1.5rem] bg-linho-escuro p-6 md:p-8" aria-labelledby="atualizar">
          <h2 id="atualizar" className="mb-5 text-2xl">Atualizar pedido</h2>
          <OrderAdminForm id={order.id} status={order.status} tracking={order.tracking_code} />
        </aside>
      </div>
    </>
  )
}
