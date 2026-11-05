import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description: 'Quais dados o PetApoio coleta, para quê, por quanto tempo e como exercer seus direitos pela LGPD.',
  alternates: { canonical: '/privacidade' },
}

// ANTES DE PUBLICAR: completar a identificação do controlador (razão social e CNPJ)
// e revisar este texto com assessoria jurídica.

export default function PrivacidadePage() {
  return (
    <>
      <PageHeader title="Política de privacidade" intro="Última atualização: 3 de novembro de 2026." />
      <div className="container-page">
        <div className="texto prose max-w-[44rem]">
          <p>
            Esta política explica como o PetApoio trata dados pessoais, de acordo com a Lei Geral de Proteção de Dados
            (Lei nº 13.709/2018). Coletamos o mínimo necessário e não pedimos relatos sobre a sua perda.
          </p>

          <h2>Quais dados coletamos</h2>
          <ul>
            <li>
              <strong>Listas por e-mail</strong> (textos de acolhimento, aviso de psicólogos disponíveis, aviso da
              loja): seu e-mail, a lista escolhida e a data do seu consentimento.
            </li>
            <li>
              <strong>Pré-cadastro de psicólogos:</strong> nome, e-mail, telefone (opcional), número e estado do CRP,
              cidade, modalidade de atendimento, abordagem, experiência profissional informada e site profissional.
            </li>
            <li>
              <strong>Estatísticas de uso:</strong> usamos o Vercel Analytics, que mede visitas de forma agregada, sem
              cookies e sem identificar você.
            </li>
          </ul>

          <h2>Para que usamos</h2>
          <ul>
            <li>Enviar os e-mails que você pediu, e só eles.</li>
            <li>Analisar e responder candidaturas de profissionais e conferir o registro no CRP.</li>
            <li>Entender, de forma agregada, quais páginas ajudam mais as pessoas.</li>
          </ul>
          <p>
            A base legal é o seu consentimento (art. 7º, I, da LGPD) e, no caso dos profissionais, os procedimentos
            preliminares de um contrato a seu pedido (art. 7º, V).
          </p>

          <h2>Com quem compartilhamos</h2>
          <p>
            Não vendemos dados. Usamos fornecedores para operar o site: Supabase (banco de dados) e Vercel (hospedagem e
            estatísticas). Eles tratam os dados apenas para prestar esse serviço.
          </p>

          <h2>Por quanto tempo guardamos</h2>
          <p>
            Seu e-mail fica na lista até você cancelar a inscrição. Candidaturas de profissionais não aprovadas são
            apagadas em até 12 meses.
          </p>

          <h2>Seus direitos</h2>
          <p>
            Você pode pedir acesso, correção ou exclusão dos seus dados, ou retirar seu consentimento a qualquer
            momento, escrevendo para <a href="mailto:contato@petapoio.com.br">contato@petapoio.com.br</a>. Respondemos
            em até 15 dias.
          </p>
        </div>
      </div>
    </>
  )
}
