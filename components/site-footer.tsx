import Link from 'next/link'
import { Logo } from './logo'
import { site } from '@/lib/site'

const grupos = [
  {
    titulo: 'Acolhe',
    links: [
      { href: '/encontre-apoio', label: 'Apoio no luto' },
      { href: '/psicologos', label: 'Psicólogos' },
      { href: '/loja', label: 'Lembranças' },
      { href: '/blog', label: 'Blog' },
      { href: '/ajuda-imediata', label: 'Ajuda imediata' },
    ],
  },
  {
    titulo: 'Cuida e Saúde',
    links: [
      { href: '/cuida', label: 'Cuidadores' },
      { href: '/saude', label: 'Planos de saúde' },
      { href: '/painel/pets', label: 'Carteira de saúde do pet' },
    ],
  },
  {
    titulo: 'Para profissionais',
    links: [
      { href: '/seja-parceiro/psicologos', label: 'Para psicólogos' },
      { href: '/seja-parceiro/cuidadores', label: 'Para cuidadores' },
      { href: '/seja-parceiro/adestradores', label: 'Para adestradores' },
      { href: '/entrar?perfil=psicologo', label: 'Área do psicólogo' },
    ],
  },
  {
    titulo: 'PetApoio',
    links: [
      { href: '/sobre', label: 'Sobre' },
      { href: '/entrar?perfil=paciente', label: 'Área do tutor' },
      { href: '/loja/carrinho', label: 'Carrinho' },
      { href: '/privacidade', label: 'Privacidade' },
      { href: '/termos', label: 'Termos de uso' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-salvia-noite text-linho">
      <div className="border-b border-white/10">
        <p className="container-page py-5 text-[0.97rem] text-linho/85">
          Se você está em sofrimento intenso ou pensando em tirar a própria vida, ligue para o{' '}
          <a href="tel:188" className="font-semibold text-linho underline underline-offset-4">CVV (188)</a>, que
          atende 24 horas, ou para o <a href="tel:192" className="font-semibold text-linho underline underline-offset-4">SAMU (192)</a>.{' '}
          <Link href="/ajuda-imediata" className="text-linho underline underline-offset-4">Outras formas de ajuda</Link>
        </p>
      </div>
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo tone="escuro" />
          <p className="mt-4 max-w-xs text-[0.95rem] text-linho/75">{site.tagline}</p>
        </div>
        {grupos.map((g) => (
          <div key={g.titulo}>
            <h2 className="font-sans text-sm font-semibold text-linho/60">{g.titulo}</h2>
            <ul className="mt-3 space-y-2 text-[0.97rem]">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-linho/90 hover:text-linho hover:underline underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-white/10 py-6 text-sm text-linho/60 sm:flex-row sm:justify-between">
        <p>
          A PetApoio conecta tutores a profissionais e parceiros verificados. Não é serviço de emergência, não substitui
          atendimento psicológico ou veterinário e não é operadora de planos nem seguradora.
        </p>
        <p className="shrink-0">
          <a href={`mailto:${site.email}`} className="hover:text-linho">{site.email}</a>
          {'  '}·{'  '}
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-linho">
            {site.instagramHandle}
          </a>
        </p>
      </div>
    </footer>
  )
}
