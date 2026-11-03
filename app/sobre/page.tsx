import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Sobre o PetApoio',
  description: 'Por que o PetApoio existe, o que ele oferece e os cuidados que guiam o projeto.',
  alternates: { canonical: '/sobre' },
}

export default function SobrePage() {
  return (
    <>
      <PageHeader
        title="Por que o PetApoio existe"
        intro="Perder um animal pode ser perder um membro da família. Mesmo assim, muita gente vive essa dor em silêncio, ouvindo que era só um bicho."
      />
      <div className="container-page">
        <div className="texto prose max-w-[44rem]">
          <p>
            O PetApoio nasceu para ser um lugar onde essa perda é levada a sério. Aqui, a pessoa que chega primeiro
            encontra acolhimento, depois orientação e, se quiser, caminhos de cuidado: apoio psicológico e formas de
            guardar a memória de quem fez parte da sua vida.
          </p>
          <h2>O que nos guia</h2>
          <ul>
            <li><strong>Acolher antes de qualquer outra coisa.</strong> O conteúdo básico é e continuará gratuito.</li>
            <li><strong>Não impor prazos nem etapas.</strong> Cada pessoa vive o luto do seu jeito.</li>
            <li><strong>Informação revisada.</strong> Todo texto sobre saúde emocional passa por uma psicóloga ou um psicólogo antes de ser publicado.</li>
            <li><strong>Nada de pressão para comprar.</strong> Não usamos culpa, urgência ou a dor de ninguém para vender.</li>
            <li><strong>Profissionais verificados.</strong> Perfis só são publicados depois de conferirmos o registro no CRP.</li>
            <li><strong>Pouco dado, bem cuidado.</strong> Pedimos só o necessário e não pedimos relatos da sua perda.</li>
          </ul>
          <h2>O que o PetApoio não é</h2>
          <p>
            Não somos um serviço de emergência e não substituímos atendimento psicológico ou médico. Se você está em
            sofrimento intenso, veja a <Link href="/ajuda-imediata">página de ajuda imediata</Link>.
          </p>
          <h2>Fale com a gente</h2>
          <p>
            Escreva para <a href="mailto:contato@petapoio.com.br">contato@petapoio.com.br</a> ou acompanhe o{' '}
            <a href="https://instagram.com/petapoio_" target="_blank" rel="noopener noreferrer">@petapoio_</a> no Instagram.
          </p>
        </div>
      </div>
    </>
  )
}
