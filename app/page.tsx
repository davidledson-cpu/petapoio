import Link from 'next/link'
import { SupportRouter } from '@/components/support-router'
import { PostList } from '@/components/post-list'
import { SignupForm } from '@/components/forms'
import { FeaturedPsychologists } from '@/components/featured-psychologists'
import { StorePreview } from '@/components/store-preview'
import { Faq } from '@/components/faq'
import { getPosts } from '@/lib/blog'

const caminhos = [
  {
    nome: 'Entender o que você sente',
    texto: 'Textos revisados por psicólogas sobre saudade, culpa, a casa vazia e como falar com as crianças. Gratuito e no seu ritmo.',
    href: '/encontre-apoio',
    acao: 'Ler sobre o luto',
  },
  {
    nome: 'Conversar com um psicólogo',
    texto: 'Profissionais com CRP conferido e experiência em luto pet. Sessões online, agendadas e pagas aqui mesmo, com segurança.',
    href: '/psicologos',
    acao: 'Encontrar um psicólogo',
  },
  {
    nome: 'Guardar uma lembrança',
    texto: 'Retratos, caixas de recordação e pingentes feitos sob encomenda com a foto e o nome do seu companheiro.',
    href: '/loja',
    acao: 'Ver as lembranças',
  },
]

const passos = [
  ['Conte o que você precisa', 'Escolha por onde começar: ler, conversar com alguém ou guardar uma memória. Não há ordem certa.'],
  ['Escolha o profissional', 'Veja formação, abordagem, valor e horários livres. Todos com registro no CRP conferido.'],
  ['Agende e pague com segurança', 'Pix ou cartão pelo Mercado Pago. A sessão é confirmada assim que o pagamento é aprovado.'],
  ['Converse no seu tempo', 'A sessão acontece por vídeo, no celular ou no computador, sem instalar nada.'],
]

const faq = [
  {
    q: 'É normal sofrer tanto pela morte de um animal?',
    a: 'Sim. Um animal faz parte da rotina, da casa e da forma como a gente se cuida. A intensidade da dor costuma refletir a força do vínculo, e ela não precisa de justificativa.',
  },
  {
    q: 'O conteúdo do PetApoio é gratuito?',
    a: 'Sim. Os textos de acolhimento e as orientações são e continuarão gratuitos. Você só paga se escolher uma sessão com um profissional ou um produto da loja.',
  },
  {
    q: 'Como sei que o psicólogo é de verdade?',
    a: 'Antes de publicar um perfil, conferimos o número e a situação do registro no Conselho Regional de Psicologia e os documentos enviados pelo profissional.',
  },
  {
    q: 'Posso usar o PetApoio se meu pet ainda está vivo, mas doente?',
    a: 'Pode. O luto antecipatório, quando a perda é esperada, também dói. Os profissionais e os textos do PetApoio acolhem esse momento.',
  },
  {
    q: 'O PetApoio atende emergências?',
    a: 'Não. Se você está em sofrimento intenso ou pensando em tirar a própria vida, ligue para o CVV (188), a qualquer hora, ou para o SAMU (192).',
  },
]

export default function HomePage() {
  const posts = getPosts().slice(0, 3)

  return (
    <>
      <section className="container-page grid items-center gap-12 pb-20 pt-12 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h1 className="text-[2.65rem] leading-[1.06] sm:text-6xl lg:text-[4.1rem]">
            Quem já amou um pet sabe que a saudade também tem quatro patas.
          </h1>
          <p className="mt-6 max-w-[54ch] text-lg text-grafite-suave md:text-xl md:leading-relaxed">
            Se você perdeu seu companheiro, aqui você encontra acolhimento, informação confiável e psicólogos que levam essa
            dor a sério. No seu tempo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/psicologos" className="btn btn-primario">Conversar com um psicólogo</Link>
            <Link href="/encontre-apoio" className="btn btn-secundario">Quero entender o que sinto</Link>
          </div>
        </div>
        <SupportRouter />
      </section>

      <section className="border-y border-areia bg-linho-escuro py-6" aria-label="Compromissos do PetApoio">
        <ul className="container-page grid gap-3 text-[0.97rem] text-grafite-suave sm:grid-cols-2 lg:grid-cols-4">
          <li><strong className="text-grafite">CRP conferido</strong> em todos os perfis</li>
          <li><strong className="text-grafite">Conteúdo revisado</strong> por psicólogas</li>
          <li><strong className="text-grafite">Pagamento seguro</strong> por Pix ou cartão</li>
          <li><strong className="text-grafite">Seus dados protegidos</strong> pela LGPD</li>
        </ul>
      </section>

      <section className="container-page py-20" aria-labelledby="titulo-caminhos">
        <div className="max-w-2xl">
          <h2 id="titulo-caminhos" className="text-4xl md:text-5xl">Você não precisa passar por isso sozinho</h2>
          <p className="mt-4 text-lg text-grafite-suave">
            Perder um animal é perder uma companhia, uma rotina e um jeito de estar no mundo. O PetApoio oferece três
            caminhos de cuidado. Comece pelo que fizer sentido hoje.
          </p>
        </div>
        <dl className="mt-12 divide-y divide-areia-escura/60 border-y border-areia-escura/60">
          {caminhos.map((p) => (
            <div key={p.nome} className="grid gap-3 py-7 md:grid-cols-[16rem_1fr_auto] md:items-baseline md:gap-10">
              <dt className="font-serif text-[1.7rem] leading-tight">{p.nome}</dt>
              <dd className="max-w-[56ch] text-grafite-suave">{p.texto}</dd>
              <dd>
                <Link href={p.href} className="link whitespace-nowrap font-semibold">{p.acao}</Link>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-salvia-noite py-20 text-linho" aria-labelledby="titulo-como">
        <div className="container-page">
          <h2 id="titulo-como" className="text-4xl md:text-5xl">Como funciona o apoio psicológico</h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {passos.map(([t, d], i) => (
              <li key={t} className="border-t border-linho/25 pt-5">
                <span className="font-serif text-4xl text-salvia-clara">{i + 1}</span>
                <h3 className="mt-3 font-sans text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-linho/75">{d}</p>
              </li>
            ))}
          </ol>
          <Link href="/psicologos" className="btn mt-12 bg-linho text-salvia-noite hover:bg-white">Ver profissionais disponíveis</Link>
        </div>
      </section>

      <FeaturedPsychologists />

      {posts.length > 0 && (
        <section className="container-page py-16" aria-labelledby="titulo-blog">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="titulo-blog" className="text-4xl">Para entender o luto</h2>
            <Link href="/blog" className="link font-semibold">Todos os textos</Link>
          </div>
          <PostList posts={posts} />
        </section>
      )}

      <StorePreview />

      <section className="container-page py-16" aria-labelledby="titulo-faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <h2 id="titulo-faq" className="text-4xl">Perguntas frequentes</h2>
          <Faq items={faq} />
        </div>
      </section>

      <section className="container-page py-8">
        <div className="grid gap-10 rounded-[1.75rem] bg-salvia-funda p-8 text-linho md:grid-cols-[1.2fr_1fr] md:p-14">
          <div>
            <h2 className="text-3xl md:text-4xl">Textos de acolhimento no seu e-mail</h2>
            <p className="mt-4 text-linho/80">
              Um e-mail por semana, no máximo, com um texto revisado. Sem promoções escondidas. Você cancela com um clique.
            </p>
          </div>
          <SignupForm list="newsletter" submitLabel="Quero receber" tone="escuro" />
        </div>
      </section>

      <section className="container-page pt-12">
        <div className="flex flex-col gap-6 border-t border-areia pt-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl">Você é psicóloga ou psicólogo e trabalha com luto?</h2>
            <p className="mt-3 text-grafite-suave">
              Atenda pessoas que procuram exatamente o seu cuidado, com agenda, pagamentos e repasse organizados pela plataforma.
            </p>
          </div>
          <Link href="/seja-parceiro" className="btn btn-secundario shrink-0">Quero atender pelo PetApoio</Link>
        </div>
      </section>
    </>
  )
}
