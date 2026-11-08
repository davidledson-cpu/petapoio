import type { ReactNode } from 'react'
import { LogoMark } from './logo'

/** Moldura das telas de acesso: formulário à esquerda, mensagem de acolhimento à direita. */
export function AuthShell({ title, intro, children, aside }: { title: string; intro?: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="container-page grid gap-12 pt-12 md:pt-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
      <div className="max-w-md">
        <h1 className="text-[2.4rem] leading-tight md:text-5xl">{title}</h1>
        {intro && <div className="mt-4 text-lg text-grafite-suave">{intro}</div>}
        <div className="mt-8">{children}</div>
      </div>
      <aside className="hidden h-fit rounded-[1.75rem] bg-salvia-funda p-10 text-linho lg:block">
        <LogoMark size={52} ink="var(--color-salvia-clara)" paper="var(--color-salvia-funda)" />
        {aside ?? (
          <>
            <p className="mt-6 font-serif text-3xl leading-snug">
              Um lugar para falar sobre quem fez parte da sua vida, no seu tempo.
            </p>
            <ul className="mt-8 space-y-3 text-linho/85">
              <li>Psicólogas e psicólogos com CRP conferido</li>
              <li>Sessões online, com pagamento seguro</li>
              <li>Seus dados protegidos e nunca vendidos</li>
            </ul>
          </>
        )}
      </aside>
    </div>
  )
}
