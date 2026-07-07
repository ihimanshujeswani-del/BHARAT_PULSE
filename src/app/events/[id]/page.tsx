import { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { Event } from "@/lib/types";
import EventDetailClient from "@/components/event-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { firestore } = initializeFirebase();
  
  if (!firestore) return { title: "Event Details - BharatPulse Sports" };

  try {
    const docRef = doc(firestore, "events", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const event = docSnap.data() as Event;
      return {
        title: `${event.name} (${event.sport}) - BharatPulse Sports`,
        description: `Track details for ${event.name} in ${event.city}, ${event.country}. Part of Indian participation in international ${event.sport} events.`,
        openGraph: {
          title: event.name,
          description: `Live tracking for ${event.sport} event: ${event.name}.`,
          type: 'website',
        }
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  return {
    title: "Event Details - BharatPulse Sports",
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { firestore } = initializeFirebase();
  
  let structuredData = null;

  if (firestore) {
    try {
      const docRef = doc(firestore, "events", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const event = docSnap.data() as Event;
        structuredData = {
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          "name": event.name,
          "description": `${event.sport} competition featuring Indian athletes.`,
          "startDate": event.startDate,
          "endDate": event.endDate || event.startDate,
          "location": {
            "@type": "Place",
            "name": `${event.city}, ${event.country}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": event.city,
              "addressCountry": event.country
            }
          },
          "sport": event.sport,
          "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
          "eventStatus": event.status === 'Completed' ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled"
        };
      }
    } catch (e) {
      console.error("JSON-LD generation error:", e);
    }
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <EventDetailClient id={id} />
    </>
  );
}
