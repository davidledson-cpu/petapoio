/** Ícones de traço simples (24px de grade), herdam a cor do texto. */
const paths = {
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  shield: 'M12 3 5 6v5.5c0 4.4 3 8.2 7 9.5 4-1.3 7-5.1 7-9.5V6l-7-3Zm-3 9 2.2 2.2L15.5 10',
  video: 'M4 7.5A1.5 1.5 0 0 1 5.5 6h9A1.5 1.5 0 0 1 16 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 16.5v-9ZM16 10.5l4-2.5v8l-4-2.5',
  card: 'M3.5 7A1.5 1.5 0 0 1 5 5.5h14A1.5 1.5 0 0 1 20.5 7v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17V7Zm0 3h17M7 15h3',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9c.6-3.3 3-5 6-5s5.4 1.7 6 5m1-9a3 3 0 1 0-1-5.8M17.5 15c2 .5 3.2 2.2 3.5 5',
  book: 'M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5v13c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5v-13ZM12 6v13.5',
  calendar: 'M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5v-12ZM5 10h14M9 3v4m6-4v4',
  scale: 'M12 4v16m-6 0h12M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0L5 8Zm14 0-2.5 6a3 3 0 0 0 5 0L19 8Z',
  lock: 'M6.5 11A1.5 1.5 0 0 1 8 9.5h8a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 16 19.5H8A1.5 1.5 0 0 1 6.5 18v-7ZM9 9.5V7.5a3 3 0 0 1 6 0v2',
  refresh: 'M19 12a7 7 0 1 1-2.1-5M19 4.5V8h-3.5',
  user: 'M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-7 9c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5',
  chart: 'M4 19.5h16M7 16v-5m5 5V7m5 9v-8',
  gift: 'M4 10h16v3H4zM5.5 13h13v7h-13zM12 10v10M12 10C10.5 7 7 6.5 7 8.5S10 10 12 10Zm0 0c1.5-3 5-3.5 5-1.5S14 10 12 10Z',
  truck: 'M3 6.5h11v9H3zM14 10h3.5l3 3v2.5H14M7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  )
}
