import Link from 'next/link'
import { SupportRouter } from '@/components/support-router'
import { PostList } from '@/components/post-list'
import { SignupForm } from '@/components/forms'
import { FeaturedPsychologists } from '@/components/featured-psychologists'
import { StorePreview } from '@/components/store-preview'
import { Faq } from '@/components/faq'
import { Icon, type IconName } from '@/components/icon'
import { getPosts } from '@/lib/blog'

const confianca = [
  { icon: 'shield', text: 'Psicólogos com CRP conferido' },
  { icon: 'video', text: 'Sessões online, sem instalar nada' },
  { icon: 'card', text: 'Pix ou cartão com pagamento seguro' },
  { icon: 'heart', text: 'Experiência com luto pet' },
] as const

const servicos = [
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

const abordagens = [
  ['TCC', 'Trabalha a relação entre pensamentos, emoções e comportamentos. Ajuda com culpa e com a rotina depois da perda.'],
  ['Psicanálise', 'Escuta o que a perda mobiliza em você e na sua história, sem pressa e sem roteiro fixo.'],
  ['Humanista', 'Foco no acolhimento e na pessoa como um todo, valorizando o vínculo que existiu.'],
  ['Análise do comportamento', 'Estratégias práticas para reorganizar a rotina e lidar com os momentos mais difíceis.'],
]

const faq = [
  {
    q: 'É normal sofrer tanto pela morte de um animal?',
    a: 'Sim. Um animal faz parte da rotina, da casa e da forma como a gente se cuida. A intensidade da dor costuma acompanhar a força do vínculo, e ela não precisa de justificativa.',
  },
  {
    q: 'Como funciona a consulta online?',
    a: 'Depois do pagamento aprovado, o link da videochamada aparece em "Minhas sessões". É só abrir no horário marcado, pelo celular ou pelo computador.',
  },
  {
    q: 'Os psicólogos são verificados?',
    a: 'Sim. Antes de publicar um perfil, conferimos o número e a situação do registro no Conselho Regional de Psicologia e os documentos enviados.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'Pix ou cartão em até 6x pelo Mercado Pago. O valor vai direto para a conta do profissional, e a PetApoio retém uma comissão já incluída no preço.',
  },
  {
    q: 'Posso cancelar ou remarcar?',
    a: 'Pode cancelar em "Minhas sessões". Com 24 horas de antecedência, o valor volta integralmente. Para remarcar, cancele e escolha outro horário.',
  },
  {
    q: 'Meu pet ainda está vivo, mas doente. Posso usar a PetApoio?',
    a: 'Pode. O luto antecipatório, quando a perda é esperada, também dói. Há profissionais e conteúdos para esse momento.',
  },
  {
    q: 'A PetApoio atende emergências?',
    a: 'Não. Se você está em sofrimento intenso ou pensando em tirar a própria vida, ligue para o CVV (188), a qualquer hora, ou para o SAMU (192).',
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
              <Icon name="heart" className="size-4 text-salvia-clara" /> Você não precisa passar por isso sozinho
            </p>
            <h1 className="mt-6 text-[2.7rem] leading-[1.05] sm:text-6xl lg:text-[4.2rem]">
              Apoio para quem perdeu um amor de <span className="italic text-[#f3e3c3]">quatro patas</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg text-linho/85 md:text-xl md:leading-relaxed">
              Converse com psicólogos que entendem o luto pela perda de um animal. Sessões online, agendadas e pagas aqui
              mesmo, no conforto da sua casa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/psicologos" className="btn bg-linho !px-7 text-salvia-noite hover:bg-white">
                Encontrar um psicólogo
                <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <a href="#como-funciona" className="btn border border-white/40 text-linho hover:bg-white/10">Como funciona</a>
            </div>
            <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-[0.95rem] text-linho/85 sm:grid-cols-2">
              {confianca.map((c) => (
                <li key={c.text} className="flex items-center gap-2 pr-4">
                  <Icon name={c.icon} className="size-5 shrink-0 text-salvia-clara" />
                  {c.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div aria-hidden="true" className="absolute -left-10 -bottom-12 z-10 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 text-grafite shadow-xl md:flex">
              <span className="flex size-9 items-center justify-center rounded-xl bg-nevoa-clara text-nevoa"><Icon name="calendar" className="size-5" /></span>
              <span className="text-sm leading-tight"><b className="block">Agenda online</b><span className="text-grafite-suave">Horários livres em tempo real</span></span>
            </div>
            <div className="text-grafite [&>div]:!bg-linho-escuro [&>div]:shadow-2xl"><SupportRouter /></div>
            <div aria-hidden="true" className="absolute -right-4 -top-6 z-10 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 text-grafite shadow-xl md:flex">
              <span className="flex size-9 items-center justify-center rounded-xl bg-salvia-clara text-salvia-noite"><Icon name="shield" className="size-5" /></span>
              <span className="text-sm leading-tight"><b className="block">CRP conferido</b><span className="text-grafite-suave">em todos os perfis</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="bg-[#faf3ec] py-20" aria-labelledby="titulo-servicos">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-salvia-funda">Nossos serviços</p>
            <h2 id="titulo-servicos" className="mt-1 text-4xl md:text-5xl">Apoio em cada momento do luto</h2>
            <p className="mt-4 text-lg text-grafite-suave">Do primeiro dia à saudade que continua, escolha o caminho que faz sentido para você agora.</p>
          </div>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {servicos.map((s) => (
              <li key={s.titulo} className="relative flex flex-col rounded-2xl border border-areia bg-white p-8 shadow-[0_18px_40px_-32px_rgba(46,42,39,.5)]">
                <span className={`absolute right-6 top-6 rounded-full px-3 py-1 text-xs font-bold ${s.tom}`}>{s.selo}</span>
                <span className={`flex size-14 items-center justify-center rounded-2xl ${s.tom}`}><Icon name={s.icon} className="size-7" /></span>
                <h3 className="mt-6 font-sans text-xl font-bold">{s.titulo}</h3>
                <p className="mt-2 flex-1 text-grafite-suave">{s.texto}</p>
                <Link href={s.href} className="mt-6 inline-flex items-center gap-1.5 font-semibold text-salvia-funda hover:underline">
                  {s.acao}
                  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="scroll-mt-20 bg-nevoa-clara/60 py-20" aria-labelledby="titulo-como">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-salvia-funda">Como funciona</p>
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

      {/* Por que confiar (sem depoimentos inventados) */}
      <section className="container-page py-20" aria-labelledby="titulo-confianca">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="font-semibold text-salvia-funda">Por que a PetApoio</p>
            <h2 id="titulo-confianca" className="mt-1 text-4xl md:text-5xl">Cuidado sério para uma dor que é real</h2>
            <p className="mt-4 text-lg text-grafite-suave">
              Muita gente ouve que “era só um animal” e vive o luto em silêncio. Aqui essa perda é levada a sério, com
              profissionais preparados e regras claras.
            </p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ['shield', 'Registro conferido', 'Cada perfil passa por verificação do CRP e dos documentos antes de entrar no ar.'],
              ['scale', 'Sem ranking pago', 'A ordem dos profissionais não pode ser comprada. Você escolhe com informação clara.'],
              ['lock', 'Sigilo e LGPD', 'A conversa fica entre você e o profissional. Não pedimos relatos da sua perda.'],
              ['refresh', 'Cancelamento justo', 'Cancelou com 24 horas de antecedência? O valor volta integralmente.'],
            ].map(([icon, t, d]) => (
              <div key={t} className="rounded-2xl border border-areia bg-white p-6">
                <dt className="flex items-center gap-3 font-sans text-lg font-bold">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-salvia-clara text-salvia-noite"><Icon name={icon as IconName} className="size-5" /></span>
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

      {/* Para psicólogos */}
      <section className="container-page py-16" aria-labelledby="titulo-parceiros">
        <div className="grid gap-10 overflow-hidden rounded-[2rem] bg-salvia-noite p-8 text-linho md:p-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-semibold text-salvia-clara">Para psicólogos</p>
            <h2 id="titulo-parceiros" className="mt-1 text-4xl md:text-5xl">Atenda pela PetApoio</h2>
            <p className="mt-4 max-w-[52ch] text-lg text-linho/80">
              Pessoas que procuram exatamente o seu cuidado, com agenda, pagamento e repasse organizados. Você cuida do
              atendimento; a plataforma cuida do resto.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/seja-parceiro" className="btn bg-linho text-salvia-noite hover:bg-white">Cadastrar como profissional</Link>
              <Link href="/entrar?perfil=psicologo" className="btn border border-white/40 text-linho hover:bg-white/10">Já tenho cadastro</Link>
            </div>
          </div>
          <ul className="grid gap-3 self-center sm:grid-cols-2">
            {[
              ['calendar', 'Agenda online com horários e folgas'],
              ['card', 'Pagamento com split direto na sua conta'],
              ['user', 'Perfil verificado e bem apresentado'],
              ['chart', 'Painel com sessões e extrato'],
            ].map(([icon, t]) => (
              <li key={t} className="flex items-start gap-3 rounded-2xl bg-white/8 p-4">
                <Icon name={icon as IconName} className="mt-0.5 size-5 shrink-0 text-salvia-clara" />
                <span>{t}</span>
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
            <h2 className="text-3xl md:text-4xl">Textos de acolhimento no seu e-mail</h2>
            <p className="mt-4 text-linho/80">Um e-mail por semana, no máximo, com um texto revisado. Você cancela com um clique.</p>
          </div>
          <SignupForm list="newsletter" submitLabel="Quero receber" tone="escuro" />
        </div>
      </section>
    </>
  )
}

