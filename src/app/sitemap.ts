import { MetadataRoute } from 'next';
import { getEventsForSitemap } from '@/firebase/sitemap-helper';

// Use a fallback for the site URL, similar to robots.ts, to prevent build failures.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-pulse-flax.vercel.app').replace(/\/$/, '');

/**
 * Generates the sitemap by combining static routes with dynamic, non-archived event routes from Firestore.
 * This function is robust and will not fail the build if Firestore fetching fails.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Define the static routes that are always present.
  const staticRoutes = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/calendar`,
      lastModified: new Date(),
    },
  ];

  // 2. Fetch dynamic event routes from Firestore.
  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const events = await getEventsForSitemap();
    
    eventRoutes = events.map(event => ({
      url: `${SITE_URL}/events/${event.id}`,
      // Use the event's lastModified date if available, otherwise use the current date.
      lastModified: event.lastModified || new Date(),
    }));

  } catch (error) {
    // The helper function already logs the error.
    // We proceed with an empty array for eventRoutes, so the sitemap build doesn't fail.
    console.error('Sitemap generation: An unexpected error occurred while processing events.', error);
  }

  // 3. Combine static and dynamic routes and return.
  return [...staticRoutes, ...eventRoutes];
}
