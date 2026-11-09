import Link from 'next/link'
import type { ReactNode } from 'react'
import { PsychologistSignupForm } from '@/components/psych/signup-form'
import { CaregiverForm } from '@/components/cuida/caregiver-form'
import { TrainerForm } from '@/components/cuida/trainer-form'
import { FormProgress } from '@/components/form-progress'
import { getSession } from '@/lib/auth'
import { getPlatformFeePercent } from '@/lib/psychologist'
import { careFeePercent } from '@/lib/cuida'
import { LEVELS, PILOT_CITY } from '@/lib/cuida-shared'
import { PROFISSOES, type Profissao } from '@/lib/profissionais'

const brl = (v: number) => v.toFixed(2).replace('.', ',')

/* ── Blocos compartilhados ───────────────────────────────────────────────── */

function Abertura({ atual, titulo, texto, children }: { atual: Profissao; titulo: string; texto: string; children?: ReactNode }) {
  return (
    <header className="container-page pb-4 pt-10 md:pt-14">
      <nav aria-label="Tipos de profissional" className="mb-10">
        <ul className="inline-flex flex-wrap gap-1 rounded-full bg-areia p-1 text-[0.95rem] font-semibold">
          {PROFISSOES.map((p) => (
            <li key={p.id}>
              <Link
                href={p.href}
                aria-current={p.id === atual ? 'page' : undefined}
                className={`block rounded-full px-4 py-2 ${p.id === atual ? 'bg-white text-grafite shadow-sm' : 'text-grafite-suave hover:text-grafite'}`}
              >
                {p.titulo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="text-sm font-semibold uppercase tracking-wide text-salvia-funda">
        {PROFISSOES.find((p) => p.id === atual)?.selo}
      </p>
      <h1 className="mt-2 max-w-4xl text-[2.6rem] leading-[1.08] md:text-6xl">{titulo}</h1>
      <p className="mt-6 max-w-[62ch] text-lg text-grafite-suave md:text-xl md:leading-relaxed">{texto}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {children ?? <a href="#cadastro" className="btn btn-primario">Começar meu cadastro</a>}
        <a href="#como-funciona" className="btn btn-secundario">Ver como funciona</a>
      </div>
    </header>
  )
}

function Beneficios({ itens, lado }: { itens: { titulo: string; texto: string }[]; lado: ReactNode }) {
  return (
    <section className="container-page mt-14 grid gap-10 lg:grid-cols-2">
      <dl className="grid gap-6 sm:grid-cols-2">
        {itens.map((b) => (
          <div key={b.titulo} className="rounded-2xl bg-linho-escuro p-6">
            <dt className="font-serif text-xl">{b.titulo}</dt>
            <dd className="mt-2 text-grafite-suave">{b.texto}</dd>
          </div>
        ))}
      </dl>
      {lado}
    </section>
  )
}

function Passos({ itens }: { itens: [string, string][] }) {
  return (
    <section id="como-funciona" className="container-page mt-20 scroll-mt-24">
      <h2 className="text-3xl md:text-4xl">Como funciona</h2>
      <ol className="mt-8 grid gap-6 md:grid-cols-5">
        {itens.map(([titulo, texto], i) => (
          <li key={titulo}>
            <span className="flex size-9 items-center justify-center rounded-full bg-salvia-clara font-semibold text-salvia-noite">{i + 1}</span>
            <p className="mt-3 font-semibold">{titulo}</p>
            <p className="mt-1 text-[0.97rem] text-grafite-suave">{texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Cadastro({ titulo, texto, faq, aviso, rodape, children }: {
  titulo: string
  texto: string
  faq: [string, string][]
  aviso?: ReactNode
  rodape?: ReactNode
  children: ReactNode
}) {
  return (
    <section id="cadastro" className="container-page mt-20 grid scroll-mt-24 gap-12 pb-16 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div>
        <h2 className="text-3xl md:text-4xl">{titulo}</h2>
        <p className="mt-3 text-grafite-suave">{texto}</p>
        {aviso}
        <h3 className="mt-10 text-2xl">Perguntas frequentes</h3>
        <div className="mt-4 divide-y divide-areia border-y border-areia">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-semibold">
                {q}
                <span aria-hidden="true" className="text-salvia-funda transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-grafite-suave">{a}</p>
            </details>
          ))}
        </div>
        {rodape}
      </div>
      <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_1px_0_var(--color-areia),0_20px_40px_-30px_rgba(46,42,39,.35)] md:p-10">
        {children}
      </div>
    </section>
  )
}

function QuantoRecebe({ fee, linhas, nota, titulo = 'Quanto você recebe' }: {
  fee: number
  linhas: [string, number][]
  nota: string
  titulo?: string
}) {
  return (
    <div className="h-fit rounded-[1.75rem] bg-salvia-funda p-8 text-linho md:p-10">
      <h2 className="text-3xl">{titulo}</h2>
      <p className="mt-3 text-linho/80">
        Sem mensalidade. A PetApoio fica com {fee.toLocaleString('pt-BR')}% de cada atendimento concluído.
      </p>
      <table className="mt-6 w-full border-y border-white/15">
        <thead>
          <tr className="text-left text-linho/70">
            <th className="py-3 font-normal">Exemplo</th>
            <th className="py-3 font-normal">Tutor paga</th>
            <th className="py-3 text-right font-normal">Você recebe</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map(([rotulo, v]) => (
            <tr key={rotulo} className="border-t border-white/15">
              <td className="py-3">{rotulo}</td>
              <td className="py-3">R$ {brl(v)}</td>
              <td className="py-3 text-right font-semibold">R$ {brl(v * (1 - fee / 100))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-linho/70">{nota}</p>
    </div>
  )
}

/* ── Psicólogos (fluxo ativo, com conta e agenda) ────────────────────────── */

export async function Psicologos() {
  const [session, fee] = await Promise.all([getSession(), getPlatformFeePercent()])
  const net = 100 - fee
  const exemplo = 200
  const ehPsicologo = session?.profile.role === 'psicologo'

  return (
    <>
      <Abertura
        atual="psicologo"
        titulo="Atenda quem está atravessando a perda de um animal"
        texto="Você cuida do atendimento; nós cuidamos de agenda, pagamento e visibilidade para pessoas que procuram exatamente esse apoio."
      >
        {ehPsicologo ? (
          <Link href="/painel/psicologo" className="btn btn-primario">Ir para o meu painel</Link>
        ) : (
          <a href="#cadastro" className="btn btn-primario">Criar minha conta profissional</a>
        )}
      </Abertura>

      <Beneficios
        itens={[
          {
            titulo: 'Quem procura, procura você',
            texto: 'Quem chega à PetApoio está atravessando a perda de um animal e quer alguém que leve esse luto a sério.',
          },
          {
            titulo: 'Agenda e pagamento resolvidos',
            texto: 'Você define horários e valor. O paciente agenda, paga por Pix ou cartão e recebe a confirmação.',
          },
          {
            titulo: 'Recebimento direto',
            texto: `Com o split do Mercado Pago, ${net}% do valor cai na sua conta no momento do pagamento.`,
          },
          {
            titulo: 'Regras claras e éticas',
            texto: 'Sem compra de posição, sem depoimentos e sem promessa de resultado, conforme o Código de Ética e o CFP.',
          },
        ]}
        lado={
          <div className="h-fit rounded-[1.75rem] bg-salvia-funda p-8 text-linho md:p-10">
            <h2 className="text-3xl">Quanto você recebe</h2>
            <p className="mt-3 text-linho/80">Exemplo com uma sessão de R$ {exemplo},00:</p>
            <dl className="mt-6 divide-y divide-white/15 border-y border-white/15">
              <div className="flex justify-between py-3"><dt>Paciente paga</dt><dd className="font-semibold">R$ {exemplo},00</dd></div>
              <div className="flex justify-between py-3"><dt>Comissão PetApoio ({fee}%)</dt><dd>− R$ {brl((exemplo * fee) / 100)}</dd></div>
              <div className="flex justify-between py-3 text-lg"><dt>Cai na sua conta Mercado Pago</dt><dd className="font-semibold">R$ {brl((exemplo * net) / 100)}</dd></div>
            </dl>
            <p className="mt-4 text-sm text-linho/70">
              Taxas do Mercado Pago pelo meio de pagamento podem ser descontadas pelo próprio Mercado Pago, conforme a sua conta.
            </p>
          </div>
        }
      />

      <Passos
        itens={[
          ['Crie sua conta', 'Preencha o formulário e confirme seu e-mail.'],
          ['Complete o perfil', 'Foto, apresentação, formação, valor da sessão e horários.'],
          ['Envie o documento', 'Carteira do CRP, para a verificação.'],
          ['Conecte o Mercado Pago', 'É por onde você recebe. Leva um minuto.'],
          ['Comece a atender', 'Depois da aprovação, seu perfil aparece para quem procura apoio.'],
        ]}
      />

      <Cadastro
        titulo="Cadastro de psicólogo"
        texto="Gratuito e sem compromisso. Seu perfil só fica público depois da verificação do CRP e quando você decidir começar."
        aviso={
          session && !ehPsicologo ? (
            <p className="mt-6 rounded-lg bg-[#f3e8cf] px-4 py-3 text-[0.97rem] text-[#6b4f12]">
              Você está conectado com uma conta de paciente. Para se cadastrar como profissional, saia e use outro e-mail.
            </p>
          ) : null
        }
        faq={[
          ['Quanto custa participar?', `Não há mensalidade. A PetApoio retém ${fee}% de cada sessão paga pela plataforma.`],
          ['Como recebo os pagamentos?', 'Pelo split do Mercado Pago: a sua parte cai na sua conta no momento do pagamento, sem esperar repasse.'],
          ['E se o paciente cancelar?', 'Cancelamentos com antecedência são reembolsados automaticamente. Faltas podem ser registradas como "não compareceu".'],
          ['Como são as sessões?', 'Por videochamada, no link que você cadastrar (Google Meet, Zoom ou outro), ou presencialmente, se você oferecer.'],
          ['Quanto tempo leva a aprovação?', 'Conferimos o CRP e o perfil em até 3 dias úteis depois do envio do documento.'],
        ]}
        rodape={
          <p className="mt-6 text-[0.97rem]">
            Já tem conta? <Link href="/entrar?next=/painel/psicologo" className="link">Entrar</Link>
          </p>
        }
      >
        {ehPsicologo ? (
          <div>
            <p className="font-serif text-2xl">Você já tem uma conta profissional.</p>
            <Link href="/painel/psicologo" className="btn btn-primario mt-6">Ir para o meu painel</Link>
          </div>
        ) : (
          <PsychologistSignupForm />
        )}
      </Cadastro>
    </>
  )
}

/* ── Cuidadores (PetApoio Cuida, candidatura com verificação) ────────────── */

export async function Cuidadores() {
  const fee = await careFeePercent()
  return (
    <>
      <Abertura
        atual="cuidador"
        titulo="Cuide de pets perto de casa, no seu ritmo"
        texto="Hospedagem, visitas, passeios ou creche. Você escolhe o que oferece, quanto cobra e quando atende. A gente traz tutores do seu bairro."
      >
        <a href="#cadastro" className="btn btn-primario">Quero ser cuidador</a>
      </Abertura>

      <Beneficios
        itens={[
          { titulo: 'Seu preço, sua agenda', texto: 'Você define serviços, valores e dias. Aceita só o que cabe na sua rotina.' },
          { titulo: 'Tutores do seu bairro', texto: 'A busca é por bairro e raio: nada de atravessar a cidade.' },
          { titulo: 'Você não fica sozinho', texto: 'No piloto, a equipe confirma cada reserva com você e com o tutor.' },
          { titulo: 'Selo de confiança', texto: 'Quatro níveis de verificação no seu perfil. Quanto mais comprovação, mais confiança.' },
        ]}
        lado={
          <QuantoRecebe
            fee={fee}
            linhas={[['Passeio', 40], ['Visita em casa', 70], ['Diária de hospedagem', 100]]}
            nota="Exemplos. O preço é você quem define, e você vê quanto recebe antes de aceitar cada pedido."
          />
        }
      />

      <Passos
        itens={[
          ['Escolha os serviços', 'Hospedagem, visita, passeio, creche ou cuidados especiais.'],
          ['Defina preço e área', 'Valor de cada serviço e até onde você vai.'],
          ['Conte sua história', 'Experiência com pets e cursos, se tiver.'],
          ['Indique referências', 'Alguém que já confiou um pet a você. Opcional, mas ajuda.'],
          ['Verificação', 'Identidade e uma conversa rápida. Resposta em até 5 dias úteis.'],
        ]}
      />

      <section className="container-page mt-16">
        <div className="rounded-2xl bg-linho-escuro p-6 md:p-8">
          <h2 className="font-sans text-lg font-bold">Os quatro níveis de verificação</h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-4">
            {Object.values(LEVELS).map((l) => (
              <li key={l.label}>
                <p className="font-semibold">{l.order}. {l.label}</p>
                <p className="mt-1 text-[0.95rem] text-grafite-suave">{l.requirement}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Cadastro
        titulo="Cadastro de cuidador"
        texto="Gratuito, sem criar conta agora. Preencha no seu tempo: guardamos o rascunho neste aparelho."
        faq={[
          ['Preciso ter casa com quintal?', 'Não. Visitas e passeios não exigem. Para hospedagem, basta um ambiente seguro, combinado com o tutor.'],
          ['Quanto custa?', `Nada para entrar. A PetApoio fica com ${fee.toLocaleString('pt-BR')}% de cada reserva concluída.`],
          ['Preciso de formação?', 'Não. Experiência e referências já contam. Cursos e primeiros socorros pet sobem seu nível.'],
          ['Posso dar remédio ao pet?', 'Só o que o veterinário prescreveu, com receita e instruções do tutor.'],
          ['Atendo fora de Belo Horizonte?', `Por enquanto o piloto é em ${PILOT_CITY} e Nova Lima. Novas cidades entram depois.`],
        ]}
      >
        <FormProgress draftKey="cuidador">
          <CaregiverForm />
        </FormProgress>
      </Cadastro>
    </>
  )
}

/* ── Adestradores (PetApoio Cuida, candidatura com verificação) ──────────── */

export async function Adestradores() {
  const fee = await careFeePercent()
  return (
    <>
      <Abertura
        atual="adestrador"
        titulo="Mais famílias treinando com você, do seu jeito"
        texto="Avaliação, aulas, pacotes ou consultoria de comportamento, em casa, online ou em grupo. Você monta a oferta; a gente leva até você tutores da região."
      >
        <a href="#cadastro" className="btn btn-primario">Quero ser adestrador</a>
      </Abertura>

      <Beneficios
        itens={[
          { titulo: 'Sua metodologia em destaque', texto: 'Especialidades no perfil: filhotes, passeio, ansiedade de separação, gatos. O tutor escolhe quem combina.' },
          { titulo: 'Seu formato, seu preço', texto: 'Aula avulsa, pacote ou consultoria. Você define valor, horários e até onde vai.' },
          { titulo: 'Só reforço positivo', texto: 'Uma rede sem choque, enforcador ou punição. Isso gera confiança nos tutores.' },
          { titulo: 'Vitrine que já recebe tutores', texto: 'Você entra na PetApoio Cuida, ao lado dos cuidadores do seu bairro.' },
        ]}
        lado={
          <QuantoRecebe
            fee={fee}
            linhas={[['Avaliação inicial', 150], ['Aula avulsa', 180], ['Pacote de 8 aulas', 1200]]}
            nota="Exemplos. O preço é você quem define. No pacote, a comissão vale sobre o total."
          />
        }
      />

      <Passos
        itens={[
          ['Diga como trabalha', 'Onde atende, com quais pets e suas especialidades.'],
          ['Monte sua oferta', 'Formatos e preços: avaliação, aula, pacote ou consultoria.'],
          ['Conte sua experiência', 'Tempo de trabalho, cursos e seu Instagram.'],
          ['Indique referências', 'Um tutor ou clínica que conhece seu trabalho. Opcional, mas ajuda.'],
          ['Verificação', 'Identidade e uma conversa rápida. Resposta em até 5 dias úteis.'],
        ]}
      />

      <Cadastro
        titulo="Cadastro de adestrador"
        texto="Gratuito, sem criar conta agora. Preencha no seu tempo: guardamos o rascunho neste aparelho."
        faq={[
          ['Preciso de diploma ou registro?', 'Não existe registro obrigatório para adestradores. Olhamos experiência, referências e cursos.'],
          ['Quanto custa?', `Nada para entrar. A PetApoio fica com ${fee.toLocaleString('pt-BR')}% de cada aula ou pacote concluído.`],
          ['Por que só reforço positivo?', 'Protege o animal e a confiança da família. Choque, enforcador ou punição física levam ao desligamento.'],
          ['E casos de agressividade?', 'Pode atender. Se houver suspeita de dor ou doença, oriente uma avaliação veterinária antes.'],
          ['Trabalho com gatos. Serve?', 'Serve, e faz falta. Marque “Gatos” nas especialidades.'],
          ['Quando meu perfil aparece?', 'Estamos formando a primeira rede em BH. Depois da aprovação, avisamos a data de abertura.'],
        ]}
      >
        <FormProgress draftKey="adestrador">
          <TrainerForm />
        </FormProgress>
      </Cadastro>
    </>
  )
}
