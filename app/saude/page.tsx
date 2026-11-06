import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon, type IconName } from '@/components/icon'
import { Faq } from '@/components/faq'
import { HealthLeadForm } from '@/components/saude/health-lead-form'

export const metadata: Metadata = {
  title: 'PetApoio Saúde · Carteira digital e planos para pets',
  description:
    'Organize vacinas, consultas e exames do seu pet numa carteira digital gratuita, com lembretes. Em breve: comparador de planos e clube de benefícios com parceiros.',
  alternates: { canonical: '/saude' },
}

const carteira: [IconName, string, string][] = [
  ['shield', 'Vacinas e vermífugos', 'Data da aplicação e da próxima dose, sempre à mão.'],
  ['bell', 'Lembretes', 'O painel avisa o que vence nos próximos 30 dias e o que já passou.'],
  ['book', 'Consultas e exames', 'Um histórico simples para levar a qualquer veterinário.'],
  ['pill', 'Medicamentos', 'O que foi prescrito, quando começou e até quando vai.'],
]

const comparar = [
  ['Mensalidade', 'quanto custa por mês, por pet'],
  ['Rede credenciada', 'clínicas e hospitais perto de você'],
  ['Carência', 'quanto tempo até poder usar cada serviço'],
  ['Limites', 'quantas consultas, exames e valores por ano'],
  ['Coparticipação', 'quanto você paga a cada uso'],
  ['Exclusões', 'o que o contrato não cobre, em linguagem clara'],
]

const modelos = [
  {
    titulo: 'Clube de benefícios',
    texto: 'Descontos e vantagens numa rede de clínicas, laboratórios e pet shops parceiros. Não cobre despesas: você paga com desconto.',
    selo: 'Primeiro passo da PetApoio',
  },
  {
    titulo: 'Plano de assistência veterinária',
    texto: 'Acesso a consultas, vacinas e exames por contrato, com regras próprias de cada empresa. O setor ainda discute um marco regulatório.',
    selo: 'Com parceiros, após análise jurídica',
  },
  {
    titulo: 'Seguro pet',
    texto: 'Produto securitário, com coberturas e condições definidas pela seguradora autorizada pela SUSEP.',
    selo: 'Só com seguradoras autorizadas',
  },
]

const faq = [
  {
    q: 'A PetApoio é um plano de saúde ou uma seguradora?',
    a: 'Não. A PetApoio organiza a saúde do seu pet e vai conectar você a empresas habilitadas. Quando houver planos ou seguros na plataforma, quem presta a cobertura é o parceiro, com contrato próprio.',
  },
  {
    q: 'A carteira digital é paga?',
    a: 'Não. A carteira de saúde é gratuita para quem tem conta na PetApoio.',
  },
  {
    q: 'Quem vê os dados de saúde do meu pet?',
    a: 'Só você. A equipe PetApoio vê apenas números gerais (quantos pets estão cadastrados, por exemplo), nunca os registros. Nada é compartilhado com parceiros ou cuidadores sem a sua autorização.',
  },
  {
    q: 'A carteira substitui o veterinário?',
    a: 'Não. Ela é um registro feito por você, para não perder datas e levar o histórico às consultas. Dúvidas sobre vacinas, doses e tratamentos são com o veterinário.',
  },
]

export default function SaudePage() {
  return (
    <>
      <section className="bg-[radial-gradient(ellipse_at_top_right,#dfe7e0_0%,#f6f5f0_55%)]">
        <div className="container-page grid gap-12 pb-16 pt-12 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[0.95rem] font-semibold text-salvia-funda shadow-[0_1px_0_var(--color-areia)]">
              <Icon name="plus" className="size-4" /> PetApoio Saúde
            </p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.06] md:text-6xl">
              Cuidar da saúde do seu pet pode ser <span className="italic text-salvia-funda">simples e previsível</span>
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg text-grafite-suave md:text-xl md:leading-relaxed">
              Comece pela carteira digital gratuita: vacinas, consultas e lembretes num só lugar. Em seguida, vamos ajudar você a
              comparar planos e benefícios de parceiros, com as regras à vista.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/painel/pets" className="btn btn-primario !px-7">Criar carteira de saúde grátis</Link>
              <a href="#lista" className="btn btn-secundario">Entrar na lista do clube</a>
            </div>
          </div>

          {/* Prévia da carteira */}
          <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_30px_60px_-36px_rgba(46,42,39,.6)]">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-salvia-clara text-salvia-noite"><Icon name="paw" className="size-7" /></span>
                <div>
                  <p className="font-serif text-2xl">Mel</p>
                  <p className="text-sm text-grafite-suave">Cão · 7 anos · 12 kg</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  ['Vacina V10', 'Próxima dose em 12 dias', 'bg-[#f3e8cf] text-[#6b4f12]'],
                  ['Antirrábica', 'Em dia até março', 'bg-salvia-clara text-salvia-noite'],
                  ['Check-up anual', 'Feito em agosto', 'bg-nevoa-clara text-nevoa'],
                ].map(([t, d, tone]) => (
                  <li key={t} className="flex items-center justify-between gap-3 rounded-xl bg-linho px-4 py-3">
                    <span className="font-semibold">{t}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${tone}`}>{d}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-grafite-suave">Exemplo ilustrativo</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20" aria-labelledby="titulo-carteira">
        <div className="max-w-2xl">
          <p className="font-semibold text-salvia-funda">Disponível agora</p>
          <h2 id="titulo-carteira" className="mt-1 text-4xl md:text-5xl">Carteira digital de saúde</h2>
          <p className="mt-4 text-lg text-grafite-suave">Cadastre seus pets e registre o que acontece com a saúde de cada um. Leva dois minutos.</p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {carteira.map(([icon, t, d]) => (
            <li key={t} className="rounded-2xl border border-areia bg-white p-6">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-salvia-clara text-salvia-noite"><Icon name={icon} className="size-6" /></span>
              <h3 className="mt-5 font-sans text-lg font-bold">{t}</h3>
              <p className="mt-2 text-grafite-suave">{d}</p>
            </li>
          ))}
        </ul>
        <Link href="/painel/pets" className="btn btn-primario mt-8">Cadastrar meu pet</Link>
      </section>

      <section className="bg-linho-escuro py-20" aria-labelledby="titulo-modelos">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="font-semibold text-salvia-funda">Em construção com parceiros</p>
            <h2 id="titulo-modelos" className="mt-1 text-4xl md:text-5xl">Entenda antes de contratar</h2>
            <p className="mt-4 text-lg text-grafite-suave">
              Clube, plano e seguro parecem a mesma coisa, mas não são. A PetApoio vai mostrar cada opção pelo que ela é.
            </p>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {modelos.map((m) => (
              <li key={m.titulo} className="flex flex-col rounded-2xl bg-white p-7">
                <span className="w-fit rounded-full bg-nevoa-clara px-3 py-1 text-xs font-bold text-nevoa">{m.selo}</span>
                <h3 className="mt-4 font-sans text-xl font-bold">{m.titulo}</h3>
                <p className="mt-2 flex-1 text-grafite-suave">{m.texto}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h3 className="text-3xl">O que o comparador vai mostrar</h3>
              <p className="mt-3 text-grafite-suave">Lado a lado, para os planos disponíveis na sua região, sem letras miúdas escondidas.</p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              {comparar.map(([t, d]) => (
                <div key={t} className="flex gap-3 rounded-xl bg-white p-4">
                  <Icon name="check" className="mt-1 size-5 shrink-0 text-salvia-funda" />
                  <div><dt className="font-semibold">{t}</dt><dd className="text-grafite-suave">{d}</dd></div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="lista" className="container-page scroll-mt-24 py-20" aria-labelledby="titulo-lista">
        <div className="grid gap-10 rounded-[2rem] bg-white p-8 shadow-[0_30px_60px_-44px_rgba(46,42,39,.6)] md:p-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="font-semibold text-salvia-funda">Lista do clube de benefícios</p>
            <h2 id="titulo-lista" className="mt-1 text-4xl">Conte o que faria diferença para o seu pet</h2>
            <p className="mt-4 text-grafite-suave">
              Com suas respostas, escolhemos os primeiros parceiros e a faixa de preço certa. Avisamos por e-mail quando houver opções na sua cidade.
            </p>
          </div>
          <HealthLeadForm />
        </div>
      </section>

      <section className="container-page pb-16" aria-labelledby="titulo-faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="font-semibold text-salvia-funda">Perguntas frequentes</p>
            <h2 id="titulo-faq" className="mt-1 text-4xl">Transparência primeiro</h2>
          </div>
          <Faq items={faq} />
        </div>
      </section>
    </>
  )
}
