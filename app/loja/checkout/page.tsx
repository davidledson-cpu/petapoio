import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/loja/checkout-form'
import { getShippingSettings } from '@/lib/loja/catalog'
import { getSession } from '@/lib/auth'
import { isMercadoPagoConfigured } from '@/lib/env'

export const metadata: Metadata = { title: 'Entrega e pagamento', robots: { index: false } }

export default async function CheckoutPage() {
  const [shipping, session] = await Promise.all([getShippingSettings(), getSession()])
  return (
    <div className="container-page pt-12 md:pt-16">
      <h1 className="text-[2.4rem] leading-tight md:text-5xl">Entrega e pagamento</h1>
      <p className="mb-10 mt-3 text-lg text-grafite-suave">
        {session ? 'Seu pedido vai aparecer em "Meus pedidos".' : 'Não precisa criar conta: acompanhe o pedido pelo link que enviamos por e-mail.'}
      </p>
      <CheckoutForm
        shipping={shipping}
        paymentReady={isMercadoPagoConfigured()}
        defaults={{
          full_name: session?.profile.full_name ?? '',
          email: session?.email ?? '',
          phone: session?.profile.phone ?? '',
        }}
      />
    </div>
  )
}
