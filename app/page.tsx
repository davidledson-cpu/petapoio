import Link from 'next/link'
import { SupportRouter } from '@/components/support-router'
import { PostList } from '@/components/post-list'
import { SignupForm } from '@/components/forms'
import { getPosts } from '@/lib/blog'

const pilares = [
  {
    nome: 'Acolhimento',
    texto: 'Textos revisados por psicólogas e psicólogos para entender o luto, sem prazos nem fórmulas.',
    href: '/encontre-apoio',
    acao: 'Começar a ler',
    status: 'Disponível',
  },
  {
    nome: 'Apoio psicológico',
    texto: 'Profissionais com experiência em luto e registro no CRP conferido, para atendimento online ou presencial.',
    href: '/psicologos',
    acao: 'Saber como vai funcionar',
    status: 'Em formação',
  },
  {
    nome: 'Memórias',
    texto: 'Lembranças e homenagens feitas com cuidado, para quem quer guardar uma parte dessa história.',
    href: '/loja',
    acao: 'Ser avisado da abertura',
    status: 'Em preparação',
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
            Se você perdeu seu companheiro, aqui é um lugar para entender o que está sentindo, encontrar orientação e
            descobrir caminhos de cuidado. No seu tempo.
          </p>
        </div>
        <SupportRouter />
      </section>

      <section className="border-t border-areia bg-linho-escuro py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl">Você não precisa passar por isso sozinho</h2>
            <p className="mt-4 text-lg text-grafite-suave">
              Perder um animal é perder uma companhia, uma rotina e um jeito de estar no mundo. O PetApoio reúne três
              formas de apoio, e estamos construindo cada uma com calma.
            </p>
          </div>
          <dl className="mt-12 divide-y divide-areia-escura/60 border-y border-areia-escura/60">
            {pilares.map((p) => (
              <div key={p.nome} className="grid gap-3 py-7 md:grid-cols-[14rem_1fr_auto] md:items-baseline md:gap-10">
                <dt className="font-serif text-[1.7rem]">{p.nome}</dt>
                <dd className="max-w-[56ch] text-grafite-suave">
                  {p.texto}
                  <span className="mt-2 block text-sm text-salvia-funda">{p.status}</span>
                </dd>
                <dd>
                  <Link href={p.href} className="link whitespace-nowrap font-semibold">{p.acao}</Link>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page grid gap-10 py-20 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-4xl md:text-[2.9rem] md:leading-tight">Conversar com alguém preparado pode ajudar</h2>
        </div>
        <div className="space-y-5 text-lg text-grafite-suave">
          <p>
            Não é preciso estar no limite para procurar uma psicóloga ou um psicólogo. Às vezes, ter um espaço para
            falar sobre a perda, sem precisar se justificar, já faz diferença.
          </p>
          <p>
            Estamos reunindo profissionais com experiência em luto. Cada perfil terá o registro no CRP conferido antes de
            ser publicado, sem rankings pagos nem depoimentos de pacientes.
          </p>
          <Link href="/psicologos" className="btn btn-primario">Ver como vai funcionar</Link>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="container-page py-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-4xl">Para entender o luto</h2>
            <Link href="/blog" className="link font-semibold">Todos os textos</Link>
          </div>
          <PostList posts={posts} />
        </section>
      )}

      <section className="container-page py-20">
        <div className="grid gap-10 rounded-[1.75rem] bg-salvia-funda p-8 text-linho md:grid-cols-[1.2fr_1fr] md:p-14">
          <div>
            <h2 className="text-3xl md:text-4xl">Textos de acolhimento no seu e-mail</h2>
            <p className="mt-4 text-linho/80">
              Um e-mail por semana, no máximo, com um texto revisado. Sem promoções escondidas. Você cancela com um
              clique.
            </p>
          </div>
          <SignupForm list="newsletter" submitLabel="Quero receber" tone="escuro" />
        </div>
      </section>

      <section className="container-page">
        <div className="flex flex-col gap-6 border-t border-areia pt-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl">Você é psicóloga ou psicólogo e trabalha com luto?</h2>
            <p className="mt-3 text-grafite-suave">
              Faça seu pré-cadastro para participar dos primeiros perfis verificados do PetApoio.
            </p>
          </div>
          <Link href="/seja-parceiro" className="btn btn-secundario shrink-0">Fazer pré-cadastro</Link>
        </div>
      </section>
    </>
  )
}
