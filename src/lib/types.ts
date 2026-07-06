export interface Sport {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Event {
  id: string;
  name: string;
  sport: string;
  sportSlug: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  level: 'International' | 'National';
  eventType: string;
  indianParticipation: boolean;
  indianParticipants: string[];
  qualificationEvent: boolean;
  status: 'Upcoming' | 'Live' | 'Completed';
  eventUrl: string;
  streamUrl?: string;
  isArchived?: boolean;
}
