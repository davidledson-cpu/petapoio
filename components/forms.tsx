'use client'

import Link from 'next/link'
import { useActionState, useId } from 'react'
import { subscribe } from '@/app/actions'
import { initialFormState } from '@/lib/form-state'
import { FieldError, FormStatus, Honeypot, submitWithoutReset } from './form-ui'

type SignupProps = {
  list: 'newsletter' | 'psicologos' | 'loja' | 'cuida' | 'saude'
  submitLabel: string
  tone?: 'claro' | 'escuro'
}

/** Inscrição por e-mail em uma das listas. */
export function SignupForm({ list, submitLabel, tone = 'claro' }: SignupProps) {
  const [state, action, pending] = useActionState(subscribe, initialFormState)
  const id = useId()
  const escuro = tone === 'escuro'

  if (state.status === 'success') return <FormStatus state={state} />

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="relative space-y-4">
      <Honeypot />
      <input type="hidden" name="list" value={list} />
      <div>
        <label htmlFor={`${id}-email`} className={`rotulo ${escuro ? 'text-linho' : ''}`}>
          Seu e-mail
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id={`${id}-email`}
            type="email"
            name="email"
            autoComplete="email"
            required
            className="campo sm:flex-1"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? `${id}-email-erro` : undefined}
          />
          <button
            type="submit"
            disabled={pending}
            className={`btn shrink-0 disabled:opacity-70 ${escuro ? 'bg-linho text-salvia-noite hover:bg-white' : 'btn-primario'}`}
          >
            {pending ? 'Enviando…' : submitLabel}
          </button>
        </div>
        <FieldError id={`${id}-email-erro`} message={state.fieldErrors?.email} />
      </div>
      <div>
        <label className={`flex items-start gap-3 text-[0.95rem] ${escuro ? 'text-linho/80' : 'text-grafite-suave'}`}>
          <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-salvia-funda" />
          <span>
            Li e aceito a{' '}
            <Link href="/privacidade" className={escuro ? 'text-linho underline underline-offset-4' : 'link'}>
              política de privacidade
            </Link>
            . Posso cancelar quando quiser.
          </span>
        </label>
        <FieldError id={`${id}-consent-erro`} message={state.fieldErrors?.consent} />
      </div>
      {state.status === 'error' && !state.fieldErrors && <FormStatus state={state} />}
    </form>
  )
}
