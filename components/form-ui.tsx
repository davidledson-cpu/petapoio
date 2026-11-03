'use client'

import { startTransition, type FormEvent, type ReactNode } from 'react'
import type { FormState } from '@/lib/form-state'

/**
 * Envia sem o reset automático do React 19, para que um erro de validação
 * não apague o que a pessoa já digitou. Sem JavaScript, o `action` do form continua funcionando.
 */
export function submitWithoutReset(action: (data: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    startTransition(() => action(data))
  }
}

export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Não preencha este campo
        <input type="text" name="website_confirm" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}

export function FormStatus({ state }: { state: FormState }) {
  if (state.status === 'idle' || !state.message) return null
  return (
    <p
      role={state.status === 'error' ? 'alert' : 'status'}
      className={
        state.status === 'success'
          ? 'rounded-lg bg-salvia-clara px-4 py-3 text-salvia-noite'
          : 'rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta'
      }
    >
      {state.message}
    </p>
  )
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-alerta">
      {message}
    </p>
  )
}

type FieldProps = {
  name: string
  label: ReactNode
  error?: string
  hint?: ReactNode
  optional?: boolean
  children?: (props: { id: string; name: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'name'>

/** Campo com rótulo, dica e erro já ligados por aria. Passe `children` para usar select/textarea. */
export function Field({ name, label, error, hint, optional, children, className, ...input }: FieldProps) {
  const id = `f-${name}`
  const describedBy = [error && `${id}-erro`, hint && `${id}-dica`].filter(Boolean).join(' ') || undefined
  const a11y = { id, name, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy }
  return (
    <div className={className}>
      <label htmlFor={id} className="rotulo">
        {label} {optional && <span className="font-normal text-grafite-suave">(opcional)</span>}
      </label>
      {children ? children(a11y) : <input {...a11y} {...input} className="campo" />}
      {hint && (
        <p id={`${id}-dica`} className="dica">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-erro`} message={error} />
    </div>
  )
}

export function SubmitButton({ pending, children, pendingLabel = 'Enviando…', className = '' }: {
  pending: boolean
  children: ReactNode
  pendingLabel?: string
  className?: string
}) {
  return (
    <button type="submit" disabled={pending} className={`btn btn-primario disabled:opacity-70 ${className}`}>
      {pending ? pendingLabel : children}
    </button>
  )
}
