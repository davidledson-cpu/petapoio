import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Icon, type IconName } from '@/components/icon'
import { Faq } from '@/components/faq'
import { HealthLeadForm } from '@/components/saude/health-lead-form'
import { brlMes, COMBOS, MOSTRAR_PRECOS, PRODUTOS } from '@/lib/saude-planos'

export const metadata: Metadata = {
  title: { absolute: 'Saúde e Planos de Proteção para Cães e Gatos | PetApoio' },
  description:
    'Planos PetApoio Saúde, Protege e Despedida, operados por parceiros especializados: cuidado no dia a dia, nos imprevistos e na despedida. Lista de espera aberta e carteira digital grátis.',
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
    titulo: 'Plano de assistência veterinária',
    texto: 'Acesso a consultas, vacinas e exames numa rede credenciada, com carências e limites definidos em contrato.',
    selo: 'PetApoio Saúde',
  },
  {
    titulo: 'Seguro pet',
    texto: 'Produto securitário: coberturas e indenizações definidas na apólice de uma seguradora autorizada pela SUSEP.',
    selo: 'PetApoio Protege',
  },
  {
    titulo: 'Plano funerário pet',
    texto: 'Assistência na despedida: retirada, cremação e entrega das cinzas, conforme a modalidade contratada.',
    selo: 'PetApoio Despedida',
  },
]

const faq = [
  {
    q: 'Já posso contratar?',
    a: 'Ainda não. Estamos fechando os contratos com os parceiros. Quem entra na lista de espera recebe primeiro as condições de lançamento, com o contrato completo, sem compromisso.',
  },
  {
    q: 'A PetApoio é um plano de saúde, uma seguradora ou um crematório?',
    a: 'Nenhum dos três. Os planos levam a marca PetApoio, mas cada serviço é operado por uma empresa especializada, com contrato próprio. A PetApoio cuida do atendimento, da sua carteira digital e do acolhimento.',
  },
  {
    q: 'Qual a diferença entre Saúde e Protege?',
    a: 'O Saúde é para o dia a dia: consultas, vacinas, exames. O Protege é para imprevistos: emergências, cirurgias e eventos que pesam no bolso. Juntos, cobrem a rotina e os sustos.',
  },
  {
    q: 'Por que um plano de despedida?',
    a: 'Porque decidir tudo na hora da perda é muito difícil. Com o Despedida, a retirada, a cremação e a homenagem já estão combinadas, e você recebe o acolhimento da PetApoio no luto.',
  },
  {
    q: 'Os preços da página são finais?',
    a: 'Não. São valores de referência do pré-lançamento. O preço final, as coberturas, as carências e os limites vêm no contrato de cada parceiro, que você lê antes de decidir.',
  },
  {
    q: 'A carteira digital é paga? Quem vê os dados do meu pet?',
    a: 'É gratuita. Só você vê os registros de saúde do seu pet. A equipe PetApoio vê apenas números gerais, e nada é compartilhado com parceiros sem a sua autorização.',
  },
]

export default function SaudePage() {
  return (
    <>
      <section className="bg-[linear-gradient(110deg,#fff8f1_0%,#eaf4ef_60%,#d9ece3_100%)]">
        <div className="container-page grid gap-12 pb-16 pt-12 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[0.95rem] font-semibold text-salvia-funda shadow-[0_1px_0_var(--color-areia)]">
              <Icon name="plus" className="size-4" /> PetApoio Saúde · pré-lançamento
            </p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.05] text-salvia-funda md:text-[3.6rem]">
              Cuidado e saúde para uma vida longa e feliz.
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg text-grafite-suave md:text-xl md:leading-relaxed">
              Saúde no dia a dia, proteção nos imprevistos e uma despedida digna quando chegar a hora, para quem faz parte
              da família. Planos com a marca PetApoio, operados por empresas especializadas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#planos" className="btn btn-primario !px-7">Conhecer os planos</a>
              <a href="#lista" className="btn btn-secundario">Entrar na lista de espera</a>
            </div>
            <p className="mt-5 text-[0.95rem] text-grafite-suave">
              Enquanto isso, a <Link href="/painel/pets" className="link">carteira digital de saúde</Link> já é gratuita.
            </p>
          </div>

          <div className="relative mx-auto aspect-[6/5] w-full max-w-lg overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(20,70,50,.45)]">
            <Image src="/fotos/casal-pets.webp" alt="Cachorro e gato lado a lado, felizes" fill priority sizes="(min-width: 1024px) 512px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section id="planos" className="container-page scroll-mt-24 py-20" aria-labelledby="titulo-planos">
        <div className="max-w-2xl">
          <p className="font-semibold text-salvia-funda">Três momentos, uma só proteção</p>
          <h2 id="titulo-planos" className="mt-1 text-4xl md:text-5xl">Cuidado na vida inteira do seu pet</h2>
          <p className="mt-4 text-lg text-grafite-suave">
            Contrate um produto ou combine os três. Eles foram pensados para se completar, não para competir.
          </p>
        </div>
        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {PRODUTOS.map((p, i) => (
            <li key={p.id} className="flex flex-col rounded-[1.75rem] border border-areia bg-white p-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-salvia-funda">{i + 1}. {p.momento}</p>
              <h3 className="mt-2 text-3xl">{p.nome}</h3>
              <p className="mt-2 text-grafite-suave">{p.resumo}</p>
              <ul className="mt-5 space-y-2">
                {p.inclui.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Icon name="check" className="mt-1 size-4 shrink-0 text-salvia-funda" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-6 space-y-2 border-t border-areia pt-5">
                {p.faixas.map((f) => (
                  <li key={f.nome} className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${f.destaque ? 'bg-salvia-clara' : 'bg-linho'}`}>
                    <span>
                      <span className="block font-semibold">{f.nome}</span>
                      <span className="text-sm text-grafite-suave">{f.para}</span>
                    </span>
                    {MOSTRAR_PRECOS && (
                      <span className="whitespace-nowrap text-right">
                        <span className="font-semibold">{brlMes(f.preco)}</span>
                        <span className="block text-xs text-grafite-suave">/mês*</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex-1 text-sm text-grafite-suave">{p.nota}</p>
              <a href={`#lista`} className="btn btn-secundario mt-6 w-full">Quero o {p.nome.replace('PetApoio ', '')}</a>
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <h3 className="text-3xl md:text-4xl">Combos: tudo junto, mais simples</h3>
          <p className="mt-3 max-w-2xl text-grafite-suave">Uma mensalidade só para cuidar do seu pet do começo ao fim.</p>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {COMBOS.map((c) => (
              <li
                key={c.nome}
                className={`flex flex-col rounded-[1.75rem] p-7 ${c.destaque ? 'bg-salvia-funda text-linho shadow-[0_30px_60px_-36px_rgba(46,42,39,.6)]' : 'border border-areia bg-white'}`}
              >
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${c.destaque ? 'bg-linho text-salvia-noite' : 'bg-salvia-clara text-salvia-noite'}`}>{c.selo}</span>
                <h4 className="mt-4 font-serif text-2xl">{c.nome}</h4>
                {MOSTRAR_PRECOS && (
                  <p className="mt-3">
                    <span className="font-serif text-4xl">{brlMes(c.preco)}</span>
                    <span className={c.destaque ? 'text-linho/75' : 'text-grafite-suave'}> /mês*</span>
                  </p>
                )}
                <p className={`mt-3 flex-1 ${c.destaque ? 'text-linho/85' : 'text-grafite-suave'}`}>{c.inclui}</p>
                <a href="#lista" className={`btn mt-6 w-full ${c.destaque ? 'bg-linho text-salvia-noite hover:bg-white' : 'btn-secundario'}`}>Quero ser avisado</a>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-4xl text-sm text-grafite-suave">
            * Pré-lançamento: valores de referência, ainda em negociação com os parceiros. Nada é vendido nesta página. Coberturas,
            carências, limites e preço final vêm no contrato de cada parceiro, que você recebe antes de decidir.
          </p>
        </div>

        <div className="mt-16 grid gap-10 rounded-[1.75rem] bg-linho-escuro p-8 md:p-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h3 className="text-3xl">Quem faz o quê</h3>
            <p className="mt-3 text-grafite-suave">
              A PetApoio não é clínica, seguradora nem crematório. Cuidamos de você; quem opera cada serviço é um parceiro especializado.
            </p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ['PetApoio', 'Atendimento, contratação, carteira digital, lembretes e acolhimento no luto.'],
              ['Parceiro de saúde', 'Consultas, rede credenciada, telemedicina e reembolsos.'],
              ['Seguradora autorizada', 'Apólice, coberturas e indenizações do Protege.'],
              ['Crematório parceiro', 'Retirada, transporte, cremação e entrega das cinzas.'],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl bg-white p-4">
                <dt className="font-semibold">{t}</dt>
                <dd className="mt-1 text-grafite-suave">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page pb-20" aria-labelledby="titulo-carteira">
        <div className="max-w-2xl">
          <p className="font-semibold text-salvia-funda">Grátis e disponível agora</p>
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
            <p className="font-semibold text-salvia-funda">Sem letras miúdas</p>
            <h2 id="titulo-modelos" className="mt-1 text-4xl md:text-5xl">Entenda antes de contratar</h2>
            <p className="mt-4 text-lg text-grafite-suave">
              Plano, seguro e plano funerário parecem a mesma coisa, mas não são. Mostramos cada um pelo que ele é.
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
              <h3 className="text-3xl">O que você vê antes de contratar</h3>
              <p className="mt-3 text-grafite-suave">Para cada plano, em linguagem clara e lado a lado.</p>
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
            <p className="font-semibold text-salvia-funda">Lista de espera</p>
            <h2 id="titulo-lista" className="mt-1 text-4xl">Seja avisado no lançamento</h2>
            <p className="mt-4 text-grafite-suave">
              Conte o que faz sentido para o seu pet. Quem está na lista recebe primeiro as condições de lançamento, sem compromisso.
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
