import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/secret/', '/api/'] },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://purpose.site'}/sitemap.xml`,
  }
}
