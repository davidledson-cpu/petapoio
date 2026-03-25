import Link from 'next/link'
import { Instagram, Mail, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-petblue-600 text-white">
      <div className="container py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">🐾</div>
              <span className="font-serif font-bold text-xl">PetApoio</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Apoio emocional especializado para tutores de animais de estimação enlutados.
              Você não está sozinho neste momento.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://instagram.com/petapoio_" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="mailto:contato@petapoio.com.br"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-white/90">Plataforma</h4>
            <ul className="space-y-2.5">
              {[
                ['Como Funciona', '/#como-funciona'],
                ['Profissionais', '/profissionais'],
                ['Loja Memorial', '/loja'],
                ['Para Psicólogos', '/auth/cadastro-profissional'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 text-white/90">Suporte</h4>
            <ul className="space-y-2.5">
              {[
                ['Central de Ajuda', '/ajuda'],
                ['Política de Privacidade', '/privacidade'],
                ['Termos de Uso', '/termos'],
                ['Contato', '/contato'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 PetApoio — petapoio.com.br. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 fill-petbeige-200 text-petbeige-200" /> para quem perdeu um amor de quatro patas
          </p>
        </div>
      </div>
    </footer>
  )
}
