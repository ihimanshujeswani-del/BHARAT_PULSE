"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { EventCard } from "@/components/event-card";
import { MOCK_SPORTS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Clock, Search, Filter, Trophy, Loader2, History, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, orderBy, CollectionReference } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import { Event } from "@/lib/types";
import { isBefore, parseISO, startOfDay } from "date-fns";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [showHistory, setShowHistory] = useState(false);
  
  const db = useFirestore();
  const eventsQuery = useMemo(() => 
    db ? query(collection(db, "events") as CollectionReference<Event>, orderBy("startDate", "desc")) : null
  , [db]);
  
  const { data: firestoreEvents, loading } = useCollection<Event>(eventsQuery);

  const filteredEvents = useMemo(() => {
    if (!firestoreEvents) return [];
    
    const today = startOfDay(new Date());

    return firestoreEvents.filter((event) => {
      const matchesSearch = 
        (event.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (event.city?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      const matchesSport = sportFilter === "all" || event.sportSlug === sportFilter;
      const matchesLevel = levelFilter === "all" || event.level === levelFilter;
      
      const eventEndDate = parseISO(event.endDate || event.startDate);
      const isPastEvent = isBefore(eventEndDate, today);
      
      if (!showHistory) {
        if (isPastEvent || event.isArchived) return false;
      }
      
      return matchesSearch && matchesSport && matchesLevel;
    });
  }, [firestoreEvents, searchQuery, sportFilter, levelFilter, showHistory]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-20 pb-16 border-b">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/20 px-3 py-1">
              Pulse of Indian Sports
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-headline leading-none mb-6 tracking-tight uppercase">
              NEVER MISS A <span className="text-primary italic">MOMENT</span> OF GLORY.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-foreground mb-4 max-w-2xl">
              Your dedicated hub for international and national sports events.
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Tracking every stride, every shot, and every win for Indian athletes across the globe.
            </p>
            
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Real-time tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Verified updates</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 font-bold" asChild>
                <a href="#explore">Explore Events</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="explore" className="container mx-auto px-4 py-12 flex-1 scroll-mt-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold mb-2">
                <Clock className="h-5 w-5" />
                <span className="uppercase tracking-widest text-xs">Stay Updated</span>
              </div>
              <h2 className="text-3xl font-bold font-headline uppercase">LATEST <span className="text-accent">EVENTS</span></h2>
            </div>
            
            <div className="flex items-center gap-3 bg-card border px-4 py-2 rounded-full shadow-sm">
              <History className={`h-4 w-4 ${showHistory ? 'text-primary' : 'text-muted-foreground'}`} />
              <Label htmlFor="history-mode" className="text-xs font-bold uppercase cursor-pointer">Show History & Archives</Label>
              <Switch 
                id="history-mode" 
                checked={showHistory} 
                onCheckedChange={setShowHistory} 
              />
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10 bg-background border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="w-[160px] bg-background"><SelectValue placeholder="All Sports" /></SelectTrigger>
                <SelectContent>
                  {MOCK_SPORTS.map(s => <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[160px] bg-background"><SelectValue placeholder="All Levels" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="International">International</SelectItem>
                  <SelectItem value="National">National</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Syncing latest events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="sports-grid">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-secondary p-4 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-xl font-bold mb-2">No events found</h3>
              <p className="text-muted-foreground">Try toggling &quot;Show History&quot; to see past and archived events.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2025 BharatPulse Media. Tracking Indian sports glory.</p>
        </div>
      </footer>
    </div>
  );
}
