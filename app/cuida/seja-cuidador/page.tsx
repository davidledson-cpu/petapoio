import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { CaregiverForm } from '@/components/cuida/caregiver-form'
import { careFeePercent } from '@/lib/cuida'
import { LEVELS, PILOT_CITY } from '@/lib/cuida-shared'

export const metadata: Metadata = {
  title: 'Seja cuidador PetApoio',
  description: `Cadastre-se para cuidar de pets no seu bairro em ${PILOT_CITY}: hospedagem, visitas, passeios e creche, com regras claras e comissão transparente.`,
  alternates: { canonical: '/cuida/seja-cuidador' },
}

export default async function SejaCuidadorPage() {
  const fee = await careFeePercent()
  return (
    <>
      <PageHeader
        title="Cuide de pets no seu bairro"
        intro={`Estamos formando a rede-piloto em ${PILOT_CITY}. Você define serviços, preços e agenda. Antes de aparecer na busca, todo cuidador passa pela verificação da equipe PetApoio.`}
      />
      <div className="container-page grid gap-12 pb-16 lg:grid-cols-[1.4fr_1fr]">
        <CaregiverForm />
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)]">
            <h2 className="font-sans text-lg font-bold">Comissão transparente</h2>
            <p className="mt-2 text-grafite-suave">
              A PetApoio fica com {fee.toLocaleString('pt-BR')}% de cada reserva concluída. Você vê quanto recebe antes de aceitar cada pedido.
            </p>
            <table className="mt-4 w-full text-[0.95rem]">
              <thead><tr className="text-left text-grafite-suave"><th className="pb-2 font-normal">Tutor paga</th><th className="pb-2 font-normal">Você recebe</th></tr></thead>
              <tbody>
                {[40, 70, 100].map((v) => (
                  <tr key={v} className="border-t border-areia"><td className="py-2">R$ {v}</td><td className="py-2 font-semibold">R$ {(v * (1 - fee / 100)).toFixed(2).replace('.', ',')}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-2xl bg-linho-escuro p-6">
            <h2 className="font-sans text-lg font-bold">Como é a verificação</h2>
            <ol className="mt-3 space-y-3">
              {Object.values(LEVELS).map((l) => (
                <li key={l.label}><strong>{l.order}. {l.label}:</strong> <span className="text-grafite-suave">{l.requirement}</span></li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </>
  )
}
