import type { Metadata } from 'next'
import Link from 'next/link'
import { loadOrderForTracking, ORDER_STEPS } from '@/lib/loja/orders'
import { payOrder } from '@/app/loja/actions'
import { isMercadoPagoConfigured } from '@/lib/env'
import { dateOnly, money, ORDER_STATUS } from '@/lib/format'
import { site } from '@/lib/site'

export const metadata: Metadata = { title: 'Acompanhar pedido', robots: { index: false } }

type Props = {
  params: Promise<{ code: string }>
  searchParams: Promise<{ ref?: string; status?: string; collection_status?: string; pagamento?: string }>
}

export default async function PedidoPage({ params, searchParams }: Props) {
  const { code } = await params
  const sp = await searchParams
  const order = await loadOrderForTracking(code.toUpperCase(), sp.ref)

  if (!order) {
    return (
      <div className="container-page max-w-2xl pt-16">
        <h1 className="text-4xl md:text-5xl">Não encontramos este pedido</h1>
        <p className="mt-4 text-lg text-grafite-suave">
          Use o link completo que enviamos por e-mail ou entre na sua conta para ver seus pedidos. Se precisar de ajuda,
          escreva para <a href={`mailto:${site.email}`} className="link">{site.email}</a> informando o código {code.toUpperCase()}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/entrar?next=/painel/pedidos`} className="btn btn-primario">Entrar na minha conta</Link>
          <Link href="/loja" className="btn btn-secundario">Voltar para a loja</Link>
        </div>
      </div>
    )
  }

  const waiting = order.status === 'aguardando_pagamento'
  const returnedApproved = waiting && (sp.status === 'approved' || sp.collection_status === 'approved')
  const currentIndex = ORDER_STEPS.findIndex((s) => s.status === order.status)
  const address = order.address

  return (
    <div className="container-page pt-12 md:pt-16">
      <p className="text-grafite-suave">Pedido {order.code} · {dateOnly(order.created_at)}</p>
      <h1 className="mt-2 text-[2.4rem] leading-tight md:text-5xl">
        {order.status === 'cancelado'
          ? 'Pedido cancelado'
          : returnedApproved
            ? 'Recebemos seu pagamento'
            : waiting
              ? 'Seu pedido foi registrado'
              : ORDER_STATUS[order.status]}
      </h1>

      <div className="mt-6 max-w-2xl space-y-4">
        {returnedApproved && (
          <p role="status" className="rounded-lg bg-salvia-clara px-4 py-3 text-salvia-noite">
            O Mercado Pago aprovou o pagamento. A confirmação chega aqui em alguns instantes e também por e-mail.
          </p>
        )}
        {sp.pagamento === 'erro' && (
          <p role="alert" className="rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta">
            Não conseguimos abrir o pagamento agora. Seu pedido está guardado: tente pagar de novo abaixo.
          </p>
        )}
        {waiting && !returnedApproved && (
          isMercadoPagoConfigured() ? (
            <form action={payOrder} className="rounded-2xl bg-linho-escuro p-6">
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="code" value={order.code} />
              <p className="text-grafite-suave">O pedido entra em produção assim que o pagamento for aprovado.</p>
              <button type="submit" className="btn btn-primario mt-4">Pagar {money(order.total_cents)} com Pix ou cartão</button>
            </form>
          ) : (
            <p className="rounded-2xl bg-linho-escuro p-6 text-grafite-suave">
              O pagamento online ainda não está ativo. Nossa equipe vai escrever para {order.email} com as instruções
              de pagamento. Guarde o código <strong className="text-grafite">{order.code}</strong>.
            </p>
          )
        )}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {order.status !== 'cancelado' && (
          <section aria-labelledby="etapas">
            <h2 id="etapas" className="text-2xl">Andamento</h2>
            <ol className="mt-6 space-y-0">
              {ORDER_STEPS.map((step, i) => {
                const done = i <= currentIndex
                return (
                  <li key={step.status} className="relative flex gap-4 pb-7 last:pb-0">
                    {i < ORDER_STEPS.length - 1 && (
                      <span aria-hidden="true" className={`absolute left-[0.6875rem] top-7 h-[calc(100%-1.5rem)] w-0.5 ${i < currentIndex ? 'bg-salvia-funda' : 'bg-areia-escura'}`} />
                    )}
                    <span
                      aria-hidden="true"
                      className={`relative mt-0.5 size-6 shrink-0 rounded-full border-2 ${done ? 'border-salvia-funda bg-salvia-funda' : 'border-areia-escura bg-linho'}`}
                    />
                    <div>
                      <p className={done ? 'font-semibold' : 'text-grafite-suave'}>
                        {step.label}
                        {i === currentIndex && <span className="sr-only"> (etapa atual)</span>}
                      </p>
                      {i === currentIndex && <p className="text-[0.95rem] text-grafite-suave">{step.text}</p>}
                      {step.status === 'enviado' && order.tracking_code && done && (
                        <p className="text-[0.95rem] text-grafite-suave">Código de rastreio: <strong className="text-grafite">{order.tracking_code}</strong></p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        )}

        <section aria-labelledby="itens" className="rounded-[1.5rem] bg-white p-6 shadow-[0_1px_0_var(--color-areia)] md:p-8">
          <h2 id="itens" className="text-2xl">Itens</h2>
          <ul className="mt-5 divide-y divide-areia">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-3">
                <span>
                  {item.quantity} × {item.product_name}
                  {item.personalization_name && <span className="block text-sm text-grafite-suave">Nome: {item.personalization_name}</span>}
                  {item.personalization_photo && <span className="block text-sm text-grafite-suave">Foto recebida</span>}
                </span>
                <span className="shrink-0">{money(item.unit_price_cents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-areia pt-4">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(order.subtotal_cents)}</dd></div>
            <div className="flex justify-between"><dt>Frete</dt><dd>{order.shipping_cents === 0 ? 'Grátis' : money(order.shipping_cents)}</dd></div>
            <div className="flex justify-between text-lg font-semibold"><dt>Total</dt><dd>{money(order.total_cents)}</dd></div>
          </dl>
          <div className="mt-6 border-t border-areia pt-4 text-[0.95rem] text-grafite-suave">
            <p className="font-semibold text-grafite">Entrega para {order.full_name}</p>
            <p>
              {address.street}, {address.number}
              {address.complement ? ` — ${address.complement}` : ''} · {address.district}
            </p>
            <p>{address.city}/{address.state} · CEP {address.cep}</p>
          </div>
        </section>
      </div>

      <p className="mt-12 text-grafite-suave">
        Dúvidas sobre o pedido? Escreva para <a href={`mailto:${site.email}`} className="link">{site.email}</a> com o código {order.code}.
      </p>
    </div>
  )
}
