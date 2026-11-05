import type { FormState } from '@/lib/form-state'

export type CheckoutState = FormState & { redirectTo?: string }

export const initialCheckoutState: CheckoutState = { status: 'idle' }
