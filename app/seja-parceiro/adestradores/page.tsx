import type { Metadata } from 'next'
import { Adestradores } from '@/components/parceiros/secoes'
import { PILOT_CITY } from '@/lib/cuida-shared'

export const metadata: Metadata = {
  title: 'Para adestradores: aulas e consultoria com reforço positivo',
  description: `Avaliação, aulas, pacotes e consultoria de comportamento em ${PILOT_CITY}, em casa, online ou em grupo. Rede verificada, sem métodos aversivos.`,
  alternates: { canonical: '/seja-parceiro/adestradores' },
}

export default function Page() {
  return <Adestradores />
}
