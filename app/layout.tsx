import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import { Toaster } from '@/components/ui/toaster'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
})

// Using Google Fonts CDN approach for Playfair Display
const playfairDisplay = {
  variable: '--font-playfair',
}

export const metadata: Metadata = {
  title: {
    default: 'PetApoio | Apoio Emocional para Tutores de Pets Enlutados',
    template: '%s | PetApoio',
  },
  description: 'Conectamos tutores enlutados a psicólogos especializados em luto animal. Aconselhamento online, comunidade de apoio e produtos memoriais. Você não está sozinho.',
  keywords: ['luto animal', 'perda de pet', 'psicólogo online', 'apoio emocional', 'luto pet', 'petapoio'],
  authors: [{ name: 'PetApoio' }],
  creator: 'PetApoio',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://petapoio.com.br',
    title: 'PetApoio | Apoio Emocional para Tutores de Pets Enlutados',
    description: 'Conectamos tutores enlutados a psicólogos especializados em luto animal.',
    siteName: 'PetApoio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetApoio',
    description: 'Apoio emocional para tutores de pets enlutados.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${lato.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
