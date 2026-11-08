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
      <PageHeader title="Termos de uso" intro="Última atualização: 6 de novembro de 2026." />
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
          <h2 id="cuida">PetApoio Cuida: regras da reserva</h2>
          <p>
            Cuidadores são pessoas independentes, verificadas pela PetApoio conforme o nível exibido no perfil. Eles não
            são veterinários: não fazem diagnóstico, não prescrevem e não realizam procedimentos clínicos. Medicação só é
            administrada quando prescrita, com receita e instruções do tutor.
          </p>
          <ul>
            <li>Na fase-piloto, a solicitação não gera cobrança. A equipe confirma a disponibilidade antes de qualquer pagamento.</li>
            <li>O tutor informa vacinação, rotina, contato de emergência e autoriza, com limites claros, atendimento veterinário de urgência.</li>
            <li>Entrega e retirada são registradas (check-in e check-out), com atualizações durante a estadia.</li>
            <li>Cancelamento, reembolso e danos seguem a política informada na confirmação da reserva.</li>
            <li>O endereço do cuidador só é compartilhado depois da reserva confirmada.</li>
          </ul>
          <h2 id="adestramento">PetApoio Cuida: adestramento</h2>
          <p>
            Adestradores são profissionais independentes, verificados pela PetApoio a partir de identidade, referências e
            formação informada. A rede trabalha somente com reforço positivo: coleira de choque, enforcador, punição física
            ou intimidação levam ao desligamento.
          </p>
          <ul>
            <li>Adestradores não fazem diagnóstico nem tratamento. Em casos com suspeita de dor ou doença, orientam a avaliação veterinária.</li>
            <li>Formato, número de aulas, preço e política de remarcação são informados ao tutor antes da contratação.</li>
            <li>Na fase-piloto, a equipe confirma cada solicitação antes de qualquer pagamento.</li>
          </ul>
          <h2 id="saude">PetApoio Saúde</h2>
          <p>
            Hoje o PetApoio Saúde oferece a carteira digital de saúde do pet, gratuita, e uma lista de interesse. A
            carteira é um registro feito por você e não substitui o prontuário nem a orientação do veterinário.
            Planos, assistência veterinária ou seguros, quando disponíveis, serão oferecidos por empresas parceiras
            habilitadas, com coberturas, carências e exclusões definidas no contrato de cada uma. A PetApoio não é
            operadora nem seguradora.
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
