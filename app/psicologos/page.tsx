import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Icon, type IconName } from '@/components/icon'
import { SignupForm } from '@/components/forms'
import { PsychologistCard } from '@/components/featured-psychologists'
import { Faq } from '@/components/faq'
import { listDirectory, type DirectoryFilters } from '@/lib/directory'
import { UFS } from '@/lib/ufs'

export const metadata: Metadata = {
  title: { absolute: 'Psicólogos para Luto Pet: Encontre Apoio Emocional | PetApoio' },
  description:
    'Você não precisa enfrentar a perda do seu pet sozinho. Psicólogos com CRP conferido, sessões online e conteúdos de acolhimento para cada momento do luto.',
  alternates: { canonical: '/psicologos' },
}

const garantias = [
  ['Quem entende essa dor', 'Profissionais que informam experiência com luto e perda de animais. Você não precisa justificar por que está sofrendo.'],
  ['Registro conferido', 'Antes de entrar no ar, cada perfil tem o número e a situação no Conselho Regional de Psicologia verificados.'],
  ['Você escolhe com calma', 'Veja formação, abordagem, valor e horários livres antes de decidir. Sem ranking pago e sem pressa.'],
  ['Pagamento seguro', 'Pix ou cartão pelo Mercado Pago. Cancelou com 24 horas de antecedência? O valor volta para você.'],
]

const passos = [
  ['Escolha o profissional', 'Filtre por atendimento online, cidade, abordagem e valor.'],
  ['Escolha o horário', 'A agenda mostra só horários realmente livres.'],
  ['Pague com segurança', 'Pix ou cartão. A sessão é confirmada assim que o pagamento é aprovado.'],
  ['Converse no dia marcado', 'O link da videochamada aparece em "Minhas sessões". Não precisa instalar nada.'],
]

const faq = [
  {
    q: 'Faz sentido procurar terapia por causa de um animal?',
    a: 'Sim. O vínculo com um animal é real, e a perda pode afetar o sono, o trabalho e a forma como você se sente. Procurar ajuda não exige que a dor tenha um tamanho mínimo.',
  },
  {
    q: 'Como é a sessão online?',
    a: 'Depois do pagamento aprovado, o link da videochamada aparece em "Minhas sessões". Basta abrir no horário marcado, pelo celular ou computador, num lugar onde você se sinta à vontade.',
  },
  {
    q: 'Posso cancelar ou remarcar?',
    a: 'Pode cancelar em "Minhas sessões". Com pelo menos 24 horas de antecedência, o valor é devolvido integralmente pelo Mercado Pago. Para remarcar, cancele e escolha um novo horário.',
  },
  {
    q: 'Para quem vai o meu pagamento?',
    a: 'O valor da sessão vai direto para a conta do profissional no Mercado Pago. A PetApoio fica com uma comissão pela plataforma, já incluída no preço que você vê.',
  },
  {
    q: 'O que eu falar na sessão fica registrado na PetApoio?',
    a: 'Não. A conversa acontece entre você e o profissional, protegida pelo sigilo profissional. A PetApoio guarda apenas os dados do agendamento e do pagamento.',
  },
]

const momentos: [string, string][] = [
  ['Perdi meu cachorro ou gato', '/encontre-apoio#primeiros-dias'],
  ['Estou me preparando para uma despedida', '/encontre-apoio#por-onde-comecar'],
  ['Meu pet está doente e tenho medo de perdê-lo', '/encontre-apoio#por-onde-comecar'],
  ['Não consigo superar a saudade', '/encontre-apoio#com-o-tempo'],
  ['Sinto culpa ou não consigo aceitar a perda', '/encontre-apoio#com-o-tempo'],
  ['Quero ajudar alguém que perdeu um pet', '/encontre-apoio#apoiar-alguem'],
]

const solucoes: { icon: IconName; tom: string; titulo: string; texto: string; href: string; acao: string }[] = [
  { icon: 'users', tom: 'bg-salvia-clara text-salvia', titulo: 'Acompanhamento psicológico', texto: 'Psicólogos que informam trabalhar com luto, perda de animais e despedidas.', href: '#profissionais', acao: 'Ver profissionais' },
  { icon: 'book', tom: 'bg-nevoa-clara text-nevoa', titulo: 'Conteúdos de acolhimento', texto: 'Textos revisados para entender os sentimentos da perda, no seu tempo.', href: '/encontre-apoio', acao: 'Ler os conteúdos' },
  { icon: 'star', tom: 'bg-laranja-clara text-laranja', titulo: 'Memórias e homenagens', texto: 'Lembranças que ajudam a preservar a história que vocês viveram.', href: '/loja', acao: 'Conhecer as memórias' },
]

const temas: [string, string][] = [
  ['Como lidar com a perda de um pet?', '/encontre-apoio#primeiros-dias'],
  ['O luto pet é uma dor legítima?', '/encontre-apoio'],
  ['Como lidar com a culpa?', '/encontre-apoio#com-o-tempo'],
  ['Como explicar a perda para uma criança?', '/blog'],
  ['Como ajudar alguém que perdeu um animal?', '/encontre-apoio#apoiar-alguem'],
  ['Como lidar com a doença e a despedida?', '/encontre-apoio#por-onde-comecar'],
]

const Seta = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

export default async function PsicologosPage({ searchParams }: { searchParams: Promise<DirectoryFilters> }) {
  const filters = await searchParams
  const entries = await listDirectory(filters)
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <>
      {/* 1. Acolhimento */}
      <section className="relative overflow-hidden bg-[linear-gradient(110deg,#fff8f1_0%,#fbeee2_60%,#f6dcc4_100%)]">
        <div className="container-page grid items-center gap-10 pb-32 pt-10 md:pt-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="font-semibold text-salvia">Apoio emocional</p>
            <h1 className="mt-2 text-[2.6rem] leading-[1.05] text-salvia-funda md:text-[3.4rem]">Você não precisa enfrentar a perda do seu pet sozinho.</h1>
            <p className="mt-5 max-w-[50ch] text-lg text-grafite md:text-xl md:leading-relaxed">
              Perder um animal que fez parte da sua vida pode trazer uma dor profunda. Aqui você encontra acolhimento,
              informação e profissionais preparados para acompanhar você nesse momento.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#profissionais" className="btn btn-primario">Encontrar um psicólogo <Seta /></a>
              <a href="#como-ajudar" className="btn btn-secundario bg-white/60">Entender como podemos ajudar</a>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(120,60,10,.5)]">
            <Image src="/fotos/luto-mulher.webp" alt="Mulher pensativa, enrolada numa manta, olhando pela janela" fill priority sizes="(min-width: 1024px) 448px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* 2 e 3. Identificação e solução */}
      <section id="como-ajudar" className="container-page relative z-10 -mt-24 scroll-mt-24" aria-labelledby="titulo-como-ajudar">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(46,42,39,.45)] md:p-10">
          <h2 id="titulo-como-ajudar" className="text-center text-3xl md:text-4xl">Como podemos ajudar?</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {solucoes.map((s) => (
              <li key={s.titulo}>
                <Link href={s.href} className="group flex h-full flex-col items-center rounded-2xl border border-areia bg-linho px-5 py-7 text-center transition hover:-translate-y-0.5 hover:border-laranja hover:bg-white">
                  <span className={`flex size-14 items-center justify-center rounded-full ${s.tom}`}><Icon name={s.icon} className="size-7" /></span>
                  <span className="mt-4 font-serif text-lg font-extrabold">{s.titulo}</span>
                  <span className="mt-2 flex-1 text-[0.95rem] text-grafite-suave">{s.texto}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-laranja">{s.acao} <Seta /></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-areia pt-6">
            <p className="text-center font-semibold">Cada história de perda é única. Qual se parece mais com a sua?</p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {momentos.map(([t, href]) => (
                <li key={t}>
                  <Link href={href} className="inline-block rounded-full border border-areia-escura bg-white px-4 py-2 text-[0.95rem] hover:border-laranja hover:text-laranja">{t}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="profissionais" className="container-page scroll-mt-24 pt-16" aria-labelledby="titulo-profissionais">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="titulo-profissionais" className="text-3xl md:text-4xl">Encontre um profissional para conversar</h2>
            <p className="mt-2 text-grafite-suave">Compare formação, temas de atuação, modalidade e valor antes de decidir. Sem ranking pago.</p>
          </div>
          {entries && entries.length > 0 && (
            <p className="text-grafite-suave">
              {entries.length} {entries.length === 1 ? 'profissional' : 'profissionais'}
            </p>
          )}
        </div>

        <nav aria-label="Abordagens" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {['', 'TCC', 'Psicanálise', 'Humanista', 'Análise do comportamento'].map((a) => {
              const active = (filters.abordagem ?? '') === a
              return (
                <li key={a || 'todas'}>
                  <Link
                    href={a ? `/psicologos?abordagem=${encodeURIComponent(a)}#profissionais` : '/psicologos#profissionais'}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-block rounded-full px-4 py-2 text-[0.95rem] font-semibold ${active ? 'bg-salvia-funda text-white' : 'border border-areia-escura bg-white hover:border-laranja'}`}
                  >
                    {a || 'Todas as abordagens'}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <form method="get" className="mt-4 grid gap-4 rounded-2xl bg-linho-escuro p-5 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto] lg:items-end">
          <div>
            <label htmlFor="modalidade" className="rotulo">Atendimento</label>
            <select id="modalidade" name="modalidade" defaultValue={filters.modalidade ?? ''} className="campo">
              <option value="">Online ou presencial</option>
              <option value="online">Online</option>
              <option value="presencial">Presencial</option>
            </select>
          </div>
          <div>
            <label htmlFor="uf" className="rotulo">Estado</label>
            <select id="uf" name="uf" defaultValue={filters.uf ?? ''} className="campo">
              <option value="">Todos</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ate" className="rotulo">Valor por sessão</label>
            <select id="ate" name="ate" defaultValue={filters.ate ?? ''} className="campo">
              <option value="">Qualquer valor</option>
              <option value="120">Até R$ 120</option>
              <option value="180">Até R$ 180</option>
              <option value="250">Até R$ 250</option>
            </select>
          </div>
          <div>
            <label htmlFor="abordagem" className="rotulo">Abordagem</label>
            <input id="abordagem" name="abordagem" defaultValue={filters.abordagem ?? ''} placeholder="Ex.: TCC, psicanálise" className="campo" />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 sm:col-span-2 lg:col-span-4">
            {[
              ['pet', 'Informa experiência com luto pet'],
              ['criancas', 'Atende crianças'],
              ['familias', 'Atende famílias'],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-2">
                <input type="checkbox" name={name} value="1" defaultChecked={filters[name as keyof DirectoryFilters] === '1'} className="size-4 accent-salvia-funda" />
                {label}
              </label>
            ))}
          </div>
          <div className="flex gap-3 lg:row-start-1 lg:col-start-5">
            <button type="submit" className="btn btn-primario">Filtrar</button>
            {hasFilters && <Link href="/psicologos#profissionais" className="btn btn-secundario">Limpar</Link>}
          </div>
        </form>

        <div className="mt-8">
          {entries === null ? (
            <WaitingList text="A lista de profissionais está sendo preparada." />
          ) : entries.length === 0 ? (
            hasFilters ? (
              <div className="rounded-2xl border-[1.5px] border-dashed border-areia-escura p-8">
                <h3 className="text-2xl">Nenhum profissional com esses filtros</h3>
                <p className="mt-2 text-grafite-suave">Tente o atendimento online, que não depende da cidade, ou remova algum filtro.</p>
                <Link href="/psicologos#profissionais" className="btn btn-secundario mt-5">Ver todos os profissionais</Link>
              </div>
            ) : (
              <WaitingList text="Estamos conferindo o registro dos primeiros profissionais. Deixe seu e-mail e avisaremos assim que a agenda abrir." />
            )
          ) : (
            <>
            {entries.some((e) => e.slug?.startsWith('demo-')) && (
              <p role="note" className="mb-5 rounded-xl bg-[#f3e8cf] px-4 py-3 text-[#6b4f12]">
                <strong>Demonstração:</strong> estes perfis são exemplos para mostrar como a vitrine e o agendamento funcionam. Os profissionais reais aparecem aqui depois da verificação do CRP.
              </p>
            )}
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((e) => (
                <li key={e.id}>
                  <PsychologistCard entry={e} />
                </li>
              ))}
            </ul>
            </>
          )}
        </div>
      </section>

      <section className="container-page pt-20" aria-labelledby="por-que">
        <h2 id="por-que" className="text-3xl md:text-4xl">Conheça quem pode acompanhar você</h2>
        <p className="mt-2 max-w-[60ch] text-grafite-suave">Todo perfil mostra foto, nome e CRP, formação, temas de atuação, modalidade e valor da sessão, quando informados.</p>
        <dl className="mt-8 grid gap-x-10 gap-y-8 border-y border-areia py-10 sm:grid-cols-2 lg:grid-cols-4">
          {garantias.map(([t, d]) => (
            <div key={t}>
              <dt className="font-serif text-xl font-extrabold">{t}</dt>
              <dd className="mt-2 text-grafite-suave">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="como-funciona" className="container-page scroll-mt-24 pt-20" aria-labelledby="titulo-como">
        <h2 id="titulo-como" className="text-3xl md:text-4xl">Como funciona</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map(([t, d], i) => (
            <li key={t} className="border-t-2 border-salvia pt-5">
              <span className="text-sm font-semibold text-salvia-funda">Passo {i + 1}</span>
              <h3 className="mt-1 font-serif text-xl">{t}</h3>
              <p className="mt-2 text-grafite-suave">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 6. Educação */}
      <section className="container-page pt-20" aria-labelledby="titulo-temas">
        <h2 id="titulo-temas" className="text-3xl md:text-4xl">Você não está sozinho nessa experiência</h2>
        <p className="mt-2 max-w-[60ch] text-grafite-suave">Ainda não está pronto para conversar com alguém? Comece pelos conteúdos, revisados por psicólogas.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {temas.map(([t, href]) => (
            <li key={t}>
              <Link href={href} className="flex h-full items-center justify-between gap-4 rounded-2xl bg-white p-6 font-serif text-lg font-extrabold shadow-[0_18px_40px_-34px_rgba(46,42,39,.5)] hover:text-laranja">
                {t} <Seta />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Conversão final */}
      <section className="container-page pt-16" aria-labelledby="titulo-primeiro-passo">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-salvia-noite p-8 text-white md:flex-row md:items-center md:p-12">
          <div>
            <h2 id="titulo-primeiro-passo" className="text-3xl text-white md:text-4xl">Dar o primeiro passo também é uma forma de cuidado.</h2>
            <p className="mt-2 text-white/80">Estamos aqui para apoiar você, no seu tempo.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#profissionais" className="btn btn-primario">Encontrar um psicólogo <Seta /></a>
            <Link href="/encontre-apoio" className="btn border border-white/40 text-white hover:bg-white/10">Conteúdos de acolhimento</Link>
          </div>
        </div>
      </section>

      <section className="container-page pt-20" aria-labelledby="titulo-faq">
        <h2 id="titulo-faq" className="text-3xl md:text-4xl">Dúvidas sobre as sessões</h2>
        <div className="mt-6 max-w-3xl">
          <Faq items={faq} />
        </div>
      </section>

      <section className="container-page mt-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.75rem] bg-linho-escuro p-7 md:p-9">
            <h2 className="text-2xl md:text-3xl">Precisa de apoio gratuito?</h2>
            <p className="mt-3 text-grafite-suave">
              Pelo SUS, a Unidade Básica de Saúde do seu bairro orienta e encaminha para atendimento psicológico. Clínicas-escola de faculdades de psicologia também atendem a preço social.
            </p>
            <Link href="/ajuda-imediata" className="link mt-4 inline-block font-semibold">Ver outras formas de ajuda</Link>
          </div>
          <div className="rounded-[1.75rem] border-[1.5px] border-areia-escura p-7 md:p-9">
            <h2 className="text-2xl md:text-3xl">É psicóloga ou psicólogo?</h2>
            <p className="mt-3 text-grafite-suave">Atenda pessoas que procuram exatamente o seu cuidado, com agenda e pagamentos organizados.</p>
            <Link href="/seja-parceiro/psicologos" className="btn btn-secundario mt-5">Quero fazer parte</Link>
          </div>
        </div>
      </section>
    </>
  )
}

function WaitingList({ text }: { text: string }) {
  return (
    <div id="avise-me" className="scroll-mt-24 grid gap-6 rounded-[1.75rem] bg-areia/70 p-7 md:grid-cols-[1fr_1fr] md:p-10">
      <div>
        <h3 className="text-2xl md:text-3xl">A agenda abre em breve</h3>
        <p className="mt-3 text-grafite-suave">{text}</p>
      </div>
      <SignupForm list="psicologos" submitLabel="Avise-me" />
    </div>
  )
}
