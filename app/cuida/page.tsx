import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon, type IconName } from '@/components/icon'
import { SignupForm } from '@/components/forms'
import { Faq } from '@/components/faq'
import { CaregiverCard } from '@/components/cuida/caregiver-card'
import { AreaMap } from '@/components/cuida/area-map'
import { careFeePercent, listCaregivers, type CaregiverFilters } from '@/lib/cuida'
import { LEVELS, NEIGHBORHOOD_NAMES, PILOT_CITY, SERVICES, SIZES, SPECIES, type CareService } from '@/lib/cuida-shared'

export const metadata: Metadata = {
  title: 'PetApoio Cuida · Cuidadores de pets perto de você',
  description:
    'Hospedagem domiciliar, visitas, passeios e creche com cuidadores verificados no seu bairro. Piloto em Belo Horizonte.',
  alternates: { canonical: '/cuida' },
}

const SERVICE_ICON: Record<CareService, IconName> = {
  hospedagem: 'home',
  visita: 'heart',
  passeio: 'walk',
  creche: 'sun',
  especiais: 'pill',
}

const seguranca: [IconName, string, string][] = [
  ['shield', 'Identidade verificada', 'Ninguém entra na busca sem conferência de documento, contato e endereço.'],
  ['calendar', 'Check-in e check-out', 'Entrega e retirada registradas, com fotos e atualizações durante a estadia.'],
  ['bell', 'Contato de emergência', 'Ficha do pet com vacinas, alimentação, remédios prescritos e quem chamar.'],
  ['card', 'Preço transparente', 'Você vê o valor total antes de pedir. O cuidador sabe quanto recebe antes de aceitar.'],
]

const passos = [
  ['Busque no seu bairro', 'Filtre por serviço, porte, espécie, preço e nível de verificação.'],
  ['Conheça o cuidador', 'Veja experiência, regras da casa e preços. Se quiser, peça uma visita antes.'],
  ['Envie a solicitação', 'Escolha as datas. A equipe PetApoio confirma a disponibilidade com o cuidador.'],
  ['Acompanhe a estadia', 'Receba fotos e atualizações. Depois, avalie por critérios, não só com estrelas.'],
]

const faq = [
  {
    q: 'Onde o PetApoio Cuida funciona?',
    a: `Estamos em fase-piloto em ${PILOT_CITY}, bairro a bairro. Se o seu ainda não aparece, deixe o e-mail no fim da página e avisamos quando houver cuidadores verificados por perto.`,
  },
  {
    q: 'Como vocês escolhem os cuidadores?',
    a: 'Cada cuidador passa por verificação de identidade e contato. Os níveis seguintes exigem entrevista, referências e cursos comprovados. O nível aparece no perfil para você decidir com informação.',
  },
  {
    q: 'O cuidador pode dar remédio ao meu pet?',
    a: 'Só quem indicou no perfil, e apenas medicação já prescrita pelo veterinário, com a receita e as instruções. Cuidadores não fazem diagnóstico, prescrição nem procedimentos clínicos.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'Na fase-piloto, a equipe confirma a reserva com você e com o cuidador antes de qualquer cobrança. O pagamento pela plataforma, com o valor do cuidador separado automaticamente, entra na próxima etapa.',
  },
  {
    q: 'Por que não vejo o endereço do cuidador?',
    a: 'Para a segurança de todos, a busca mostra só o bairro. O endereço é combinado depois que a reserva é confirmada.',
  },
]

export default async function CuidaPage({ searchParams }: { searchParams: Promise<CaregiverFilters> }) {
  const f = await searchParams
  const [results, fee] = await Promise.all([listCaregivers(f), careFeePercent()])
  const service = f.servico && f.servico in SERVICES ? (f.servico as CareService) : null
  const origin = f.bairro && NEIGHBORHOOD_NAMES.includes(f.bairro) ? f.bairro : null
  const radius = Number(f.raio) || 0
  const hasFilters = Object.values(f).some(Boolean)
  const searched = Boolean(origin || service)

  return (
    <>
      {/* Abertura com busca */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#e3e9ec_0%,#f6f5f0_55%)]">
        <div className="container-page grid gap-10 pb-14 pt-12 md:pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[0.95rem] font-semibold text-salvia-funda shadow-[0_1px_0_var(--color-areia)]">
              <Icon name="paw" className="size-4" /> PetApoio Cuida · piloto em {PILOT_CITY}
            </p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.06] md:text-6xl">
              Alguém de confiança para cuidar do seu pet, <span className="italic text-salvia-funda">perto de casa</span>
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg text-grafite-suave md:text-xl md:leading-relaxed">
              Hospedagem, visitas, passeios e creche com cuidadores verificados no seu bairro. Você vê o nível de cada um,
              o preço total e as regras antes de pedir.
            </p>
          </div>

          <form method="get" action="/cuida#resultados" className="rounded-[1.75rem] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(46,42,39,.6)] md:p-8">
            <h2 className="font-sans text-lg font-bold">Encontre um cuidador</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="bairro" className="rotulo">Seu bairro</label>
                <select id="bairro" name="bairro" defaultValue={origin ?? ''} className="campo">
                  <option value="">Toda a região-piloto</option>
                  {NEIGHBORHOOD_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="servico" className="rotulo">Serviço</label>
                <select id="servico" name="servico" defaultValue={service ?? ''} className="campo">
                  <option value="">Qualquer serviço</option>
                  {(Object.keys(SERVICES) as CareService[]).map((s) => <option key={s} value={s}>{SERVICES[s].short}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="raio" className="rotulo">Distância</label>
                <select id="raio" name="raio" defaultValue={f.raio ?? ''} className="campo">
                  <option value="">Qualquer distância</option>
                  <option value="2">Até 2 km</option>
                  <option value="5">Até 5 km</option>
                  <option value="10">Até 10 km</option>
                </select>
              </div>
              <div>
                <label htmlFor="especie" className="rotulo">Pet</label>
                <select id="especie" name="especie" defaultValue={f.especie ?? ''} className="campo">
                  <option value="">Cão ou gato</option>
                  {Object.entries(SPECIES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="porte" className="rotulo">Porte</label>
                <select id="porte" name="porte" defaultValue={f.porte ?? ''} className="campo">
                  <option value="">Qualquer porte</option>
                  {Object.entries(SIZES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <details className="sm:col-span-2" open={Boolean(f.ate || f.nivel || f.idosos || f.remedio)}>
                <summary className="cursor-pointer font-semibold text-salvia-funda">Mais filtros</summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ate" className="rotulo">Preço máximo</label>
                    <select id="ate" name="ate" defaultValue={f.ate ?? ''} className="campo">
                      <option value="">Qualquer preço</option>
                      <option value="50">Até R$ 50</option>
                      <option value="80">Até R$ 80</option>
                      <option value="100">Até R$ 100</option>
                      <option value="150">Até R$ 150</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="nivel" className="rotulo">Nível mínimo</label>
                    <select id="nivel" name="nivel" defaultValue={f.nivel ?? ''} className="campo">
                      <option value="">Qualquer nível</option>
                      {Object.entries(LEVELS).map(([v, l]) => <option key={v} value={v}>{l.label} ou acima</option>)}
                    </select>
                  </div>
                  <label className="flex items-center gap-2"><input type="checkbox" name="idosos" value="1" defaultChecked={f.idosos === '1'} className="size-4 accent-salvia-funda" /> Aceita pets idosos</label>
                  <label className="flex items-center gap-2"><input type="checkbox" name="remedio" value="1" defaultChecked={f.remedio === '1'} className="size-4 accent-salvia-funda" /> Dá medicação prescrita</label>
                </div>
              </details>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" className="btn btn-primario flex-1 sm:flex-none">Buscar cuidadores</button>
              {hasFilters && <Link href="/cuida#resultados" className="btn btn-secundario">Limpar</Link>}
            </div>
          </form>
        </div>
      </section>

      {/* Resultados */}
      <section id="resultados" className="container-page scroll-mt-24 py-14" aria-labelledby="titulo-resultados">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="titulo-resultados" className="text-3xl md:text-4xl">
              {origin ? `Cuidadores perto de ${origin}` : 'Cuidadores na região-piloto'}
            </h2>
            <p className="mt-2 text-grafite-suave">Ordem por distância e nível de verificação. Ninguém paga para aparecer primeiro.</p>
          </div>
          {results && results.length > 0 && (
            <p className="text-grafite-suave">{results.length} {results.length === 1 ? 'cuidador' : 'cuidadores'}</p>
          )}
        </div>

        {results?.some((r) => r.demo) && (
          <p role="note" className="mt-6 rounded-xl bg-[#f3e8cf] px-4 py-3 text-[#6b4f12]">
            <strong>Demonstração:</strong> estes perfis são exemplos para mostrar como a busca e a solicitação funcionam.
            Os cuidadores reais aparecem depois da verificação.
          </p>
        )}

        {results === null || (results.length === 0 && !hasFilters) ? (
          <div className="mt-8 grid gap-8 rounded-[2rem] bg-linho-escuro p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
            <div>
              <h3 className="text-3xl">Estamos formando a primeira rede de cuidadores</h3>
              <p className="mt-3 text-grafite-suave">
                Cada pessoa passa por verificação antes de aparecer aqui. Deixe seu e-mail e avisamos quando houver cuidadores no seu bairro.
              </p>
            </div>
            <SignupForm list="cuida" submitLabel="Quero ser avisado" />
          </div>
        ) : results.length === 0 ? (
          <div className="mt-8 rounded-2xl border-[1.5px] border-dashed border-areia-escura p-8">
            <h3 className="text-2xl">Ninguém com esses filtros ainda</h3>
            <p className="mt-2 text-grafite-suave">Aumente a distância ou remova algum filtro. A rede cresce bairro a bairro.</p>
            <Link href="/cuida#resultados" className="btn btn-secundario mt-5">Ver todos os cuidadores</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <ol className="grid gap-5 sm:grid-cols-2">
              {results.map((c, i) => (
                <li key={c.id}><CaregiverCard c={c} service={service} index={i} /></li>
              ))}
            </ol>
            <div className="order-first lg:order-none">
              <div className="lg:sticky lg:top-24">
                <AreaMap origin={origin} radiusKm={radius} results={results} />
                {!searched && <p className="mt-3 text-sm text-grafite-suave">Escolha seu bairro para ver a distância até cada cuidador.</p>}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Serviços */}
      <section className="bg-[#faf3ec] py-20" aria-labelledby="titulo-servicos">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-salvia-funda">Serviços</p>
            <h2 id="titulo-servicos" className="mt-1 text-4xl md:text-5xl">Do fim de semana fora à rotina da semana</h2>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {(Object.keys(SERVICES) as CareService[]).map((s) => (
              <li key={s} className="flex flex-col rounded-2xl border border-areia bg-white p-6">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-salvia-clara text-salvia-noite"><Icon name={SERVICE_ICON[s]} className="size-6" /></span>
                <h3 className="mt-5 font-sans text-lg font-bold">{SERVICES[s].label}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] text-grafite-suave">{SERVICES[s].text}</p>
                <Link href={`/cuida?servico=${s}#resultados`} className="mt-4 font-semibold text-salvia-funda hover:underline">Ver cuidadores</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Níveis */}
      <section className="container-page py-20" aria-labelledby="titulo-niveis">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <p className="font-semibold text-salvia-funda">Confiança</p>
            <h2 id="titulo-niveis" className="mt-1 text-4xl md:text-5xl">Não é um classificado. Cada cuidador tem um nível.</h2>
            <p className="mt-4 text-lg text-grafite-suave">
              Gostar de animais não basta. O nível mostra o que a equipe PetApoio conferiu, e as avaliações são por critério:
              pontualidade, comunicação, ambiente, cumprimento das instruções e bem-estar do pet.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {Object.entries(LEVELS).map(([k, l]) => (
              <li key={k} className="rounded-2xl border border-areia bg-white p-6">
                <span className="text-sm font-semibold text-salvia-funda">Nível {l.order}</span>
                <h3 className="mt-1 font-sans text-xl font-bold">{l.label}</h3>
                <p className="mt-2 text-grafite-suave">{l.requirement}</p>
              </li>
            ))}
          </ol>
        </div>
        <dl className="mt-14 grid gap-x-10 gap-y-8 border-y border-areia py-10 sm:grid-cols-2 lg:grid-cols-4">
          {seguranca.map(([icon, t, d]) => (
            <div key={t}>
              <dt className="flex items-center gap-2 font-sans text-lg font-bold"><Icon name={icon} className="size-5 text-salvia-funda" />{t}</dt>
              <dd className="mt-2 text-grafite-suave">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Como funciona */}
      <section className="bg-nevoa-clara/60 py-20" aria-labelledby="titulo-como">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-salvia-funda">Como funciona no piloto</p>
            <h2 id="titulo-como" className="mt-1 text-4xl md:text-5xl">Reservas acompanhadas de perto</h2>
            <p className="mt-4 text-lg text-grafite-suave">Nas primeiras reservas, a equipe PetApoio acompanha cada etapa com você e com o cuidador.</p>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {passos.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-white p-7">
                <span className="flex size-11 items-center justify-center rounded-full bg-salvia-funda font-sans text-lg font-bold text-linho">{i + 1}</span>
                <h3 className="mt-5 font-sans text-lg font-bold">{t}</h3>
                <p className="mt-2 text-grafite-suave">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Para cuidadores */}
      <section className="container-page py-16" aria-labelledby="titulo-cuidadores">
        <div className="grid gap-10 rounded-[2rem] bg-salvia-noite p-8 text-linho md:p-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-semibold text-salvia-clara">Para cuidadores</p>
            <h2 id="titulo-cuidadores" className="mt-1 text-4xl md:text-5xl">Cuide de pets perto de casa, com regras claras</h2>
            <p className="mt-4 max-w-[52ch] text-lg text-linho/80">
              Você define serviços, preços, agenda e regras da casa. A comissão da PetApoio é de {fee.toLocaleString('pt-BR')}%
              e aparece antes de você aceitar cada reserva: num serviço de R$ 100, você recebe R$ {(100 - fee).toLocaleString('pt-BR')}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cuida/seja-cuidador" className="btn bg-linho text-salvia-noite hover:bg-white">Quero ser cuidador</Link>
            </div>
          </div>
          <ul className="grid gap-3 self-center sm:grid-cols-2">
            {([
              ['pin', 'Pedidos do seu bairro'],
              ['shield', 'Perfil verificado e com nível'],
              ['calendar', 'Você aceita ou recusa cada pedido'],
              ['book', 'Treinamentos com veterinários parceiros'],
            ] as [IconName, string][]).map(([icon, t]) => (
              <li key={t} className="flex items-start gap-3 rounded-2xl bg-white/8 p-4">
                <Icon name={icon} className="mt-0.5 size-5 shrink-0 text-salvia-clara" />
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
            <h2 id="titulo-faq" className="mt-1 text-4xl">Antes de reservar</h2>
          </div>
          <Faq items={faq} />
        </div>
      </section>

      {results && results.length > 0 && (
        <section className="container-page pb-8" aria-labelledby="titulo-aviso">
          <div className="grid gap-8 rounded-[2rem] bg-linho-escuro p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
            <div>
              <h2 id="titulo-aviso" className="text-3xl">Seu bairro ainda não aparece?</h2>
              <p className="mt-3 text-grafite-suave">Deixe o e-mail e avisamos quando houver cuidadores verificados perto de você.</p>
            </div>
            <SignupForm list="cuida" submitLabel="Quero ser avisado" />
          </div>
        </section>
      )}
    </>
  )
}
