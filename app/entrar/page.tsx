import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth-shell'
import { SignInForm } from '@/components/auth-forms'
import { getSession, homeFor } from '@/lib/auth'

export const metadata: Metadata = { title: 'Acessar', robots: { index: false } }

const PERFIS = {
  paciente: {
    rotulo: 'Sou paciente',
    titulo: 'Acesse sua conta',
    texto: 'Acompanhe suas sessões, pagamentos e pedidos da loja.',
    cadastro: { href: '/cadastro', label: 'Criar conta gratuita' },
  },
  psicologo: {
    rotulo: 'Sou psicólogo',
    titulo: 'Área do psicólogo',
    texto: 'Gerencie perfil, horários, agenda e recebimentos.',
    cadastro: { href: '/seja-parceiro#cadastro', label: 'Cadastrar como profissional' },
  },
  admin: {
    rotulo: 'Administração',
    titulo: 'Administração da PetApoio',
    texto: 'Aprovação de psicólogos, sessões, pedidos, produtos e usuários.',
    cadastro: null,
  },
} as const

type Perfil = keyof typeof PERFIS

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string; perfil?: string }>
}) {
  const { next, erro, perfil: raw } = await searchParams
  const session = await getSession()
  if (session) redirect(homeFor(session.profile.role))

  const perfil: Perfil = raw === 'psicologo' || raw === 'admin' ? raw : 'paciente'
  const p = PERFIS[perfil]

  return (
    <AuthShell
      title={p.titulo}
      intro={p.texto}
      aside={
        <>
          <p className="mt-6 font-serif text-3xl leading-snug">Um lugar para falar sobre quem fez parte da sua vida, no seu tempo.</p>
          <ul className="mt-8 space-y-3 text-linho/85">
            <li>Psicólogos com CRP conferido</li>
            <li>Sessões online, com pagamento seguro</li>
            <li>Seus dados protegidos e nunca vendidos</li>
          </ul>
        </>
      }
    >
      <nav aria-label="Tipo de acesso" className="mb-8">
        <ul className="grid grid-cols-3 gap-1 rounded-full bg-areia p-1 text-center text-[0.92rem] font-semibold">
          {(Object.keys(PERFIS) as Perfil[]).map((k) => (
            <li key={k}>
              <Link
                href={`/entrar?perfil=${k}${next ? `&next=${encodeURIComponent(next)}` : ''}`}
                aria-current={k === perfil ? 'page' : undefined}
                className={`block rounded-full px-2 py-2 ${k === perfil ? 'bg-white text-grafite shadow-sm' : 'text-grafite-suave hover:text-grafite'}`}
              >
                {PERFIS[k].rotulo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {erro === 'link' && (
        <p role="alert" className="mb-5 rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta">
          O link expirou ou já foi usado. Entre com sua senha ou peça um novo link.
        </p>
      )}

      <SignInForm next={next} />

      {p.cadastro && (
        <div className="mt-8 rounded-2xl border border-areia bg-white p-5">
          <p className="font-semibold">Ainda não tem conta?</p>
          <Link href={p.cadastro.href} className="btn btn-secundario mt-3 w-full">{p.cadastro.label}</Link>
        </div>
      )}
    </AuthShell>
  )
}
