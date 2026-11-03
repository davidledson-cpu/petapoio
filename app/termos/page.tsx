import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Termos de uso',
  alternates: { canonical: '/termos' },
}

// ANTES DE PUBLICAR: revisar com assessoria jurídica.

export default function TermosPage() {
  return (
    <>
      <PageHeader title="Termos de uso" intro="Última atualização: 3 de novembro de 2026." />
      <div className="container-page">
        <div className="texto prose max-w-[44rem]">
          <h2>O que o PetApoio oferece</h2>
          <p>
            O PetApoio publica conteúdo informativo sobre o luto pela perda de animais e reúne profissionais de
            psicologia que atendem esse tema. O conteúdo não é atendimento psicológico, não substitui avaliação
            profissional e não serve para diagnóstico.
          </p>
          <h2>Não somos um serviço de emergência</h2>
          <p>
            Em situações de crise, procure o CVV (188), o SAMU (192) ou o serviço de urgência mais próximo. Veja a{' '}
            <Link href="/ajuda-imediata">página de ajuda imediata</Link>.
          </p>
          <h2>Profissionais</h2>
          <p>
            Cada psicóloga ou psicólogo é responsável pelo próprio atendimento, de acordo com o Código de Ética
            Profissional do Psicólogo. O PetApoio confere o registro no CRP antes de publicar um perfil, mas não
            participa das sessões.
          </p>
          <h2>Conteúdo</h2>
          <p>
            Os textos do PetApoio são protegidos por direitos autorais. Você pode compartilhar links livremente. Para
            reproduzir um texto, peça autorização por <a href="mailto:contato@petapoio.com.br">contato@petapoio.com.br</a>.
          </p>
          <h2>Privacidade</h2>
          <p>
            O tratamento de dados está descrito na <Link href="/privacidade">política de privacidade</Link>.
          </p>
        </div>
      </div>
    </>
  )
}
