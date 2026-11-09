import type { Metadata } from 'next'
import Link from 'next/link'
import { getPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Encontre apoio para o luto pet',
  description:
    'Perdeu seu pet e não sabe o que fazer com a dor? Orientações para os primeiros dias, para a saudade que continua e para apoiar alguém, com caminhos claros de ajuda.',
  alternates: { canonical: '/encontre-apoio' },
}

const dores = [
  'A casa ficou silenciosa demais, e a rotina perdeu o sentido.',
  'Você se pergunta se poderia ter feito algo diferente.',
  'Ouviu que “era só um bicho” e se sentiu ainda mais sozinho.',
  'A saudade aparece do nada, mesmo depois de meses.',
]

const ajuda = [
  {
    titulo: 'Entender o que está acontecendo',
    texto: 'Explicamos, sem jargão, as reações comuns do luto. Saber que o que você sente tem nome já alivia um pouco.',
  },
  {
    titulo: 'Saber o que fazer agora',
    texto: 'Pequenos passos para os dias difíceis: o que pode esperar, o que ajuda, com quem falar.',
  },
  {
    titulo: 'Ter com quem conversar',
    texto: 'Psicólogos com CRP conferido e experiência em luto pet, com sessão online agendada aqui mesmo.',
  },
]

export default function EncontreApoioPage() {
  const posts = getPosts()
  const leitura = (slug: string) => posts.find((p) => p.slug === slug)

  const secoes = [
    {
      id: 'primeiros-dias',
      atalho: 'Acabei de perder meu pet',
      titulo: 'Se você acabou de perder seu pet',
      dor: 'Nos primeiros dias, é comum sentir um vazio físico, não conseguir dormir ou comer e esperar ouvir o barulho dele pela casa.',
      passos: [
        'Cuide do básico: água, alguma comida, descanso quando der. Isso já é bastante.',
        'Deixe para depois as decisões sobre os pertences, uma homenagem ou um novo animal.',
        'Fale com alguém que conheceu seu pet ou que entende essa perda.',
      ],
      leituras: ['perdi-meu-cachorro', 'culpa-depois-da-morte-do-pet'],
      cta: { href: '/psicologos', label: 'Conversar com um psicólogo' },
    },
    {
      id: 'com-o-tempo',
      atalho: 'A saudade continua',
      titulo: 'Se já faz um tempo, e a saudade continua',
      dor: 'O luto não segue calendário. Um aniversário, uma música ou um lugar podem trazer a dor de volta com força.',
      passos: [
        'Crie um pequeno ritual para as datas difíceis, como acender uma luz ou escrever uma carta.',
        'Guarde uma lembrança num lugar especial, se isso trouxer conforto.',
        'Se a dor continua atrapalhando o sono, o trabalho ou as relações, procure acompanhamento.',
      ],
      leituras: [],
      cta: { href: '/psicologos', label: 'Encontrar acompanhamento' },
      extra: { href: '/loja', label: 'Ver lembranças para guardar' },
    },
    {
      id: 'apoiar-alguem',
      atalho: 'Apoiar alguém',
      titulo: 'Se você quer apoiar alguém que perdeu',
      dor: 'Muita gente não sabe o que dizer e acaba se afastando, justamente quando a pessoa mais precisa de companhia.',
      passos: [
        'Chame o animal pelo nome: “sinto muito pela Mel” acolhe mais do que frases gerais.',
        'Evite “era só um bicho” ou “adota outro”. Ouvir vale mais do que aconselhar.',
        'Ofereça ajuda concreta e continue presente nas semanas seguintes.',
      ],
      leituras: ['explicar-morte-do-pet-para-crianca'],
      cta: { href: '/loja?categoria=presentes', label: 'Ver presentes de acolhimento' },
    },
  ]

  return (
    <>
      <header className="container-page grid gap-10 pb-14 pt-14 md:pt-20 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
        <div>
          <h1 className="text-[2.6rem] leading-[1.06] md:text-6xl">A dor de perder um pet é real. E não precisa ser vivida sozinha.</h1>
          <p className="mt-6 max-w-[58ch] text-lg text-grafite-suave md:text-xl md:leading-relaxed">
            A PetApoio ajuda você a entender o que está sentindo, a atravessar os dias difíceis e, se quiser, a conversar
            com um psicólogo que entende essa perda.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#por-onde-comecar" className="btn btn-primario">Escolher por onde começar</a>
            <Link href="/psicologos" className="btn btn-secundario">Falar com um psicólogo</Link>
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-areia/70 p-7">
          <p className="font-semibold">Talvez você esteja sentindo que…</p>
          <ul className="mt-4 space-y-3">
            {dores.map((d) => (
              <li key={d} className="border-l-2 border-salvia pl-4 font-serif text-lg leading-snug">{d}</li>
            ))}
          </ul>
          <p className="mt-5 text-[0.97rem] text-grafite-suave">Tudo isso é comum. E existe ajuda.</p>
        </div>
      </header>

      <section className="border-y border-areia bg-linho-escuro py-14" aria-labelledby="titulo-ajuda">
        <div className="container-page">
          <h2 id="titulo-ajuda" className="text-3xl md:text-4xl">Como a PetApoio ajuda</h2>
          <dl className="mt-8 grid gap-8 md:grid-cols-3">
            {ajuda.map((a) => (
              <div key={a.titulo}>
                <dt className="font-serif text-2xl">{a.titulo}</dt>
                <dd className="mt-2 text-grafite-suave">{a.texto}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="por-onde-comecar" className="container-page scroll-mt-24 pt-16" aria-labelledby="titulo-comecar">
        <h2 id="titulo-comecar" className="text-3xl md:text-4xl">Por onde você quer começar?</h2>
        <nav aria-label="Escolha seu momento" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {secoes.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-block rounded-full bg-areia px-4 py-2 hover:bg-areia-escura">{s.atalho}</a>
              </li>
            ))}
            <li>
              <Link href="/ajuda-imediata" className="inline-block rounded-full bg-salvia-noite px-4 py-2 text-linho hover:bg-salvia-funda">
                Está difícil demais agora
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-10 space-y-6">
          {secoes.map((s) => {
            const links = s.leituras.map(leitura).filter((p) => p !== undefined)
            return (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-titulo`}
                className="scroll-mt-24 grid gap-8 rounded-[1.75rem] bg-white p-7 shadow-[0_1px_0_var(--color-areia)] md:grid-cols-[1fr_1.3fr] md:p-12"
              >
                <div>
                  <h3 id={`${s.id}-titulo`} className="text-3xl md:text-4xl">{s.titulo}</h3>
                  <p className="mt-4 text-lg text-grafite-suave">{s.dor}</p>
                </div>
                <div>
                  <p className="font-semibold">O que pode ajudar</p>
                  <ol className="mt-3 space-y-3">
                    {s.passos.map((p, i) => (
                      <li key={p} className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-salvia-clara text-sm font-semibold text-salvia-noite">{i + 1}</span>
                        <span className="pt-0.5 text-grafite-suave">{p}</span>
                      </li>
                    ))}
                  </ol>
                  {links.length > 0 && (
                    <div className="mt-6">
                      <p className="text-[0.95rem] font-semibold">Para ler com calma</p>
                      <ul className="mt-2 space-y-1.5">
                        {links.map((p) => (
                          <li key={p.slug}><Link href={`/blog/${p.slug}`} className="link">{p.title}</Link></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href={s.cta.href} className="btn btn-primario">{s.cta.label}</Link>
                    {s.extra && <Link href={s.extra.href} className="btn btn-secundario">{s.extra.label}</Link>}
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      </section>

      <section className="container-page mt-16">
        <div className="grid gap-8 rounded-[1.75rem] bg-salvia-funda p-8 text-linho md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
          <div>
            <h2 className="text-3xl md:text-4xl">Quando vale procurar um psicólogo?</h2>
            <p className="mt-4 text-linho/80">
              Não é preciso estar no limite. Vale considerar se a dor atrapalha o sono, o trabalho ou as relações há
              semanas, se a culpa ocupa seus pensamentos ou se você não tem com quem falar sobre a perda.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/psicologos" className="btn bg-linho text-salvia-noite hover:bg-white">Ver psicólogos disponíveis</Link>
            <Link href="/ajuda-imediata" className="text-center text-linho underline underline-offset-4">
              Pensando em tirar a própria vida? Ligue 188 (CVV)
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
