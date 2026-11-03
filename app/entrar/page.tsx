import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth-shell'
import { SignInForm } from '@/components/auth-forms'
import { getSession, homeFor } from '@/lib/auth'

export const metadata: Metadata = { title: 'Entrar', robots: { index: false } }

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const { next, erro } = await searchParams
  const session = await getSession()
  if (session) redirect(homeFor(session.profile.role))
  return (
    <AuthShell
      title="Entrar"
      intro={
        <>
          Ainda não tem conta? <Link href={`/cadastro${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="link">Criar conta</Link>
          <br />
          É psicóloga ou psicólogo? <Link href="/seja-parceiro" className="link">Cadastre-se como profissional</Link>
        </>
      }
    >
      {erro === 'link' && (
        <p role="alert" className="mb-5 rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta">
          O link expirou ou já foi usado. Entre com sua senha ou peça um novo link.
        </p>
      )}
      <SignInForm next={next} />
    </AuthShell>
  )
}
