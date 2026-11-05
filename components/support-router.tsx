import Link from 'next/link'

const caminhos = [
  {
    href: '/encontre-apoio#primeiros-dias',
    titulo: 'Acabei de perder meu pet',
    texto: 'O que costuma acontecer nos primeiros dias e o que pode ajudar agora.',
  },
  {
    href: '/encontre-apoio#com-o-tempo',
    titulo: 'Já faz um tempo, e a saudade continua',
    texto: 'Datas difíceis, a casa vazia e o que fazer com as lembranças.',
  },
  {
    href: '/encontre-apoio#apoiar-alguem',
    titulo: 'Quero apoiar alguém que perdeu',
    texto: 'O que dizer, o que evitar e como estar presente.',
  },
]

/** Peça central da home: a pessoa escolhe por onde começar, sem precisar se explicar. */
export function SupportRouter() {
  return (
    <div className="rounded-[1.75rem] bg-areia/70 p-3 sm:p-4">
      <h2 className="px-3 pb-3 pt-2 font-serif text-[1.65rem] sm:px-4">Como você está agora?</h2>
      <ul className="space-y-2">
        {caminhos.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="group flex items-center justify-between gap-4 rounded-2xl bg-linho px-5 py-4 transition-colors hover:bg-white"
            >
              <span>
                <span className="block font-semibold text-grafite">{c.titulo}</span>
                <span className="mt-0.5 block text-[0.95rem] text-grafite-suave">{c.texto}</span>
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0 text-salvia transition-transform group-hover:translate-x-0.5">
                <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/ajuda-imediata"
            className="group flex items-center justify-between gap-4 rounded-2xl bg-salvia-noite px-5 py-4 text-linho transition-colors hover:bg-salvia-funda"
          >
            <span>
              <span className="block font-semibold">Está difícil demais agora</span>
              <span className="mt-0.5 block text-[0.95rem] text-linho/80">Onde encontrar ajuda imediata, a qualquer hora.</span>
            </span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0 text-salvia-clara">
              <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </li>
      </ul>
    </div>
  )
}
