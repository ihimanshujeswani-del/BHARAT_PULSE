"use client";

import { useMemo, use } from "react";
import { Navbar } from "@/components/navbar";
import { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, MapPin, ExternalLink, ArrowLeft, 
  Users, Info, Trophy, Flag, ShieldCheck, PlayCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc, DocumentReference } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  
  const eventRef = useMemo(() => 
    (db && id) ? doc(db, "events", id) as DocumentReference<Event> : null
  , [db, id]);
  
  const { data: event, loading } = useDoc<Event>(eventRef);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Trophy className="h-12 w-12 text-muted-foreground opacity-20" />
          <h2 className="text-2xl font-bold">Event Not Found</h2>
          <p className="text-muted-foreground">This event may have been removed or the link is incorrect.</p>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const participants = Array.isArray(event.indianParticipants) ? event.indianParticipants : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-card/50 border-b relative">
          <div className="container mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
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
                      {event.startDate ? new Date(event.startDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'TBD'} 
                      {event.endDate && event.startDate !== event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[200px]">
                {event.eventUrl && (
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" asChild>
                    <a href={event.eventUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      Official Website <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
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

        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                    { label: "Country", value: event.country }
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
                  <PlayCircle className="h-6 w-6 text-primary" />
                  WATCH LIVE
                </h2>
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg">Stream Coverage</h3>
                    <p className="text-sm text-muted-foreground">Watch the event live through official broadcasting channels.</p>
                  </div>
                  {event.streamUrl ? (
                    <Button asChild className="shrink-0 bg-primary hover:bg-primary/90">
                      <a href={event.streamUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        Open Stream Link <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Badge variant="outline" className="h-10 px-4">Link Not Available Yet</Badge>
                  )}
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
                    {participants.length > 0 ? (
                      participants.map((participant, index) => (
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
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No official participation data listed yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/50 to-card border border-border/50 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  <h3 className="font-bold">Official Verification</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  This event data is synchronized with the Central Sports Repository and verified through official federation sources.
                </p>
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
