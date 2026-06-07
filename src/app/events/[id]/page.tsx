"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, MapPin, Globe, ExternalLink, ArrowLeft, 
  Users, Info, Trophy, Flag, ShieldCheck 
} from "lucide-react";
import Link from "next/link";
import { AthleteBriefing } from "@/components/athlete-briefing";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const found = MOCK_EVENTS.find(e => e.id === id);
    if (found) setEvent(found);
  }, [id]);

  if (!event) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-card/50 border-b relative">
          <div className="container mx-auto px-4 py-8">
            <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Events
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/20 text-primary border-primary/20">
                    {event.sport}
                  </Badge>
                  <Badge variant="outline">
                    {event.level}
                  </Badge>
                  {event.qualificationEvent && (
                    <Badge className="bg-accent/20 text-accent border-accent/20">
                      Qualification Event
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight">
                  {event.name}
                </h1>
                <div className="flex flex-wrap gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{event.city}, {event.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })} 
                      {event.startDate !== event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[200px]">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" asChild>
                  <a href={event.eventUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Official Website <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <div className="text-center">
                  <span className="text-xs uppercase tracking-tighter text-muted-foreground font-bold">Event Status</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <div className={`h-2 w-2 rounded-full ${event.status === 'Live' ? 'bg-green-500 animate-pulse' : 'bg-primary'}`} />
                    <span className="text-sm font-bold">{event.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Details & Matrix */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-2">
                  <Info className="h-6 w-6 text-primary" />
                  EVENT DETAILS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Competition Type", value: event.eventType },
                    { label: "Sport Category", value: event.sport },
                    { label: "Event Level", value: event.level },
                    { label: "Country", value: event.country },
                    { label: "Host City", value: event.city },
                    { label: "Indian Status", value: event.indianParticipation ? "Participating" : "Not Participating" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-lg bg-card border border-border/50 flex flex-col gap-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  INDIAN PARTICIPATION
                </h2>
                <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Qualified Entries</span>
                  </div>
                  <div className="divide-y divide-border/50">
                    {event.indianParticipants.map((participant, index) => (
                      <div key={index} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {participant.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold block">{participant}</span>
                            <span className="text-xs text-muted-foreground">Qualified Athlete/Team</span>
                          </div>
                        </div>
                        <Flag className="h-4 w-4 text-accent" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Briefing & Sidebars */}
            <div className="space-y-8">
              <AthleteBriefing athleteNames={event.indianParticipants} />
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/50 to-card border border-border/50 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  <h3 className="font-bold">Official Verification</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  This event data is synchronized with the Central Sports Repository and verified through official federation sources.
                </p>
                <div className="pt-2">
                   <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10 text-xs h-8">
                    View Federation Data
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-center py-4 opacity-50 grayscale">
                <Trophy className="h-12 w-12" />
                <div className="font-headline text-lg font-bold tracking-tighter">
                  BHARATPULSE<span className="text-primary italic">SPORTS</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}