import type { z } from 'zod'

export type FormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Record<string, string>
}

export const initialFormState: FormState = { status: 'idle' }

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    out[key] ??= issue.message
  }
  return out
}

export function invalid(error: z.ZodError, message = 'Revise os campos destacados.'): FormState {
  return { status: 'error', message, fieldErrors: fieldErrors(error) }
}

export const NOT_CONFIGURED: FormState = {
  status: 'error',
  message:
    'Este recurso ainda não está ativo neste ambiente. Escreva para contato@petapoio.com.br enquanto finalizamos a configuração.',
}

export function fail(message: string): FormState {
  return { status: 'error', message }
}
