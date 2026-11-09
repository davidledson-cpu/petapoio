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
        intro="Psicólogos, cuidadores, adestradores, fornecedores e empresas que cuidam bem de quem ama um pet. Escolha seu perfil: cada cadastro pede só o que importa para o seu trabalho."
      />
      <nav aria-label="Escolha seu perfil profissional" className="container-page pb-12">
        <ul className="grid gap-4 md:grid-cols-3">
          {PROFISSOES.map((p) => (
            <li key={p.id}>
              <Link
                href={p.href}
                className="flex h-full flex-col rounded-2xl border-[1.5px] border-areia-escura bg-white p-6 transition-colors hover:border-laranja"
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

      <section id="empresas" className="container-page scroll-mt-24 pb-20" aria-labelledby="titulo-empresas">
        <div className="grid gap-8 rounded-[2rem] bg-[#fdf1e4] p-8 md:grid-cols-[1.3fr_1fr] md:items-center md:p-12">
          <div>
            <p className="font-semibold text-laranja">Fornecedores e empresas</p>
            <h2 id="titulo-empresas" className="mt-1 text-3xl md:text-4xl">Vamos cuidar juntos</h2>
            <p className="mt-3 text-lg text-grafite-suave">
              Fabricantes de produtos pet, clínicas, crematórios e funerárias, planos e seguros, empresas que querem
              oferecer benefício pet aos colaboradores. Conte como você quer participar e respondemos em até 5 dias úteis.
            </p>
            <ol className="mt-5 space-y-1 text-grafite-suave">
              <li>1. Conversa para entender a proposta</li>
              <li>2. Validação de documentos e homologação</li>
              <li>3. Piloto com acompanhamento e indicadores</li>
            </ol>
          </div>
          <a href="mailto:contato@petapoio.com.br?subject=Quero%20ser%20parceiro%20PetApoio" className="btn btn-primario justify-self-start md:justify-self-end">
            Quero ser parceiro PetApoio
          </a>
        </div>
      </section>
    </>
  )
}
