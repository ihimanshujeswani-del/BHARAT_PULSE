import { MetadataRoute } from 'next'
import { initializeFirebase } from '@/firebase'
import { getDocs, collection, query, where } from 'firebase/firestore'

/**
 * Sitemap generator for BharatPulse Sports.
 * Dynamically generates URLs for static routes and all public events from Firestore.
 * 
 * To update the domain, set the NEXT_PUBLIC_SITE_URL environment variable.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use environment variable for the base URL, falling back to the known public domain
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatpulse-sports.web.app').replace(/\/$/, '')
  
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/calendar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Initialize Firebase using the client SDK (Node-compatible in Server Components)
  // to fetch all active event IDs for sitemap inclusion
  const { firestore } = initializeFirebase()
  
  // If Firestore fails to initialize (e.g., build time env vars missing), return static routes
  if (!firestore) return staticRoutes

  try {
    // Fetch events that are not archived to include in the search index
    const eventsQuery = query(collection(firestore, 'events'), where('isArchived', '!=', true))
    const snapshot = await getDocs(eventsQuery)
    
    const eventRoutes: MetadataRoute.Sitemap = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        url: `${baseUrl}/events/${doc.id}`,
        // Use document timestamp if available, otherwise current date
        lastModified: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }
    })

    return [...staticRoutes, ...eventRoutes]
  } catch (error) {
    // Graceful fallback to static routes if database read fails during build/generation
    console.error('Sitemap generation failed to fetch events:', error)
    return staticRoutes
  }
}
