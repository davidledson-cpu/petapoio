import Link from 'next/link'
import { SupportRouter } from '@/components/support-router'
import { PostList } from '@/components/post-list'
import { SignupForm } from '@/components/forms'
import { FeaturedPsychologists } from '@/components/featured-psychologists'
import { StorePreview } from '@/components/store-preview'
import { Faq } from '@/components/faq'
import { Icon, type IconName } from '@/components/icon'
import { getPosts } from '@/lib/blog'
import { PROFISSOES } from '@/lib/profissionais'

const Seta = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const confianca: { icon: IconName; text: string }[] = [
  { icon: 'shield', text: 'Profissionais verificados' },
  { icon: 'card', text: 'Preço total à vista' },
  { icon: 'scale', text: 'Sem ranking pago' },
  { icon: 'lock', text: 'Seus dados protegidos' },
]

/** Atalhos do topo: a pessoa escolhe o que precisa agora, em qualquer frente. */
const atalhos = [
  { href: '/encontre-apoio', titulo: 'Perdi meu pet e preciso de apoio', texto: 'Acolhimento, orientação e psicólogos.' },
  { href: '/cuida', titulo: 'Preciso de alguém para cuidar dele', texto: 'Cuidadores verificados perto de casa.' },
  { href: '/saude', titulo: 'Quero cuidar da saúde dele', texto: 'Carteira grátis e planos com parceiros.' },
  { href: '/loja', titulo: 'Quero guardar uma lembrança', texto: 'Homenagens feitas sob encomenda.' },
]

const frentes: {
  icon: IconName
  marca: string
  titulo: string
  para: string
  selo: string
  itens: string[]
  href: string
  acao: string
}[] = [
  {
    icon: 'heart',
    marca: 'PetApoio Acolhe',
    titulo: 'Apoio no luto',
    para: 'Para quem perdeu um pet, está perto da despedida ou quer apoiar alguém.',
    selo: 'Disponível',
    itens: ['Psicólogos com CRP conferido, em sessões online', 'Conteúdos gratuitos revisados por psicólogas', 'Lembranças e homenagens sob encomenda'],
    href: '/encontre-apoio',
    acao: 'Encontrar apoio',
  },
  {
    icon: 'paw',
    marca: 'PetApoio Cuida',
    titulo: 'Cuidado no dia a dia',
    para: 'Para a rotina, as viagens e a educação do seu pet, com gente de confiança.',
    selo: 'Piloto em BH',
    itens: ['Hospedagem, visitas, passeios e creche', 'Adestradores que usam só reforço positivo', 'Nível de verificação e preço total no perfil'],
    href: '/cuida',
    acao: 'Encontrar cuidador',
  },
  {
    icon: 'plus',
    marca: 'PetApoio Saúde',
    titulo: 'Saúde e proteção',
    para: 'Para prevenir, se proteger dos imprevistos e não decidir tudo na hora mais difícil.',
    selo: 'Pré-lançamento',
    itens: ['Carteira digital grátis com vacinas e lembretes', 'Planos Saúde, Protege e Despedida com parceiros', 'Coberturas, carências e limites em linguagem clara'],
    href: '/saude',
    acao: 'Conhecer os planos',
  },
]

const momentos: { titulo: string; texto: string; links: [string, string][] }[] = [
  {
    titulo: 'Quando ele chega',
    texto: 'Vacinas em dia, primeiros hábitos e uma rotina que funcione para a família.',
    links: [['Carteira de saúde', '/saude'], ['Adestramento', '/cuida#aviso']],
  },
  {
    titulo: 'Na rotina e nas viagens',
    texto: 'Alguém de confiança para passear, visitar ou hospedar quando você não pode estar.',
    links: [['Cuidadores', '/cuida']],
  },
  {
    titulo: 'Nos imprevistos',
    texto: 'Consultas, exames e emergências com regras claras, sem surpresa no contrato.',
    links: [['Planos de saúde', '/saude#planos']],
  },
  {
    titulo: 'Na despedida',
    texto: 'Apoio no luto antecipatório e uma despedida digna, já combinada.',
    links: [['Plano Despedida', '/saude#planos'], ['Psicólogos', '/psicologos']],
  },
  {
    titulo: 'Quando a saudade fica',
    texto: 'Conversa com quem entende, textos para ler no seu tempo e lembranças para guardar.',
    links: [['Encontre apoio', '/encontre-apoio'], ['Lembranças', '/loja']],
  },
]

const servicosLuto = [
  {
    icon: 'video',
    titulo: 'Consulta online individual',
    texto: 'Sessões por vídeo com psicólogos que acompanham o luto pela perda de animais. Você escolhe o horário e conversa de casa.',
    href: '/psicologos',
    acao: 'Agendar consulta',
    selo: 'Disponível',
    tom: 'bg-nevoa-clara text-nevoa',
  },
  {
    icon: 'users',
    titulo: 'Grupos de apoio',
    texto: 'Encontros online mediados por profissionais, para dividir a saudade com quem vive a mesma experiência.',
    href: '#newsletter',
    acao: 'Quero ser avisado',
    selo: 'Em breve',
    tom: 'bg-salvia-clara text-salvia-noite',
  },
  {
    icon: 'book',
    titulo: 'Conteúdo e orientação',
    texto: 'Textos revisados por psicólogas sobre culpa, saudade, crianças e datas difíceis. Gratuitos, para ler no seu tempo.',
    href: '/encontre-apoio',
    acao: 'Explorar conteúdos',
    selo: 'Gratuito',
    tom: 'bg-areia text-grafite',
  },
] as const

const passos = [
  ['Escolha o profissional', 'Veja abordagem, experiência, valor e horários livres. Filtre por atendimento online, cidade e preço.'],
  ['Escolha o horário', 'A agenda mostra só horários realmente livres. O horário fica reservado enquanto você paga.'],
  ['Pague com segurança', 'Pix ou cartão em até 6x pelo Mercado Pago. A sessão é confirmada assim que o pagamento é aprovado.'],
  ['Converse no dia marcado', 'O link da sala aparece em "Minhas sessões". Abre no celular ou no computador, sem instalar nada.'],
]

const principios: [IconName, string, string][] = [
  ['shield', 'Verificação antes de publicar', 'Psicólogos têm o CRP conferido. Cuidadores e adestradores passam por quatro níveis de verificação.'],
  ['scale', 'Sem ranking pago', 'Ninguém compra posição na busca. Você escolhe com informação clara.'],
  ['card', 'Preço e regras à vista', 'Valor total, cancelamento e coberturas aparecem antes de você decidir.'],
  ['paw', 'Bem-estar animal', 'Adestramento só com reforço positivo. Cuidadores não fazem atos veterinários.'],
  ['users', 'Parceiros habilitados', 'Planos e seguros são operados por empresas autorizadas, com contrato próprio.'],
  ['lock', 'Sigilo e LGPD', 'Pedimos só o necessário. Os dados de saúde do seu pet só você vê.'],
]

const abordagens = [
  ['TCC', 'Trabalha a relação entre pensamentos, emoções e comportamentos. Ajuda com culpa e com a rotina depois da perda.'],
  ['Psicanálise', 'Escuta o que a perda mobiliza em você e na sua história, sem pressa e sem roteiro fixo.'],
  ['Humanista', 'Foco no acolhimento e na pessoa como um todo, valorizando o vínculo que existiu.'],
  ['Análise do comportamento', 'Estratégias práticas para reorganizar a rotina e lidar com os momentos mais difíceis.'],
]

const faq = [
  {
    q: 'O que é a PetApoio?',
    a: 'Uma plataforma de cuidado para tutores e seus pets, em três frentes: Acolhe (apoio no luto, psicólogos e lembranças), Cuida (cuidadores e adestradores perto de casa) e Saúde (carteira digital e planos com parceiros).',
  },
  {
    q: 'A PetApoio é só para quem perdeu um pet?',
    a: 'Não. O acolhimento no luto é a nossa origem e continua no centro, mas a PetApoio também ajuda na rotina, na saúde e nos imprevistos, durante toda a vida do seu pet.',
  },
  {
    q: 'É normal sofrer tanto pela morte de um animal?',
    a: 'Sim. Um animal faz parte da rotina, da casa e da forma como a gente se cuida. A intensidade da dor costuma acompanhar a força do vínculo, e ela não precisa de justificativa.',
  },
  {
    q: 'Como os profissionais são verificados?',
    a: 'Psicólogos têm o registro no CRP e os documentos conferidos antes de aparecer. Cuidadores e adestradores passam por verificação de identidade, conversa com a equipe e referências, e o nível de cada um aparece no perfil.',
  },
  {
    q: 'Onde funciona a PetApoio Cuida?',
    a: 'Começamos por Belo Horizonte e Nova Lima, com reservas acompanhadas pela equipe. Se o seu bairro ainda não aparece, deixe o e-mail na página do Cuida e avisamos.',
  },
  {
    q: 'A PetApoio é plano de saúde ou seguradora?',
    a: 'Não. Os planos levam a marca PetApoio, mas são operados por empresas especializadas, com contrato próprio. A PetApoio cuida do seu atendimento, da carteira digital e do acolhimento.',
  },
  {
    q: 'Como funciona o pagamento das consultas?',
    a: 'Pix ou cartão em até 6x pelo Mercado Pago. O valor vai direto para a conta do profissional, e a PetApoio retém uma comissão já incluída no preço. Cancelando com 24 horas de antecedência, o valor volta integralmente.',
  },
  {
    q: 'A PetApoio atende emergências?',
    a: 'Não. Se você está em sofrimento intenso ou pensando em tirar a própria vida, ligue para o CVV (188), a qualquer hora, ou para o SAMU (192). Em emergências com o seu pet, procure um hospital veterinário 24h.',
  },
]

export default function HomePage() {
  const posts = getPosts().slice(0, 3)

  return (
    <>
      {/* Abertura */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,#5d7381_0%,#3e5a4b_45%,#2f4639_100%)] text-linho">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-white/5" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-32 size-[28rem] rounded-full bg-white/5" />
        <div className="container-page relative grid items-center gap-12 pb-20 pt-14 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.95rem]">
              <Icon name="heart" className="size-4 text-salvia-clara" /> Cuidado, apoio e acolhimento
            </p>
            <h1 className="mt-6 text-[2.7rem] leading-[1.05] sm:text-6xl lg:text-[4.2rem]">
              Ao seu lado em <span className="italic text-[#f3e3c3]">cada fase</span> da vida do seu pet
            </h1>
            <p className="mt-6 max-w-[54ch] text-lg text-linho/85 md:text-xl md:leading-relaxed">
              Na rotina, nos imprevistos e na despedida. Aqui você encontra profissionais verificados, planos com regras
              claras e acolhimento de verdade quando a saudade chega.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#frentes" className="btn bg-linho !px-7 text-salvia-noite hover:bg-white">
                Ver como podemos ajudar <Seta size={18} />
              </a>
              <Link href="/encontre-apoio" className="btn border border-white/40 text-linho hover:bg-white/10">Preciso de apoio no luto</Link>
            </div>
            <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-[0.95rem] text-linho/85">
              {confianca.map((c) => (
                <li key={c.text} className="flex items-center gap-2 pr-4">
                  <Icon name={c.icon} className="size-5 shrink-0 text-salvia-clara" />
                  {c.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] bg-linho-escuro p-3 text-grafite shadow-2xl sm:p-4">
            <h2 className="px-3 pb-3 pt-2 font-serif text-[1.65rem] sm:px-4">Do que você precisa agora?</h2>
            <ul className="space-y-2">
              {atalhos.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="group flex items-center justify-between gap-4 rounded-2xl bg-linho px-5 py-4 transition-colors hover:bg-white">
                    <span>
                      <span className="block font-semibold">{a.titulo}</span>
                      <span className="mt-0.5 block text-[0.95rem] text-grafite-suave">{a.texto}</span>
                    </span>
                    <span className="shrink-0 text-salvia transition-transform group-hover:translate-x-0.5"><Seta size={18} /></span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/ajuda-imediata" className="group flex items-center justify-between gap-4 rounded-2xl bg-salvia-noite px-5 py-4 text-linho transition-colors hover:bg-salvia-funda">
                  <span>
                    <span className="block font-semibold">Está difícil demais agora</span>
                    <span className="mt-0.5 block text-[0.95rem] text-linho/80">Onde encontrar ajuda imediata, a qualquer hora.</span>
                  </span>
                  <span className="shrink-0 text-salvia-clara"><Seta size={18} /></span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* As três frentes */}
      <section id="frentes" className="scroll-mt-20 bg-[#faf3ec] py-20" aria-labelledby="titulo-frentes">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-salvia-funda">O que a PetApoio faz</p>
            <h2 id="titulo-frentes" className="mt-1 text-4xl md:text-5xl">Três frentes, o mesmo cuidado</h2>
            <p className="mt-4 text-lg text-grafite-suave">
              Apoio emocional, cuidado no dia a dia e saúde do seu pet, com as mesmas regras de confiança em todas elas.
            </p>
          </div>
          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {frentes.map((f) => (
              <li key={f.marca} className="relative flex flex-col rounded-2xl border border-areia bg-white p-8 shadow-[0_18px_40px_-32px_rgba(46,42,39,.5)]">
                <span className="absolute right-6 top-6 rounded-full bg-nevoa-clara px-3 py-1 text-xs font-bold text-nevoa">{f.selo}</span>
                <span className="flex size-14 items-center justify-center rounded-2xl bg-salvia-clara text-salvia-noite"><Icon name={f.icon} className="size-7" /></span>
                <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-salvia-funda">{f.marca}</p>
                <h3 className="mt-1 font-serif text-3xl">{f.titulo}</h3>
                <p className="mt-2 text-grafite-suave">{f.para}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {f.itens.map((i) => (
                    <li key={i} className="flex gap-2.5">
                      <Icon name="check" className="mt-1 size-4 shrink-0 text-salvia-funda" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <Link href={f.href} className="btn btn-secundario mt-7 w-full">{f.acao}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Momentos da vida */}
      <section className="container-page py-20" aria-labelledby="titulo-momentos">
        <div className="max-w-2xl">
          <p className="font-semibold text-salvia-funda">Para cada momento</p>
          <h2 id="titulo-momentos" className="mt-1 text-4xl md:text-5xl">Da chegada à saudade, você não fica sozinho</h2>
          <p className="mt-4 text-lg text-grafite-suave">A vida com um pet muda com o tempo. O tipo de cuidado também.</p>
        </div>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {momentos.map((m, i) => (
            <li key={m.titulo} className="flex flex-col rounded-2xl bg-linho-escuro p-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-salvia-funda text-sm font-bold text-linho">{i + 1}</span>
              <h3 className="mt-4 font-sans text-lg font-bold">{m.titulo}</h3>
              <p className="mt-2 flex-1 text-[0.97rem] text-grafite-suave">{m.texto}</p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                {m.links.map(([l, href]) => (
                  <Link key={href + l} href={href} className="text-[0.95rem] font-semibold text-salvia-funda hover:underline">{l}</Link>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Acolhe: apoio no luto */}
      <section className="bg-nevoa-clara/60 py-20" aria-labelledby="titulo-luto">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <p className="font-semibold text-salvia-funda">PetApoio Acolhe</p>
            <h2 id="titulo-luto" className="mt-1 text-4xl md:text-5xl">Quando a perda chega, o cuidado é com você</h2>
            <p className="mt-4 max-w-[56ch] text-lg text-grafite-suave">
              Muita gente ouve que “era só um animal” e vive o luto em silêncio. Aqui essa dor é levada a sério, do primeiro
              dia à saudade que continua.
            </p>
            <ul className="mt-8 grid gap-4">
              {servicosLuto.map((s) => (
                <li key={s.titulo} className="flex gap-4 rounded-2xl bg-white p-6">
                  <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${s.tom}`}><Icon name={s.icon} className="size-6" /></span>
                  <div>
                    <h3 className="font-sans text-lg font-bold">
                      {s.titulo} <span className={`ml-2 rounded-full px-2.5 py-0.5 align-middle text-xs font-bold ${s.tom}`}>{s.selo}</span>
                    </h3>
                    <p className="mt-1 text-grafite-suave">{s.texto}</p>
                    <Link href={s.href} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-salvia-funda hover:underline">
                      {s.acao} <Seta />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <SupportRouter />
        </div>
      </section>

      {/* Como funciona a consulta */}
      <section id="como-funciona" className="scroll-mt-20 py-20" aria-labelledby="titulo-como">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-salvia-funda">Consulta com psicólogo</p>
            <h2 id="titulo-como" className="mt-1 text-4xl md:text-5xl">Começar é simples</h2>
            <p className="mt-4 text-lg text-grafite-suave">Da escolha do profissional à primeira conversa em poucos minutos.</p>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {passos.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-white p-7 shadow-[0_18px_40px_-34px_rgba(46,42,39,.5)]">
                <span className="flex size-11 items-center justify-center rounded-full bg-salvia-funda font-sans text-lg font-bold text-linho">{i + 1}</span>
                <h3 className="mt-5 font-sans text-lg font-bold">{t}</h3>
                <p className="mt-2 text-grafite-suave">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link href="/psicologos" className="btn btn-primario !px-8">Ver horários disponíveis</Link>
          </div>
        </div>
      </section>

      <FeaturedPsychologists />

      {/* Princípios que valem para todas as frentes */}
      <section className="container-page py-20" aria-labelledby="titulo-confianca">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-center">
          <div>
            <p className="font-semibold text-salvia-funda">Por que confiar</p>
            <h2 id="titulo-confianca" className="mt-1 text-4xl md:text-5xl">As mesmas regras em tudo o que fazemos</h2>
            <p className="mt-4 text-lg text-grafite-suave">
              Seja uma consulta, uma hospedagem ou um plano, você sabe quem está do outro lado, quanto paga e o que está
              combinado.
            </p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {principios.map(([icon, t, d]) => (
              <div key={t} className="rounded-2xl border border-areia bg-white p-6">
                <dt className="flex items-center gap-3 font-sans text-lg font-bold">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-salvia-clara text-salvia-noite"><Icon name={icon} className="size-5" /></span>
                  {t}
                </dt>
                <dd className="mt-3 text-grafite-suave">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <StorePreview />

      {/* Abordagens */}
      <section className="bg-linho-escuro py-20" aria-labelledby="titulo-abordagens">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="font-semibold text-salvia-funda">Abordagens terapêuticas</p>
            <h2 id="titulo-abordagens" className="mt-1 text-4xl md:text-5xl">Encontre o jeito de cuidar que combina com você</h2>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {abordagens.map(([t = '', d]) => (
              <li key={t} className="flex flex-col rounded-2xl bg-white p-6 shadow-[0_18px_40px_-34px_rgba(46,42,39,.5)]">
                <h3 className="font-sans text-lg font-bold">{t}</h3>
                <p className="mt-2 flex-1 text-grafite-suave">{d}</p>
                <Link href={`/psicologos?abordagem=${encodeURIComponent(t)}#profissionais`} className="mt-4 font-semibold text-salvia-funda hover:underline">
                  Ver profissionais
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="container-page py-16" aria-labelledby="titulo-blog">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="titulo-blog" className="text-4xl">Para entender o luto</h2>
            <Link href="/blog" className="link font-semibold">Todos os textos</Link>
          </div>
          <PostList posts={posts} />
        </section>
      )}

      {/* Para profissionais */}
      <section className="container-page py-16" aria-labelledby="titulo-parceiros">
        <div className="rounded-[2rem] bg-salvia-noite p-8 text-linho md:p-14">
          <div className="max-w-2xl">
            <p className="font-semibold text-salvia-clara">Para profissionais</p>
            <h2 id="titulo-parceiros" className="mt-1 text-4xl md:text-5xl">Cuide com a gente</h2>
            <p className="mt-4 text-lg text-linho/80">
              Tutores que procuram exatamente o seu trabalho, com agenda, pagamento e regras organizados. Você cuida; a
              plataforma cuida do resto.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {PROFISSOES.map((p) => (
              <li key={p.id}>
                <Link href={p.href} className="group flex h-full flex-col rounded-2xl bg-white/8 p-6 transition-colors hover:bg-white/12">
                  <span className="text-sm font-semibold text-salvia-clara">{p.selo}</span>
                  <span className="mt-1 font-serif text-2xl">{p.titulo}</span>
                  <span className="mt-2 flex-1 text-linho/80">{p.resumo}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-semibold">{p.menu} <Seta /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-16" aria-labelledby="titulo-faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="font-semibold text-salvia-funda">Perguntas frequentes</p>
            <h2 id="titulo-faq" className="mt-1 text-4xl">Tire suas dúvidas</h2>
            <p className="mt-4 text-grafite-suave">Não achou o que procurava? Escreva para <a className="link" href="mailto:contato@petapoio.com.br">contato@petapoio.com.br</a>.</p>
          </div>
          <Faq items={faq} />
        </div>
      </section>

      <section id="newsletter" className="container-page scroll-mt-24 py-8">
        <div className="grid gap-10 rounded-[2rem] bg-salvia-funda p-8 text-linho md:grid-cols-[1.2fr_1fr] md:p-14">
          <div>
            <h2 className="text-3xl md:text-4xl">Cuidado e acolhimento no seu e-mail</h2>
            <p className="mt-4 text-linho/80">
              No máximo um e-mail por semana: um texto revisado, novidades da PetApoio e avisos de quando o Cuida e a Saúde
              chegarem perto de você. Cancela com um clique.
            </p>
          </div>
          <SignupForm list="newsletter" submitLabel="Quero receber" tone="escuro" />
        </div>
      </section>
    </>
  )
}
