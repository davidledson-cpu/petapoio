'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'
import { placeOrder } from '@/app/loja/actions'
import { useCart } from '@/lib/cart/store'
import { money } from '@/lib/format'
import { UFS } from '@/lib/ufs'
import { initialCheckoutState } from '@/lib/loja/checkout-state'
import { Field, FieldError, FormStatus, SubmitButton, submitWithoutReset } from '@/components/form-ui'
import { shippingCents } from './cart-view'

type Props = {
  shipping: { shipping_flat_cents: number; free_shipping_from_cents: number }
  defaults: { full_name: string; email: string; phone: string }
  paymentReady: boolean
}

export function CheckoutForm({ shipping, defaults, paymentReady }: Props) {
  const cart = useCart()
  const [state, action, pending] = useActionState(placeOrder, initialCheckoutState)
  const err = state.fieldErrors ?? {}
  const formRef = useRef<HTMLFormElement>(null)
  const [cepStatus, setCepStatus] = useState<string | null>(null)
  const [stateUf, setStateUf] = useState('')

  useEffect(() => {
    if (state.status === 'success' && state.redirectTo) {
      cart.clear()
      window.location.assign(state.redirectTo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  async function lookupCep(value: string) {
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 8) return
    setCepStatus('Buscando endereço…')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = (await res.json()) as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string }
      if (data.erro) throw new Error()
      const f = formRef.current
      if (!f) return
      const set = (name: string, v?: string) => {
        const el = f.elements.namedItem(name) as HTMLInputElement | null
        if (el && v && !el.value) el.value = v
      }
      set('street', data.logradouro)
      set('district', data.bairro)
      set('city', data.localidade)
      if (data.uf) setStateUf(data.uf)
      setCepStatus('Endereço encontrado. Confira e complete com o número.')
      ;(f.elements.namedItem('number') as HTMLInputElement | null)?.focus()
    } catch {
      setCepStatus('Não encontramos este CEP. Preencha o endereço abaixo.')
    }
  }

  if (cart.items.length === 0 && state.status !== 'success') {
    return (
      <div className="max-w-xl rounded-2xl border-[1.5px] border-dashed border-areia-escura p-8">
        <h2 className="text-2xl">Seu carrinho está vazio</h2>
        <Link href="/loja" className="btn btn-primario mt-6">Ver a loja</Link>
      </div>
    )
  }

  const ship = shippingCents(cart.subtotalCents, shipping)
  const items = JSON.stringify(
    cart.items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
      ...(i.personalizationName ? { name: i.personalizationName } : {}),
      ...(i.personalizationPhoto ? { photo: i.personalizationPhoto } : {}),
    })),
  )

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
      <form ref={formRef} action={action} onSubmit={submitWithoutReset(action)} className="space-y-8">
        <input type="hidden" name="items" value={items} />
        {state.status === 'error' && <FormStatus state={state} />}

        <fieldset className="space-y-5">
          <legend className="mb-4 font-serif text-2xl">Seus dados</legend>
          <Field name="full_name" label="Nome completo" autoComplete="name" defaultValue={defaults.full_name} required error={err.full_name} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="email" label="E-mail" type="email" autoComplete="email" defaultValue={defaults.email} required error={err.email} hint="Enviamos a confirmação e a prévia por aqui." />
            <Field name="phone" label="Telefone" type="tel" autoComplete="tel" defaultValue={defaults.phone} optional error={err.phone} />
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="mb-4 font-serif text-2xl">Endereço de entrega</legend>
          <p className="-mt-2 text-[0.95rem] text-grafite-suave">Vai presentear alguém? Coloque o endereço da pessoa.</p>
          <Field
            name="cep"
            label="CEP"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            required
            error={err.cep}
            className="sm:max-w-xs"
            onBlur={(e) => void lookupCep(e.currentTarget.value)}
            hint={<span aria-live="polite">{cepStatus ?? 'Preenchemos o endereço a partir do CEP.'}</span>}
          />
          <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
            <Field name="street" label="Rua" autoComplete="address-line1" required error={err.street} />
            <Field name="number" label="Número" required error={err.number} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="complement" label="Complemento" autoComplete="address-line2" optional error={err.complement} />
            <Field name="district" label="Bairro" required error={err.district} />
          </div>
          <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
            <Field name="city" label="Cidade" autoComplete="address-level2" required error={err.city} />
            <Field name="state" label="Estado" error={err.state}>
              {(a11y) => (
                <select {...a11y} value={stateUf} onChange={(e) => setStateUf(e.target.value)} required className="campo">
                  <option value="" disabled>UF</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        </fieldset>

        <div>
          <label className="flex items-start gap-3 text-[0.95rem] text-grafite-suave">
            <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-salvia-funda" />
            <span>
              Li e aceito os <Link href="/termos" className="link">termos de uso</Link> e a{' '}
              <Link href="/privacidade" className="link">política de privacidade</Link>.
            </span>
          </label>
          <FieldError id="f-consent-erro" message={err.consent} />
        </div>

        <div>
          <SubmitButton pending={pending || state.status === 'success'} pendingLabel="Registrando pedido…" className="w-full sm:w-auto">
            {paymentReady ? `Ir para o pagamento · ${money(cart.subtotalCents + ship)}` : 'Registrar pedido'}
          </SubmitButton>
          <p className="dica mt-3">
            {paymentReady
              ? 'Você vai para o Mercado Pago para pagar com Pix ou cartão em até 6x, com segurança.'
              : 'O pagamento online ainda não está ativo. Registramos o pedido e entramos em contato por e-mail para combinar o pagamento.'}
          </p>
        </div>
      </form>

      <aside className="h-fit rounded-[1.5rem] bg-linho-escuro p-6 md:p-8" aria-labelledby="resumo-pedido">
        <h2 id="resumo-pedido" className="text-2xl">Seu pedido</h2>
        <ul className="mt-5 space-y-3">
          {cart.items.map((i) => (
            <li key={i.key} className="flex justify-between gap-4 text-[0.97rem]">
              <span>
                {i.quantity} × {i.name}
                {i.personalizationName && <span className="block text-sm text-grafite-suave">Nome: {i.personalizationName}</span>}
              </span>
              <span className="shrink-0">{money(i.priceCents * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-areia-escura pt-4">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(cart.subtotalCents)}</dd></div>
          <div className="flex justify-between"><dt>Frete</dt><dd>{ship === 0 ? 'Grátis' : money(ship)}</dd></div>
          <div className="flex justify-between text-lg font-semibold"><dt>Total</dt><dd>{money(cart.subtotalCents + ship)}</dd></div>
        </dl>
        <Link href="/loja/carrinho" className="mt-5 block text-[0.95rem] link">Alterar o carrinho</Link>
      </aside>
    </div>
  )
}
