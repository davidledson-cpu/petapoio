import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    // URLs da versão anterior, para não quebrar links já compartilhados ou indexados.
    return [
      { source: '/profissionais', destination: '/psicologos', permanent: true },
      { source: '/para-psicologos', destination: '/seja-parceiro', permanent: true },
      { source: '/auth/:path*', destination: '/', permanent: false },
      { source: '/dashboard/:path*', destination: '/', permanent: false },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
