import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth-shell'
import { ResetRequestForm } from '@/components/auth-forms'

export const metadata: Metadata = { title: 'Recuperar senha', robots: { index: false } }

export default function RecuperarSenhaPage() {
  return (
    <AuthShell title="Recuperar senha" intro="Informe o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.">
      <ResetRequestForm />
    </AuthShell>
  )
}
