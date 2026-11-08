import type { Metadata } from 'next'
import { Psicologos } from '@/components/parceiros/secoes'

export const metadata: Metadata = {
  title: 'Para psicólogos: atenda pessoas em luto pela perda de um pet',
  description:
    'Perfil com CRP conferido, agenda online e pagamento direto na sua conta Mercado Pago. Atenda quem está atravessando a perda de um animal.',
  alternates: { canonical: '/seja-parceiro/psicologos' },
}

export default function Page() {
  return <Psicologos />
}
