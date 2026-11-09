import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Sobre a PetApoio',
  description:
    'Por que a PetApoio existe, o que faz em cada frente (Acolhe, Cuida e Saúde) e os princípios que guiam o cuidado com tutores e pets.',
  alternates: { canonical: '/sobre' },
}

export default function SobrePage() {
  return (
    <>
      <PageHeader
        title="Cuidar de quem cuida, em cada fase da vida do pet"
        intro="A PetApoio nasceu do luto: perder um animal pode ser perder alguém da família, e muita gente vive essa dor em silêncio. Hoje a mesma forma de cuidar acompanha o tutor da chegada do pet à saudade."
      />
      <div className="container-page">
        <div className="texto prose max-w-[44rem]">
          <p>
            Começamos acolhendo quem perdeu um pet, com psicólogos preparados, conteúdo revisado e formas de guardar a
            memória. Ao ouvir os tutores, ficou claro que o cuidado não começa na despedida: ele está na rotina, nas
            viagens, na saúde e nos imprevistos. Por isso a PetApoio cresceu em três frentes, com as mesmas regras de
            confiança em todas.
          </p>

          <h2>O que fazemos</h2>
          <ul>
            <li>
              <strong>PetApoio Acolhe.</strong> Apoio no luto: <Link href="/psicologos">psicólogos com CRP conferido</Link>,{' '}
              <Link href="/encontre-apoio">conteúdos gratuitos</Link> e <Link href="/loja">lembranças feitas sob encomenda</Link>.
            </li>
            <li>
              <strong>PetApoio Cuida.</strong> <Link href="/cuida">Cuidadores</Link> e adestradores verificados perto de casa,
              com nível de verificação e preço total no perfil. Piloto em Belo Horizonte.
            </li>
            <li>
              <strong>PetApoio Saúde.</strong> Carteira digital gratuita e <Link href="/saude">planos Saúde, Protege e Despedida</Link>{' '}
              operados por parceiros especializados. Em pré-lançamento.
            </li>
          </ul>

          <h2>O que nos guia</h2>
          <ul>
            <li><strong>Acolher antes de qualquer outra coisa.</strong> O conteúdo de apoio é e continuará gratuito.</li>
            <li><strong>Respeitar o tempo de cada um.</strong> Não impomos prazos nem etapas ao luto.</li>
            <li><strong>Verificar antes de publicar.</strong> Conferimos o CRP dos psicólogos e verificamos cuidadores e adestradores em quatro níveis.</li>
            <li><strong>Informação revisada.</strong> Todo texto sobre saúde emocional passa por uma psicóloga ou um psicólogo.</li>
            <li><strong>Preço e regras à vista.</strong> Valor total, cancelamento e coberturas aparecem antes de qualquer decisão.</li>
            <li><strong>Bem-estar animal.</strong> Adestramento só com reforço positivo; cuidadores não fazem atos veterinários.</li>
            <li><strong>Nada de pressão para comprar.</strong> Não usamos culpa, urgência ou a dor de ninguém para vender.</li>
            <li><strong>Pouco dado, bem cuidado.</strong> Pedimos só o necessário, não pedimos relatos da sua perda e os dados de saúde do seu pet só você vê.</li>
          </ul>

          <h2>O que a PetApoio não é</h2>
          <p>
            Não somos serviço de emergência, clínica veterinária, operadora de planos nem seguradora. Conectamos você a
            profissionais e parceiros habilitados, que respondem pelo próprio serviço. Se você está em sofrimento intenso,
            veja a <Link href="/ajuda-imediata">página de ajuda imediata</Link>. Em uma emergência com o seu pet, procure um
            hospital veterinário 24h.
          </p>

          <h2>Fale com a gente</h2>
          <p>
            Escreva para <a href="mailto:contato@petapoio.com.br">contato@petapoio.com.br</a> ou acompanhe o{' '}
            <a href="https://instagram.com/petapoio_" target="_blank" rel="noopener noreferrer">@petapoio_</a> no Instagram.
            É profissional? Conheça o cadastro para <Link href="/seja-parceiro/psicologos">psicólogos</Link>,{' '}
            <Link href="/seja-parceiro/cuidadores">cuidadores</Link> e <Link href="/seja-parceiro/adestradores">adestradores</Link>.
          </p>
        </div>
      </div>
    </>
  )
}
