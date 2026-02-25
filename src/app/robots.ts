import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://orchids.ai'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/app/profile/', '/app/cart/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
