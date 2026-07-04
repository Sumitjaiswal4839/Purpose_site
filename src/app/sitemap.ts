import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://purpose.site'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/templates`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/editor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/custom-request`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/ideas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/feedback`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
