import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { PsychologistSignupForm } from '@/components/psych/signup-form'
import { getSession } from '@/lib/auth'
import { getPlatformFeePercent } from '@/lib/psychologist'

export const metadata: Metadata = {
  title: 'Seja um psicólogo parceiro',
  description:
    'Atenda pessoas em luto pela perda de um animal. Perfil verificado, agenda online e pagamento direto na sua conta Mercado Pago.',
  alternates: { canonical: '/seja-parceiro' },
}

export default async function SejaParceiroPage() {
  const [session, fee] = await Promise.all([getSession(), getPlatformFeePercent()])
  const net = 100 - fee
  const exemplo = 200

  const beneficios = [
    {
      titulo: 'Pessoas que procuram exatamente esse apoio',
      texto:
        'Quem chega ao PetApoio está atravessando a perda de um animal e quer conversar com alguém que leve esse luto a sério.',
    },
    {
      titulo: 'Agenda e pagamento resolvidos',
      texto:
        'Você define horários e valor. O paciente escolhe o horário, paga por Pix ou cartão e recebe a confirmação. Você só precisa atender.',
    },
    {
      titulo: 'O dinheiro cai direto na sua conta',
      texto: `Com o split do Mercado Pago, ${net}% do valor vai para a sua conta no momento do pagamento. A PetApoio fica com ${fee}% para manter a plataforma.`,
    },
    {
      titulo: 'Regras claras e éticas',
      texto:
        'Sem compra de posição, sem depoimentos de pacientes e sem promessas de resultado, de acordo com o Código de Ética e as resoluções do CFP sobre publicidade.',
    },
  ]

  const passos = [
    ['Crie sua conta', 'Preencha o formulário abaixo e confirme seu e-mail.'],
    ['Complete o perfil', 'Foto, apresentação, formação, valor da sessão e horários.'],
    ['Envie o documento', 'Carteira do CRP ou documento equivalente, para a verificação.'],
    ['Conecte o Mercado Pago', 'É por onde você recebe. Leva um minuto.'],
    ['Comece a atender', 'Depois da aprovação, seu perfil aparece para quem procura apoio.'],
  ]

  const faq = [
    ['Quanto custa participar?', `Não há mensalidade. A PetApoio retém ${fee}% de cada sessão paga pela plataforma.`],
    [
      'Como recebo os pagamentos?',
      'Pelo split do Mercado Pago: a sua parte cai na sua conta no momento do pagamento, sem esperar repasse da PetApoio.',
    ],
    [
      'E se o paciente cancelar?',
      'Cancelamentos com antecedência são reembolsados automaticamente. Sessões em que o paciente não comparece podem ser registradas como "não compareceu".',
    ],
    ['Como são as sessões?', 'Por videochamada, no link que você cadastrar (Google Meet, Zoom ou outro), ou presencialmente, se você oferecer.'],
    ['Quanto tempo leva a aprovação?', 'Conferimos o registro no CRP e o perfil em até 3 dias úteis depois do envio do documento.'],
  ]

  return (
    <>
      <PageHeader
        title="Atenda quem está atravessando a perda de um animal"
        intro="O PetApoio conecta psicólogas e psicólogos a pessoas em luto pela perda de um pet. Você cuida do atendimento; nós cuidamos de agenda, pagamento e visibilidade."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {session?.profile.role === 'psicologo' ? (
            <Link href="/painel/psicologo" className="btn btn-primario">Ir para o meu painel</Link>
          ) : (
            <a href="#cadastro" className="btn btn-primario">Criar minha conta profissional</a>
          )}
          <a href="#como-funciona" className="btn btn-secundario">Ver como funciona</a>
        </div>
      </PageHeader>

      <section className="container-page grid gap-10 lg:grid-cols-2">
        <dl className="grid gap-6 sm:grid-cols-2">
          {beneficios.map((b) => (
            <div key={b.titulo} className="rounded-2xl bg-linho-escuro p-6">
              <dt className="font-serif text-xl">{b.titulo}</dt>
              <dd className="mt-2 text-grafite-suave">{b.texto}</dd>
            </div>
          ))}
        </dl>
        <div className="h-fit rounded-[1.75rem] bg-salvia-funda p-8 text-linho md:p-10">
          <h2 className="text-3xl">Quanto você recebe</h2>
          <p className="mt-3 text-linho/80">Exemplo com uma sessão de R$ {exemplo},00:</p>
          <dl className="mt-6 divide-y divide-white/15 border-y border-white/15">
            <div className="flex justify-between py-3">
              <dt>Paciente paga</dt>
              <dd className="font-semibold">R$ {exemplo},00</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt>Comissão PetApoio ({fee}%)</dt>
              <dd>− R$ {((exemplo * fee) / 100).toFixed(2).replace('.', ',')}</dd>
            </div>
            <div className="flex justify-between py-3 text-lg">
              <dt>Cai na sua conta Mercado Pago</dt>
              <dd className="font-semibold">R$ {((exemplo * net) / 100).toFixed(2).replace('.', ',')}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-linho/70">
            Taxas do Mercado Pago pelo meio de pagamento podem ser descontadas pelo próprio Mercado Pago, conforme a sua
            conta.
          </p>
        </div>
      </section>

      <section id="como-funciona" className="container-page mt-20 scroll-mt-24">
        <h2 className="text-3xl md:text-4xl">Como funciona</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-5">
          {passos.map(([titulo, texto], i) => (
            <li key={titulo}>
              <span className="flex size-9 items-center justify-center rounded-full bg-salvia-clara font-semibold text-salvia-noite">
                {i + 1}
              </span>
              <p className="mt-3 font-semibold">{titulo}</p>
              <p className="mt-1 text-[0.97rem] text-grafite-suave">{texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="cadastro" className="container-page mt-20 grid scroll-mt-24 gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <h2 className="text-3xl md:text-4xl">Cadastro profissional</h2>
          <p className="mt-3 text-grafite-suave">
            Gratuito e sem compromisso. Seu perfil só fica público depois da verificação e quando você decidir começar.
          </p>
          {session && session.profile.role !== 'psicologo' && (
            <p className="mt-6 rounded-lg bg-[#f3e8cf] px-4 py-3 text-[0.97rem] text-[#6b4f12]">
              Você está conectado com uma conta de paciente. Para se cadastrar como profissional, saia e use outro e-mail.
            </p>
          )}
          <h3 className="mt-10 text-2xl">Perguntas frequentes</h3>
          <div className="mt-4 divide-y divide-areia border-y border-areia">
            {faq.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-semibold">
                  {q}
                  <span aria-hidden="true" className="text-salvia-funda transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-grafite-suave">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-[0.97rem]">
            Já tem conta? <Link href="/entrar?next=/painel/psicologo" className="link">Entrar</Link>
          </p>
        </div>
        <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_1px_0_var(--color-areia),0_20px_40px_-30px_rgba(46,42,39,.35)] md:p-10">
          {session?.profile.role === 'psicologo' ? (
            <div>
              <p className="font-serif text-2xl">Você já tem uma conta profissional.</p>
              <Link href="/painel/psicologo" className="btn btn-primario mt-6">Ir para o meu painel</Link>
            </div>
          ) : (
            <PsychologistSignupForm />
          )}
        </div>
      </section>
    </>
  )
}
