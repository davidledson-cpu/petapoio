import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth-shell'
import { NewPasswordForm } from '@/components/auth-forms'
import { requireSession } from '@/lib/auth'

export const metadata: Metadata = { title: 'Nova senha', robots: { index: false } }

export default async function NovaSenhaPage() {
  await requireSession(undefined, '/nova-senha')
  return (
    <AuthShell title="Criar nova senha">
      <NewPasswordForm />
    </AuthShell>
  )
}
