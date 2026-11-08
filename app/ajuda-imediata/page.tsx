import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ajuda imediata',
  description: 'Onde encontrar ajuda agora se você está em sofrimento intenso: CVV (188), SAMU (192) e serviços de saúde.',
  alternates: { canonical: '/ajuda-imediata' },
}

const contatos = [
  {
    nome: 'CVV — Centro de Valorização da Vida',
    numero: '188',
    texto: 'Apoio emocional por telefone, 24 horas, gratuito. Também atende por chat em cvv.org.br.',
    href: 'tel:188',
    acao: 'Ligar para 188',
  },
  {
    nome: 'SAMU',
    numero: '192',
    texto: 'Para emergências, quando há risco imediato à vida ou à saúde.',
    href: 'tel:192',
    acao: 'Ligar para 192',
  },
]

export default function AjudaImediataPage() {
  return (
    <div className="container-page max-w-3xl pt-14 md:pt-20">
      <h1 className="text-[2.6rem] leading-[1.08] md:text-6xl">Se está difícil demais agora</h1>
      <p className="mt-6 text-lg text-grafite-suave md:text-xl md:leading-relaxed">
        Se você sente que não vai aguentar, ou se pensa em tirar a própria vida, procure ajuda agora. Você não precisa
        esperar piorar, nem explicar tudo.
      </p>

      <ul className="mt-10 space-y-4">
        {contatos.map((c) => (
          <li key={c.numero} className="rounded-2xl bg-salvia-noite p-6 text-linho md:p-8">
            <p className="font-serif text-6xl leading-none">{c.numero}</p>
            <h2 className="mt-4 font-sans text-lg font-semibold">{c.nome}</h2>
            <p className="mt-1 text-linho/80">{c.texto}</p>
            <a href={c.href} className="btn mt-5 bg-linho text-salvia-noite hover:bg-white">{c.acao}</a>
          </li>
        ))}
      </ul>

      <div className="texto prose mt-12 max-w-none">
        <h2>Outros caminhos</h2>
        <ul>
          <li>
            <strong>Pronto-socorro ou UPA:</strong> em uma crise, você pode ir ao serviço de urgência mais próximo,
            sozinho ou com alguém de confiança.
          </li>
          <li>
            <strong>Unidade Básica de Saúde (UBS) e CAPS:</strong> pelo SUS, a UBS do seu bairro pode orientar e
            encaminhar para acompanhamento em saúde mental, incluindo os Centros de Atenção Psicossocial.
          </li>
          <li>
            <strong>Alguém de confiança:</strong> mandar uma mensagem simples, como “estou mal, pode vir aqui?”, já é
            um passo importante.
          </li>
        </ul>
        <h2>Sobre o PetApoio</h2>
        <p>
          O PetApoio é um espaço de conteúdo e de conexão com profissionais. Não somos um serviço de emergência e não
          conseguimos responder a situações de crise. Quando estiver mais seguro, você pode voltar e{' '}
          <Link href="/encontre-apoio">ler sobre o luto</Link> ou{' '}
          <Link href="/psicologos">conhecer o apoio psicológico</Link>.
        </p>
      </div>
    </div>
  )
}
