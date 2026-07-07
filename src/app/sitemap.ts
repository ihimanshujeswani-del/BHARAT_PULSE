import { MetadataRoute } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { Event } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bharatpulse-sports.web.app';
  const { firestore } = initializeFirebase();
  
  const staticRoutes = [
    '',
    '/calendar',
    '/events',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let eventRoutes: MetadataRoute.Sitemap = [];

  if (firestore) {
    try {
      const q = query(collection(firestore, 'events'), where('isArchived', '==', false));
      const snapshot = await getDocs(q);
      eventRoutes = snapshot.docs.map((doc) => {
        const data = doc.data() as Event;
        return {
          url: `${baseUrl}/events/${doc.id}`,
          lastModified: new Date(data.startDate),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        };
      });
    } catch (error) {
      console.error('Error generating sitemap events:', error);
    }
  }

  return [...staticRoutes, ...eventRoutes];
}
