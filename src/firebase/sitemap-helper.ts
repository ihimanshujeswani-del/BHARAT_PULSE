import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigValid } from './config';

/**
 * The shape of the event data required for the sitemap.
 */
interface SitemapEvent {
  id: string;
  lastModified?: Date;
}

/**
 * Initializes and returns a server-safe Firebase app instance.
 * It reuses the existing [DEFAULT] app instance if available, 
 * otherwise it initializes a new one.
 * This is safe to call multiple times.
 */
function getFirebaseApp() {
  // If the app is already initialized, return it.
  if (getApps().length > 0) {
    return getApp();
  }

  // Otherwise, initialize a new app and return it.
  return initializeApp(firebaseConfig);
}

/**
 * A server-safe function to fetch non-archived events from Firestore.
 * It reuses the Firebase app instance for efficiency and is safe for server-side generation.
 * 
 * @returns {Promise<SitemapEvent[]>} A promise that resolves to an array of events.
 */
export async function getEventsForSitemap(): Promise<SitemapEvent[]> {
  // Do not proceed if the Firebase config is invalid.
  if (!isFirebaseConfigValid) {
    console.warn('Sitemap generation: Firebase config is invalid. Skipping dynamic URL generation.');
    return [];
  }

  try {
    const app = getFirebaseApp();
    const db = getFirestore(app);

    // Query to get non-archived events.
    const eventsQuery = query(collection(db, 'events'), where('isArchived', '==', false));
    const eventsSnapshot = await getDocs(eventsQuery);

    if (eventsSnapshot.empty) {
      return []; // No events found.
    }

    // Map documents to the required sitemap format.
    return eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      const timestamp = data.lastModified || data.updatedAt;
      let lastModified: Date | undefined = undefined;

      // Convert Firestore Timestamp to JavaScript Date object.
      if (timestamp && timestamp instanceof Timestamp) {
        lastModified = timestamp.toDate();
      }
      
      return {
        id: doc.id,
        lastModified,
      };
    });

  } catch (error) {
    // If any error occurs, log it and return an empty array to prevent breaking the sitemap build.
    console.error('Sitemap generation: Failed to fetch events from Firestore.', error);
    return []; // Fallback to an empty array on failure.
  }
}
