import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production' || !process.env.VERCEL_ENV
  return {
    // Pré-visualizações da Vercel não devem ser indexadas.
    rules: isProduction ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
