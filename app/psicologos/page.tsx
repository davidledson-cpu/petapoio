import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { SignupForm } from '@/components/forms'
import { PsychologistCard } from '@/components/featured-psychologists'
import { Faq } from '@/components/faq'
import { listDirectory, type DirectoryFilters } from '@/lib/directory'
import { UFS } from '@/lib/ufs'

export const metadata: Metadata = {
  title: 'Psicólogos para o luto pet',
  description:
    'Converse com psicólogas e psicólogos que entendem a dor de perder um animal. CRP conferido, sessões online e pagamento seguro.',
  alternates: { canonical: '/psicologos' },
}

const garantias = [
  ['Quem entende essa dor', 'Profissionais com experiência em luto e na perda de animais. Você não vai precisar justificar por que está sofrendo.'],
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

export default async function PsicologosPage({ searchParams }: { searchParams: Promise<DirectoryFilters> }) {
  const filters = await searchParams
  const entries = await listDirectory(filters)
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <>
      <PageHeader
        title="Conversar com alguém que entende essa perda"
        intro="Quando os outros dizem que “era só um animal”, a dor fica mais solitária. Aqui você encontra psicólogas e psicólogos que levam esse vínculo a sério e sabem acompanhar o luto, no seu tempo."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#profissionais" className="btn btn-primario">Ver profissionais disponíveis</a>
          <a href="#como-funciona" className="btn btn-secundario">Como funciona</a>
        </div>
      </PageHeader>


      <section id="profissionais" className="container-page scroll-mt-24 pt-4" aria-labelledby="titulo-profissionais">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="titulo-profissionais" className="text-3xl md:text-4xl">Profissionais disponíveis</h2>
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
                    className={`inline-block rounded-full px-4 py-2 text-[0.95rem] font-semibold ${active ? 'bg-salvia-funda text-linho' : 'border border-areia-escura bg-white hover:border-salvia-funda'}`}
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
              ['pet', 'Experiência com luto pet'],
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
        <h2 id="por-que" className="sr-only">Por que conversar com um profissional da PetApoio</h2>
        <dl className="grid gap-x-10 gap-y-8 border-y border-areia py-10 sm:grid-cols-2 lg:grid-cols-4">
          {garantias.map(([t, d]) => (
            <div key={t}>
              <dt className="font-serif text-xl">{t}</dt>
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
            <Link href="/seja-parceiro" className="btn btn-secundario mt-5">Quero fazer parte</Link>
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
