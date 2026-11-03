export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <header className="container-page pb-10 pt-14 md:pb-14 md:pt-20">
      <h1 className="max-w-4xl text-[2.6rem] leading-[1.08] md:text-6xl">{title}</h1>
      {intro && <p className="mt-6 max-w-[60ch] text-lg text-grafite-suave md:text-xl md:leading-relaxed">{intro}</p>}
      {children}
    </header>
  )
}
