import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ProfessionalForm } from '@/components/forms'

export const metadata: Metadata = {
  title: 'Seja um psicólogo parceiro',
  description:
    'Faça o pré-cadastro para atender pessoas em luto pela perda de um animal pelo PetApoio. Perfis verificados, sem ranking pago.',
  alternates: { canonical: '/seja-parceiro' },
}

const beneficios = [
  ['Pessoas que procuram exatamente esse apoio', 'Quem chega ao PetApoio está buscando ajuda para atravessar a perda de um animal.'],
  ['Perfil profissional completo', 'Formação, abordagem, modalidade e faixa de valor, apresentados de forma clara e ética.'],
  ['Contato direto', 'A pessoa fala diretamente com você. Você combina a sessão do seu jeito.'],
  ['Regras claras', 'Sem compra de posição e sem depoimentos de pacientes, de acordo com o Código de Ética e as resoluções do CFP sobre publicidade.'],
]

const passos = [
  'Você envia o pré-cadastro abaixo.',
  'Conferimos seu registro no CRP e entramos em contato por e-mail.',
  'Você completa o perfil e envia os documentos de verificação.',
  'Com tudo aprovado, seu perfil é publicado.',
]

export default function SejaParceiroPage() {
  return (
    <>
      <PageHeader
        title="Seja um psicólogo parceiro"
        intro="Estamos formando o primeiro grupo de profissionais do PetApoio. O pré-cadastro é gratuito e não gera nenhum compromisso."
      />

      <section className="container-page grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl">Por que participar</h2>
            <dl className="mt-6 space-y-5">
              {beneficios.map(([titulo, texto]) => (
                <div key={titulo}>
                  <dt className="font-semibold">{titulo}</dt>
                  <dd className="mt-1 text-grafite-suave">{texto}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-3xl">Como funciona o cadastro</h2>
            <ol className="mt-6 space-y-4">
              {passos.map((p, i) => (
                <li key={p} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-salvia-clara font-semibold text-salvia-noite">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-grafite-suave">{p}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl bg-linho-escuro p-6 text-[0.97rem] text-grafite-suave">
            <p>
              <strong className="text-grafite">Modelo de participação:</strong> nesta fase, a participação é gratuita.
              Antes de qualquer cobrança, apresentaremos as condições por escrito, e você poderá decidir se continua.
            </p>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_1px_0_var(--color-areia),0_20px_40px_-30px_rgba(46,42,39,.35)] md:p-10">
          <ProfessionalForm />
        </div>
      </section>
    </>
  )
}
