import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-page max-w-2xl pt-20">
      <h1 className="text-5xl">Esta página não existe mais</h1>
      <p className="mt-4 text-lg text-grafite-suave">
        O endereço pode ter mudado na nova versão do site. Você pode voltar ao início ou ir direto para o que procura.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primario">Ir para o início</Link>
        <Link href="/encontre-apoio" className="btn btn-secundario">Encontre apoio</Link>
      </div>
    </div>
  )
}
