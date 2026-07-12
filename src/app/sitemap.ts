import { MetadataRoute } from 'next'

/**
 * Sitemap generator for BharatPulse Sports.
 * 
 * NOTE: Dynamic event fetching from Firestore is currently disabled here 
 * to prevent build-time errors caused by client-side Firebase initialization.
 * This ensures 'npm run build' succeeds.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable for the base URL, falling back to the Vercel production domain
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-pulse-flax.vercel.app').replace(/\/$/, '')
  
  const routes = [
    '',
    '/events',
    '/calendar',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }))
}
