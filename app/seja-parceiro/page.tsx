import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { PROFISSOES } from '@/lib/profissionais'

export const metadata: Metadata = {
  title: 'Para profissionais: psicólogos, cuidadores e adestradores',
  description:
    'Faça parte da rede PetApoio. Psicólogos atendem pessoas em luto pela perda de um pet; cuidadores e adestradores atendem tutores do bairro, com verificação e regras claras.',
  alternates: { canonical: '/seja-parceiro' },
}

export default function SejaParceiroPage() {
  return (
    <>
      <PageHeader
        title="Faça parte da rede PetApoio"
        intro="Psicólogos, cuidadores e adestradores que cuidam bem de quem ama um pet. Escolha seu perfil: cada cadastro pede só o que importa para o seu trabalho."
      />
      <nav aria-label="Escolha seu perfil profissional" className="container-page pb-20">
        <ul className="grid gap-4 md:grid-cols-3">
          {PROFISSOES.map((p) => (
            <li key={p.id}>
              <Link
                href={p.href}
                className="flex h-full flex-col rounded-2xl border-[1.5px] border-areia-escura bg-white p-6 transition-colors hover:border-salvia-funda"
              >
                <span className="text-sm font-semibold text-salvia-funda">{p.selo}</span>
                <span className="mt-1 font-serif text-2xl">{p.titulo}</span>
                <span className="mt-2 flex-1 text-grafite-suave">{p.resumo}</span>
                <span className="mt-4 text-[0.95rem] font-semibold">Ver cadastro →</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
