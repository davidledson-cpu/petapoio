import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { SignupForm } from '@/components/forms'

export const metadata: Metadata = {
  title: 'Memórias — loja PetApoio',
  description: 'Lembranças e homenagens para guardar a história com o seu animal. A loja do PetApoio está em preparação.',
  alternates: { canonical: '/loja' },
}

const ideias = [
  ['Retratos e quadros', 'A partir de uma foto que você escolher.'],
  ['Cadernos de memórias', 'Para escrever, colar fotos e guardar o que não quer esquecer.'],
  ['Caixas de recordação', 'Um lugar para a coleira, o brinquedo, a plaquinha.'],
  ['Presentes para acolher', 'Para quem quer mostrar carinho a alguém que perdeu um pet.'],
]

export default function LojaPage() {
  return (
    <>
      <PageHeader
        title="Memórias"
        intro="Estamos preparando uma pequena loja de lembranças e homenagens, feitas sob encomenda e com calma. Nada de promoções relâmpago."
      />
      <section className="container-page grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-3xl">O que estamos preparando</h2>
          <dl className="mt-6 divide-y divide-areia border-y border-areia">
            {ideias.map(([titulo, texto]) => (
              <div key={titulo} className="grid gap-1 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8">
                <dt className="font-serif text-xl">{titulo}</dt>
                <dd className="text-grafite-suave">{texto}</dd>
              </div>
            ))}
          </dl>
        </div>
        <aside className="h-fit rounded-[1.75rem] bg-areia/70 p-7 md:p-9">
          <h2 className="text-2xl md:text-3xl">Quer saber quando abrir?</h2>
          <p className="mt-3 text-grafite-suave">Enviamos um único e-mail no dia em que a loja abrir.</p>
          <div className="mt-6">
            <SignupForm list="loja" submitLabel="Avise-me" />
          </div>
        </aside>
      </section>
    </>
  )
}
