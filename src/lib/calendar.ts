import { Event } from '@/lib/types';

/**
 * Formats a JavaScript Date object into the `YYYYMMDDTHHMMSSZ` format required by Google Calendar.
 * Example: 20241225T143000Z
 * @param date The date to format.
 * @returns A string representing the formatted date in UTC.
 */
const formatGoogleCalendarDate = (date: Date): string => {
  return date.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
};

/**
 * Generates a Google Calendar event URL from an event object.
 * This function constructs a URL that pre-fills the event details in Google Calendar.
 *
 * @param event The event object containing details like title, dates, and description.
 * @returns A URL string for creating a new Google Calendar event.
 */
export const generateGoogleCalendarUrl = (event: Event): string => {
  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';

  // Required: Title and dates
  const title = encodeURIComponent(`${event.name} - ${event.sport}`);
  const startDate = event.startDate ? formatGoogleCalendarDate(new Date(event.startDate)) : '';
  const endDate = event.endDate ? formatGoogleCalendarDate(new Date(event.endDate)) : '';
  const dates = `&dates=${startDate}/${endDate}`;

  // Optional: Description with rich details
  let details = event.description || '';
  if (event.indianParticipants && event.indianParticipants.length > 0) {
    details += `\n\nParticipants: ${event.indianParticipants.join(', ')}`;
  }
  details += `\n\nView on BharatPulse: ${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.id}`;
  if (event.officialWebsite) {
    details += `\nOfficial Website: ${event.officialWebsite}`;
  }
  const detailsParam = `&text=${encodeURIComponent(details)}`;

  // Optional: Location
  const location = event.venue ? encodeURIComponent(`${event.venue}, ${event.city}`) : '';
  const locationParam = location ? `&location=${location}` : '';

  return `${baseUrl}${detailsParam}${dates}${locationParam}`;
};
