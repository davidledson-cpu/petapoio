import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/components/auth-shell'
import { SignUpForm } from '@/components/auth-forms'

export const metadata: Metadata = {
  title: 'Criar conta',
  description: 'Crie sua conta gratuita para agendar sessões com psicólogos e acompanhar seus pedidos.',
}

export default async function CadastroPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  return (
    <AuthShell
      title="Criar sua conta"
      intro={
        <>
          É gratuito e leva um minuto. Com a conta você agenda sessões e acompanha seus pedidos.{' '}
          Já tem conta? <Link href={`/entrar${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="link">Entrar</Link>
        </>
      }
    >
      <SignUpForm next={next} />
    </AuthShell>
  )
}
