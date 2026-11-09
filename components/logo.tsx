import Link from 'next/link'

/**
 * Marca PetApoio: um balão de conversa (escuta, psicologia) com uma orelha de gato e uma
 * orelha caída de cachorro (tutores de todos os pets), e um coração no centro (acolhimento).
 * `ink` é a cor da marca; `paper` é a cor do fundo onde ela está (usada no coração e no recorte).
 */
export function LogoMark({
  size = 30,
  ink = 'var(--color-salvia-funda)',
  paper = 'var(--color-linho)',
  title,
}: {
  size?: number
  ink?: string
  paper?: string
  title?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path fill={ink} d="M7.6 15.5 9.4 4.9c.3-1.6 2-2.2 3.2-1.1l6.6 7.2Z" />
      <path
        fill={ink}
        d="M20 9.5c8.8 0 16 5.8 16 13S28.8 35.5 20 35.5c-2.3 0-4.4-.4-6.4-1.1l-7.1 3.4c-.9.4-1.8-.5-1.4-1.4l2.4-5.2C5.3 28.8 4 25.8 4 22.5c0-7.2 7.2-13 16-13Z"
      />
      <path
        fill={ink}
        stroke={paper}
        strokeWidth="1.2"
        d="M24.2 10.6c3.3-2.5 8.2-3.1 10.6-1 2.6 2.3 2 7.8-.6 11.3-.8 1.1-2.4 1-2.9-.3-1-2.6-3.1-5.8-7-8.3-.8-.5-.8-1.2-.1-1.7Z"
      />
      <path fill={paper} d="M19.6 30c-5.4-3.4-7.2-6.7-6-9.2 1.1-2.2 4-2.5 6-.4 2-2.1 4.9-1.8 6 .4 1.2 2.5-.6 5.8-6 9.2Z" />
    </svg>
  )
}

export function Logo({ tone = 'claro' }: { tone?: 'claro' | 'escuro' }) {
  const escuro = tone === 'escuro'
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${escuro ? 'text-linho' : 'text-grafite'}`}
      aria-label="PetApoio — início"
    >
      <LogoMark
        ink={escuro ? 'var(--color-laranja)' : 'var(--color-laranja)'}
        paper={escuro ? 'var(--color-salvia-noite)' : '#fff'}
      />
      <span className="font-serif text-[1.55rem] font-extrabold leading-none tracking-tight">PetApoio</span>
    </Link>
  )
}
