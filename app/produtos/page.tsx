import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Icon, type IconName } from '@/components/icon'
import { SignupForm } from '@/components/forms'

export const metadata: Metadata = {
  title: { absolute: 'Produtos para Cães e Gatos: Cuidado e Bem-estar | PetApoio' },
  description:
    'Conforto, higiene, brincadeiras, passeios e alimentação para cães e gatos, organizados pelo que o seu pet precisa. Memórias e planos de saúde na mesma rede de cuidado.',
  alternates: { canonical: '/produtos' },
}

/** Loja organizada por necessidade do tutor, na ordem de prioridade comercial. */
const categorias: { id: string; icon: IconName; tom: string; titulo: string; texto: string; status: string; href?: string }[] = [
  { id: 'conforto', icon: 'home', tom: 'bg-laranja-clara text-laranja', titulo: 'Conforto e bem-estar', texto: 'Camas ortopédicas, camas iglu, mantas e colchonetes.', status: 'Em breve' },
  { id: 'higiene', icon: 'sun', tom: 'bg-salvia-clara text-salvia', titulo: 'Higiene e cuidados', texto: 'Lenços, shampoos, limpadores de patas e produtos de limpeza.', status: 'Em breve' },
  { id: 'brincadeiras', icon: 'paw', tom: 'bg-laranja-clara text-laranja', titulo: 'Brincadeiras e estímulos', texto: 'Tapetes de lamber, farejadores, brinquedos interativos e mordedores.', status: 'Em breve' },
  { id: 'passeios', icon: 'walk', tom: 'bg-nevoa-clara text-nevoa', titulo: 'Passeios e acessórios', texto: 'Coleiras, guias, peitorais e identificadores.', status: 'Em breve' },
  { id: 'alimentacao', icon: 'gift', tom: 'bg-salvia-clara text-salvia', titulo: 'Alimentação e petiscos', texto: 'Snacks naturais, petiscos para gatos e mastigáveis.', status: 'Em breve' },
  { id: 'memorias', icon: 'star', tom: 'bg-nevoa-clara text-nevoa', titulo: 'Memórias e homenagens', texto: 'Caixas de memória, quadros, pegadas e pingentes.', status: 'Disponível', href: '/loja' },
  { id: 'saude', icon: 'stethoscope', tom: 'bg-salvia-clara text-salvia', titulo: 'Saúde e proteção', texto: 'Planos de saúde, assistência e proteção com parceiros.', status: 'Pré-lançamento', href: '/saude' },
]

export default function ProdutosPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(110deg,#fff8f1_0%,#fbeee2_60%,#f6dcc4_100%)]">
        <div className="container-page grid items-center gap-10 pb-14 pt-10 md:pt-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="font-semibold text-laranja">Produtos pet</p>
            <h1 className="mt-2 text-[2.6rem] leading-[1.05] text-salvia-funda md:text-[3.6rem]">Produtos para uma vida ainda mais feliz ao lado do seu pet.</h1>
            <p className="mt-5 max-w-[50ch] text-lg text-grafite md:text-xl md:leading-relaxed">
              Conforto, bem-estar, diversão e muito amor em cada detalhe, organizados pelo que o seu pet precisa.
            </p>
            <a href="#categorias" className="btn btn-primario mt-8">Explorar categorias</a>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(120,60,10,.5)]">
            <Image src="/fotos/golden.webp" alt="Cachorro golden retriever feliz deitado em casa" fill priority sizes="(min-width: 1024px) 448px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section id="categorias" className="container-page scroll-mt-24 py-16" aria-labelledby="titulo-categorias">
        <h2 id="titulo-categorias" className="text-center text-3xl md:text-4xl">Nossas categorias</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((c) => {
            const inner = (
              <>
                <span className={`flex size-14 items-center justify-center rounded-2xl ${c.tom}`}><Icon name={c.icon} className="size-7" /></span>
                <span className={`absolute right-5 top-5 rounded-full px-2.5 py-0.5 text-xs font-bold ${c.href ? 'bg-salvia-clara text-salvia-funda' : 'bg-areia text-grafite-suave'}`}>{c.status}</span>
                <span className="mt-5 font-serif text-xl font-extrabold">{c.titulo}</span>
                <span className="mt-2 flex-1 text-[0.95rem] text-grafite-suave">{c.texto}</span>
                <span className="mt-4 text-[0.95rem] font-semibold text-laranja">{c.href ? 'Ver agora →' : 'Quero ser avisado →'}</span>
              </>
            )
            return (
              <li key={c.id} id={c.id} className="scroll-mt-24">
                <Link
                  href={c.href ?? '#avise-me'}
                  className="relative flex h-full flex-col rounded-2xl border border-areia bg-white p-6 transition hover:-translate-y-0.5 hover:border-laranja"
                >
                  {inner}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="container-page pb-16" aria-labelledby="titulo-celebre">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#fdf1e4] md:grid-cols-[1.1fr_1fr]">
          <div className="p-8 md:p-12">
            <h2 id="titulo-celebre" className="text-3xl md:text-4xl">Cuide, mime e celebre cada momento.</h2>
            <p className="mt-3 max-w-[46ch] text-lg text-grafite-suave">
              Estamos selecionando poucos produtos, de boa qualidade e com preço justo, começando pelos itens de conforto,
              higiene e diversão. Deixe seu e-mail para saber primeiro.
            </p>
            <div id="avise-me" className="mt-6 scroll-mt-24 max-w-md">
              <SignupForm list="loja" submitLabel="Quero ser avisado" />
            </div>
          </div>
          <div className="relative min-h-64">
            <Image src="/fotos/gato-manta.webp" alt="Gato descansando numa manta macia" fill sizes="(min-width: 768px) 520px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
    </>
  )
}
