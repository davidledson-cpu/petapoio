import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { SignupForm } from '@/components/forms'

export const metadata: Metadata = {
  title: 'Psicólogos com experiência em luto',
  description:
    'Como o PetApoio vai conectar você a psicólogas e psicólogos com experiência em luto pet, com registro no CRP conferido.',
  alternates: { canonical: '/psicologos' },
}

const compromissos = [
  {
    titulo: 'Registro conferido',
    texto: 'Antes de publicar um perfil, verificamos o número e a situação do registro no Conselho Regional de Psicologia.',
  },
  {
    titulo: 'Experiência com luto',
    texto: 'Cada perfil informa a formação e a experiência do profissional com luto e com a perda de animais.',
  },
  {
    titulo: 'Sem ranking pago',
    texto: 'A ordem dos perfis não pode ser comprada. Não publicamos depoimentos de pacientes, seguindo as orientações do CFP.',
  },
  {
    titulo: 'Escolha sua',
    texto: 'Você poderá filtrar por atendimento online ou presencial, cidade, abordagem e faixa de valor, e falar direto com quem escolher.',
  },
]

export default function PsicologosPage() {
  return (
    <>
      <PageHeader
        title="Conversar com alguém que entende essa perda"
        intro="Estamos reunindo psicólogas e psicólogos com experiência em luto. Os primeiros perfis verificados entram no ar nas próximas semanas."
      />

      <section className="container-page grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-3xl md:text-4xl">Como vai funcionar</h2>
          <dl className="mt-8 divide-y divide-areia border-y border-areia">
            {compromissos.map((c) => (
              <div key={c.titulo} className="grid gap-2 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <dt className="font-serif text-xl">{c.titulo}</dt>
                <dd className="text-grafite-suave">{c.texto}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="h-fit rounded-[1.75rem] bg-areia/70 p-7 md:p-9">
          <h2 className="text-2xl md:text-3xl">Avisaremos quando estiver pronto</h2>
          <p className="mt-3 text-grafite-suave">
            Deixe seu e-mail e você recebe uma mensagem assim que for possível escolher um profissional por aqui. Só
            isso.
          </p>
          <div className="mt-6">
            <SignupForm list="psicologos" submitLabel="Avise-me" />
          </div>
        </aside>
      </section>

      <section className="container-page mt-16">
        <div className="rounded-[1.75rem] bg-linho-escuro p-7 md:p-10">
          <h2 className="text-2xl md:text-3xl">Precisa de apoio antes disso?</h2>
          <p className="mt-3 max-w-[64ch] text-grafite-suave">
            Pelo SUS, a Unidade Básica de Saúde do seu bairro pode orientar e encaminhar para atendimento psicológico.
            Muitas faculdades de psicologia também oferecem atendimento gratuito ou a preço social em suas clínicas-escola.
            Se estiver difícil demais agora, veja a{' '}
            <Link href="/ajuda-imediata" className="link">página de ajuda imediata</Link>.
          </p>
        </div>
      </section>

      <section className="container-page mt-16 border-t border-areia pt-12">
        <p className="text-lg">
          É psicóloga ou psicólogo?{' '}
          <Link href="/seja-parceiro" className="link font-semibold">Faça seu pré-cadastro</Link>
        </p>
      </section>
    </>
  )
}
