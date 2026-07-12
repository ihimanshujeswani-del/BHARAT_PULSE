import { MetadataRoute } from 'next'

/**
 * Robots.txt configuration for BharatPulse Sports.
 * Directs search engines and references the dynamic sitemap using the production URL.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-pulse-flax.vercel.app').replace(/\/$/, '')
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin', // Prevent indexing of the admin dashboard
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
