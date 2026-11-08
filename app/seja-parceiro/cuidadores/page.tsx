import type { Metadata } from 'next'
import { Cuidadores } from '@/components/parceiros/secoes'
import { PILOT_CITY } from '@/lib/cuida-shared'

export const metadata: Metadata = {
  title: 'Para cuidadores: cuide de pets no seu bairro',
  description: `Hospedagem, visitas, passeios e creche em ${PILOT_CITY}. Você define serviços, preço e agenda; a PetApoio verifica, traz tutores e acompanha cada reserva.`,
  alternates: { canonical: '/seja-parceiro/cuidadores' },
}

export default function Page() {
  return <Cuidadores />
}
