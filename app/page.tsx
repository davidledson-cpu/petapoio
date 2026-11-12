import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PostList } from '@/components/post-list'
import { SignupForm } from '@/components/forms'
import { Faq } from '@/components/faq'
import { Icon, type IconName } from '@/components/icon'
import { ProductCard } from '@/components/loja/product-card'
import { getPosts } from '@/lib/blog'
import { getProducts } from '@/lib/loja/catalog'
import { PROFISSOES } from '@/lib/profissionais'
import { brlMes, MOSTRAR_PRECOS, PRODUTOS } from '@/lib/saude-planos'

export const metadata: Metadata = {
  title: { absolute: 'PetApoio: Cuidado, Saúde e Apoio para Pets e Tutores' },
  alternates: { canonical: '/' },
}

const Seta = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Os quatro momentos de entrada: o tutor escolhe o caminho sem precisar conhecer as categorias. */
const caminhos: { icon: IconName; tom: string; titulo: string; texto: string; href: string }[] = [
  { icon: 'heart', tom: 'bg-laranja-clara text-laranja', titulo: 'Quero encontrar apoio emocional', texto: 'Psicólogos e acolhimento para lidar com a perda de um pet.', href: '/psicologos' },
  { icon: 'shield', tom: 'bg-salvia-clara text-salvia', titulo: 'Quero cuidar e proteger meu pet', texto: 'Plano de saúde, plano funerário, cuidadores perto de casa e carteira de saúde.', href: '/saude' },
  { icon: 'paw', tom: 'bg-laranja-clara text-laranja', titulo: 'Quero produtos para meu pet', texto: 'Conforto, higiene, brincadeiras e passeios.', href: '/produtos' },
  { icon: 'star', tom: 'bg-nevoa-clara text-nevoa', titulo: 'Quero homenagear meu pet', texto: 'Lembranças e produtos personalizados.', href: '/loja' },
]

const cuidar: { icon: IconName; tom: string; titulo: string; href: string }[] = [
  { icon: 'home', tom: 'bg-laranja-clara text-laranja', titulo: 'Cuidadores perto de casa', href: '/cuida' },
  { icon: 'book', tom: 'bg-salvia-clara text-salvia', titulo: 'Adestramento positivo', href: '/cuida#aviso' },
  { icon: 'stethoscope', tom: 'bg-nevoa-clara text-nevoa', titulo: 'Carteira de saúde grátis', href: '/saude#carteira' },
]

const confiancaLuto: { icon: IconName; text: string }[] = [
  { icon: 'shield', text: 'CRP conferido em todos os perfis' },
  { icon: 'video', text: 'Sessões online, de casa' },
  { icon: 'lock', text: 'Sigilo e LGPD' },
]

const faq = [
  {
    q: 'O que é a PetApoio?',
    a: 'Uma rede de cuidado para tutores e seus pets: saúde e proteção, produtos e serviços do dia a dia, apoio emocional na perda e memórias para guardar a história de vocês.',
  },
  {
    q: 'Os psicólogos e cuidadores são verificados?',
    a: 'Sim. Psicólogos têm o registro no CRP conferido antes de aparecer. Cuidadores e adestradores passam por verificação de identidade, conversa com a equipe e referências.',
  },
  {
    q: 'A PetApoio é plano de saúde ou seguradora?',
    a: 'Não. Os planos levam a marca PetApoio, mas são operados por empresas especializadas, com contrato próprio. Estão em pré-lançamento, com lista de espera.',
  },
  {
    q: 'A PetApoio atende emergências?',
    a: 'Não. Se você está em sofrimento intenso, ligue para o CVV (188) ou para o SAMU (192). Em emergências com o seu pet, procure um hospital veterinário 24h.',
  },
]

export default async function HomePage() {
  const posts = getPosts().slice(0, 3)
  const products = (await getProducts())?.slice(0, 3) ?? []

  return (
    <>
      {/* 1. Seu pet merece cuidado. Você também. */}
      <section className="relative overflow-hidden bg-[linear-gradient(110deg,#fff8f1_0%,#fdeedd_55%,#f9d9b8_100%)]">
        <div className="container-page grid items-center gap-10 pb-36 pt-10 md:pt-14 lg:grid-cols-[1fr_1.05fr] lg:pb-40">
          <div className="relative z-10">
            <h1 className="text-[2.9rem] leading-[1.02] text-salvia-funda sm:text-6xl lg:text-[4.3rem]">
              Seu pet merece cuidado.
              <span className="script mt-1 block text-[3.6rem] text-laranja sm:text-[4.6rem] lg:text-[5.4rem]">Você também.</span>
            </h1>
            <p className="mt-5 max-w-[44ch] text-lg text-grafite md:text-xl md:leading-relaxed">
              Uma rede de cuidado, saúde, acolhimento e apoio para todas as fases da vida com seu pet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#ajuda" className="btn btn-primario !px-7">Como podemos ajudar? <Seta size={18} /></a>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(120,60,10,.55)]">
              <Image src="/fotos/hero-tutora.webp" alt="Tutora abraçando um cachorro e um gato" fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Como podemos ajudar? */}
      <section id="ajuda" className="container-page relative z-10 -mt-28 scroll-mt-24" aria-labelledby="titulo-ajuda">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(46,42,39,.45)] md:p-10">
          <h2 id="titulo-ajuda" className="text-center text-3xl md:text-4xl">Como podemos ajudar você hoje?</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {caminhos.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="group flex h-full flex-col items-center rounded-2xl border border-areia bg-linho px-5 py-7 text-center transition hover:-translate-y-0.5 hover:border-laranja hover:bg-white">
                  <span className={`flex size-14 items-center justify-center rounded-full ${c.tom}`}><Icon name={c.icon} className="size-7" /></span>
                  <span className="mt-4 font-serif text-lg font-extrabold leading-snug text-grafite">{c.titulo}</span>
                  <span className="mt-2 flex-1 text-[0.95rem] text-grafite-suave">{c.texto}</span>
                  <span className="mt-4 text-laranja transition-transform group-hover:translate-x-1"><Seta size={18} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Cuidar é um gesto de amor */}
      <section className="container-page py-20" aria-labelledby="titulo-cuidar">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-[#fdf1e4] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[5/3] h-full min-h-64 lg:aspect-auto">
            <Image src="/fotos/cachorro-grama.webp" alt="Cachorro correndo feliz na grama" fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
          </div>
          <div className="p-8 lg:py-12 lg:pr-12">
            <h2 id="titulo-cuidar" className="text-4xl md:text-5xl">Cuidar é um gesto de amor</h2>
            <p className="mt-4 max-w-[48ch] text-lg text-grafite-suave">
              Alguém de confiança para cuidar dele perto de casa, educação com reforço positivo e a saúde organizada num
              lugar só, com a carteira de saúde grátis.
            </p>
            <ul className="mt-7 grid grid-cols-3 gap-3">
              {cuidar.map((c) => (
                <li key={c.titulo}>
                  <Link href={c.href} className="flex h-full flex-col items-center rounded-2xl bg-white px-3 py-5 text-center text-[0.92rem] font-semibold transition hover:-translate-y-0.5">
                    <span className={`mb-3 flex size-12 items-center justify-center rounded-full ${c.tom}`}><Icon name={c.icon} className="size-6" /></span>
                    {c.titulo}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cuida" className="btn btn-primario">Encontrar um cuidador <Seta /></Link>
              <Link href="/produtos" className="btn btn-secundario">Explorar produtos</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Saúde e proteção */}
      <section className="bg-salvia-clara/60 py-20" aria-labelledby="titulo-saude">
        <div className="container-page">
          <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="font-semibold text-salvia">PetApoio Saúde · pré-lançamento</p>
              <h2 id="titulo-saude" className="mt-1 text-4xl md:text-5xl">Saúde e proteção para quem faz parte da família</h2>
              <p className="mt-4 max-w-[52ch] text-lg text-grafite-suave">
                Prevenção no dia a dia, tranquilidade nos imprevistos e uma despedida digna já combinada. Planos com a marca
                PetApoio, operados por parceiros especializados.
              </p>
            </div>
            <div className="relative hidden aspect-[2/1] overflow-hidden rounded-[1.75rem] lg:block">
              <Image src="/fotos/vet-gato.webp" alt="Veterinária segurando um gato" fill sizes="480px" className="object-cover" />
            </div>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {PRODUTOS.map((p) => (
              <li key={p.id} className="flex flex-col rounded-2xl bg-white p-7 shadow-[0_18px_40px_-34px_rgba(46,42,39,.5)]">
                <p className="text-sm font-bold uppercase tracking-wide text-salvia">{p.momento}</p>
                <h3 className="mt-1 text-2xl">{p.nome}</h3>
                <p className="mt-2 flex-1 text-grafite-suave">{p.resumo}</p>
                {MOSTRAR_PRECOS && (
                  <p className="mt-4 text-grafite-suave">
                    a partir de <span className="font-serif text-2xl font-extrabold text-laranja">{brlMes(Math.min(...p.faixas.map((f) => f.preco)))}</span>/mês*
                  </p>
                )}
                <Link href={`/saude#${p.id}`} className="mt-5 inline-flex items-center gap-1.5 font-semibold text-salvia-funda hover:underline">Conhecer o plano <Seta /></Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/saude#lista" className="btn btn-primario">Entrar na lista de espera <Seta /></Link>
            <Link href="/saude#carteira" className="btn btn-secundario">Criar carteira de saúde grátis</Link>
          </div>
          {MOSTRAR_PRECOS && (
            <p className="mt-5 text-sm text-grafite-suave">* Valores de referência do pré-lançamento, ainda em negociação com os parceiros. Nada é vendido nesta página.</p>
          )}
        </div>
      </section>

      {/* 5. Quando a saudade chega */}
      <section className="container-page py-20" aria-labelledby="titulo-saudade">
        <div className="relative overflow-hidden rounded-[2rem]">
          <Image src="/fotos/saudade.webp" alt="Tutora abraçada ao seu cachorro olhando o pôr do sol" fill sizes="(min-width: 1200px) 1150px, 100vw" className="object-cover object-right" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,248,241,.97)_0%,rgba(255,248,241,.9)_40%,rgba(255,248,241,0)_75%)]" />
          <div className="relative max-w-xl p-8 md:p-14">
            <h2 id="titulo-saudade" className="text-4xl md:text-5xl">Quando a saudade chega, você não precisa passar por isso sozinho</h2>
            <p className="mt-4 text-lg text-grafite">
              Conte com apoio psicológico e acolhimento de quem entende que a perda de um pet é a perda de alguém da família.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/psicologos" className="btn btn-verde">Buscar um psicólogo <Seta /></Link>
              <Link href="/encontre-apoio" className="btn btn-secundario bg-white/70">Como você está agora?</Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-grafite">
              {confiancaLuto.map((c) => (
                <li key={c.text} className="flex items-center gap-2"><Icon name={c.icon} className="size-5 text-salvia" />{c.text}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. O amor continua nas memórias */}
      <section className="bg-[#fdf1e4] py-20" aria-labelledby="titulo-memorias">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="relative aspect-[8/3] overflow-hidden rounded-[1.75rem]">
              <Image src="/fotos/caixa-memorias.webp" alt="Caixa de memórias de madeira com foto de um gato e flores" fill sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 id="titulo-memorias" className="text-4xl md:text-5xl">O amor continua nas memórias</h2>
              <p className="mt-4 max-w-[48ch] text-lg text-grafite-suave">
                Produtos personalizados para homenagear e lembrar para sempre, feitos sob encomenda e com prévia antes da produção.
              </p>
              <Link href="/loja" className="btn btn-verde mt-7">Conheça nossa linha <Seta /></Link>
            </div>
          </div>
          {products.length > 0 && (
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <li key={p.id}><ProductCard product={p} /></li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 7. Conteúdos */}
      <section className="container-page py-20" aria-labelledby="titulo-blog">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 id="titulo-blog" className="text-4xl md:text-5xl">Conteúdos para cuidar, entender e acolher</h2>
            <p className="mt-3 text-lg text-grafite-suave">Dicas, orientações e histórias que fazem a diferença, revisadas por profissionais.</p>
          </div>
          <Link href="/blog" className="btn btn-primario">Acessar o blog <Seta /></Link>
        </div>
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <ul className="grid gap-4 md:grid-cols-3">
            {['Como lidar com a perda de um pet?', 'O luto pet é uma dor legítima?', 'Como explicar a perda para uma criança?'].map((t) => (
              <li key={t} className="rounded-2xl bg-white p-6 font-serif text-lg font-extrabold shadow-[0_18px_40px_-34px_rgba(46,42,39,.5)]">{t}</li>
            ))}
          </ul>
        )}
      </section>

      {/* 8. Faça parte da rede */}
      <section className="container-page pb-20" aria-labelledby="titulo-parceiros">
        <div className="rounded-[2rem] bg-salvia-noite p-8 text-linho md:p-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-center">
            <div>
              <h2 id="titulo-parceiros" className="text-4xl text-white md:text-5xl">Faça parte da rede PetApoio</h2>
              <p className="mt-4 text-lg text-linho/80">
                Psicólogos, cuidadores, adestradores, fornecedores e empresas que cuidam de tutores e pets com a gente.
              </p>
              <Link href="/seja-parceiro" className="btn btn-primario mt-7">Quero ser parceiro PetApoio <Seta /></Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3">
              {PROFISSOES.map((p) => (
                <li key={p.id}>
                  <Link href={p.href} className="flex h-full flex-col rounded-2xl bg-white/8 p-5 transition-colors hover:bg-white/14">
                    <span className="text-xs font-semibold text-laranja">{p.selo}</span>
                    <span className="mt-1 font-serif text-xl font-extrabold text-white">{p.titulo}</span>
                    <span className="mt-2 flex-1 text-[0.95rem] text-linho/80">{p.resumo}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold">{p.menu} <Seta /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page pb-16" aria-labelledby="titulo-faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <h2 id="titulo-faq" className="text-4xl">Perguntas frequentes</h2>
          <Faq items={faq} />
        </div>
      </section>

      <section id="newsletter" className="container-page scroll-mt-24 pb-8">
        <div className="grid gap-8 rounded-[2rem] bg-laranja-clara p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:p-12">
          <div>
            <h2 className="text-3xl md:text-4xl">Receba novidades e cuidados no seu e-mail</h2>
            <p className="mt-3 text-grafite-suave">No máximo um e-mail por semana. Você cancela com um clique.</p>
          </div>
          <SignupForm list="newsletter" submitLabel="Quero receber" />
        </div>
      </section>
    </>
  )
}
