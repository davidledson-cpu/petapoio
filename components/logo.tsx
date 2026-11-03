import Link from 'next/link'

/** Marca: um ramo simples ao lado do nome — natureza e continuidade, sem patinhas. */
export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-grafite" aria-label="PetApoio — início">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" className="text-salvia-funda">
        <path
          d="M5 22C9 17 13 11 21 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M10.5 15.5c-3-.2-5-2-5.5-4.6 2.8-.3 5 1.4 5.5 4.6Z" fill="currentColor" opacity=".55" />
        <path d="M14.2 11.2c.3-3 2.2-5 4.8-5.3.2 2.8-1.6 5-4.8 5.3Z" fill="currentColor" opacity=".8" />
        <path d="M16.6 8.6c-2.6-1-3.7-3.2-3.3-5.6 2.5.6 3.7 2.8 3.3 5.6Z" fill="currentColor" opacity=".4" />
      </svg>
      <span className="font-serif text-[1.45rem] leading-none tracking-tight">PetApoio</span>
    </Link>
  )
}
