import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { getPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Encontre apoio',
  description:
    'Orientações para quem acabou de perder um pet, para quem convive com a saudade e para quem quer apoiar alguém em luto.',
  alternates: { canonical: '/encontre-apoio' },
}

export default function EncontreApoioPage() {
  const posts = getPosts()
  const leitura = (slug: string) => posts.find((p) => p.slug === slug)

  const secoes = [
    {
      id: 'primeiros-dias',
      atalho: 'Acabei de perder',
      titulo: 'Se você acabou de perder seu pet',
      paragrafos: [
        'Nos primeiros dias, é comum sentir um vazio físico, ter dificuldade para dormir ou comer, esperar ouvir o barulho dele pela casa. Nada disso significa que você está exagerando.',
        'Por agora, cuide do básico: beber água, comer alguma coisa, descansar quando der. Decisões sobre os pertences, um novo animal ou uma homenagem podem esperar.',
        'Procure alguém que conheceu seu pet ou que entende essa perda. Se ninguém por perto entender, conversar com uma psicóloga ou um psicólogo pode ser um espaço seguro.',
      ],
      leituras: ['perdi-meu-cachorro', 'culpa-depois-da-morte-do-pet'],
    },
    {
      id: 'com-o-tempo',
      atalho: 'A saudade continua',
      titulo: 'Se já faz um tempo, e a saudade continua',
      paragrafos: [
        'O luto não segue um calendário. A saudade pode voltar com força em um aniversário, em uma música ou sem motivo aparente, mesmo depois de meses.',
        'Muitas pessoas encontram conforto em manter um vínculo com a lembrança: uma foto em um lugar especial, uma carta, um pequeno ritual em datas importantes.',
        'Se a dor continua impedindo você de trabalhar, dormir ou se relacionar, vale buscar acompanhamento psicológico. Isso não é sinal de fraqueza.',
      ],
      leituras: [],
    },
    {
      id: 'apoiar-alguem',
      atalho: 'Apoiar alguém',
      titulo: 'Se você quer apoiar alguém que perdeu',
      paragrafos: [
        'Reconheça a perda pelo nome: "sinto muito pela Mel" costuma acolher mais do que frases gerais.',
        'Evite comparações e pressa. Frases como "era só um bicho" ou "adota outro" podem fazer a pessoa se sentir sozinha.',
        'Ofereça ajuda concreta, como levar uma refeição ou fazer companhia, e continue presente nas semanas seguintes, quando a maioria das pessoas já seguiu a vida.',
      ],
      leituras: ['explicar-morte-do-pet-para-crianca'],
    },
  ]

  return (
    <>
      <PageHeader
        title="Encontre apoio"
        intro="Escolha o que mais se parece com o seu momento. Não há ordem certa nem tempo certo para ler."
      >
        <nav aria-label="Nesta página" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {secoes.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-block rounded-full bg-areia px-4 py-2 hover:bg-areia-escura">
                  {s.atalho}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="container-page space-y-6">
        {secoes.map((s) => {
          const links = s.leituras.map(leitura).filter((p) => p !== undefined)
          return (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-24 grid gap-8 rounded-[1.75rem] bg-linho-escuro p-7 md:grid-cols-[1fr_1.4fr] md:p-12"
            >
              <h2 className="text-3xl md:text-4xl">{s.titulo}</h2>
              <div className="space-y-4 text-lg text-grafite-suave">
                {s.paragrafos.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {links.length > 0 && (
                  <div className="pt-2">
                    <p className="text-base font-semibold text-grafite">Para ler com calma</p>
                    <ul className="mt-2 space-y-1.5">
                      {links.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/blog/${p.slug}`} className="link">{p.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>

      <section className="container-page mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.75rem] border-[1.5px] border-areia-escura p-8">
          <h2 className="text-3xl">Quer conversar com um profissional?</h2>
          <p className="mt-3 text-grafite-suave">Veja como o PetApoio vai conectar você a psicólogas e psicólogos com experiência em luto.</p>
          <Link href="/psicologos" className="btn btn-primario mt-6">Conhecer o apoio psicológico</Link>
        </div>
        <div className="rounded-[1.75rem] border-[1.5px] border-areia-escura p-8">
          <h2 className="text-3xl">Está difícil demais agora?</h2>
          <p className="mt-3 text-grafite-suave">O CVV atende 24 horas pelo 188. Em uma emergência, ligue para o SAMU (192).</p>
          <Link href="/ajuda-imediata" className="btn btn-secundario mt-6">Ver ajuda imediata</Link>
        </div>
      </section>
    </>
  )
}
