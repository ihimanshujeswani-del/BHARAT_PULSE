"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { EventCard } from "@/components/event-card";
import { MOCK_SPORTS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Clock, Search, Filter, Trophy, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import { Event } from "@/lib/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  
  const db = useFirestore();
  const eventsQuery = useMemo(() => 
    db ? query(collection(db, "events"), orderBy("startDate", "asc")) : null
  , [db]);
  
  const { data: firestoreEvents, loading } = useCollection<Event>(eventsQuery);

  const filteredEvents = useMemo(() => {
    if (!firestoreEvents) return [];
    return firestoreEvents.filter((event) => {
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSport = sportFilter === "all" || event.sportSlug === sportFilter;
      const matchesLevel = levelFilter === "all" || event.level === levelFilter;
      
      return matchesSearch && matchesSport && matchesLevel;
    });
  }, [firestoreEvents, searchQuery, sportFilter, levelFilter]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-20 pb-12 border-b">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/20 px-3 py-1">
              Pulse of Indian Sports
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-headline leading-none mb-6 tracking-tight">
              NEVER MISS A <span className="text-primary italic">MOMENT</span> OF GLORY.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Tracking every stride, every shot, and every win for Indian athletes across the globe. Your dedicated hub for international and national sports events.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8" asChild>
                <a href="#explore">Explore Events</a>
              </Button>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span>Real-time tracking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Verified updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none overflow-hidden hidden lg:block">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Main Content */}
      <main id="explore" className="container mx-auto px-4 py-12 flex-1 scroll-mt-20">
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold mb-2">
                <Clock className="h-5 w-5" />
                <span className="uppercase tracking-widest text-xs">Stay Updated</span>
              </div>
              <h2 className="text-3xl font-bold font-headline">EXPLORE <span className="text-accent">EVENTS</span></h2>
            </div>
            {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by event name or city..."
                className="pl-10 bg-background border-border/50 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <Select value={sportFilter} onValueChange={setSportFilter}>
                  <SelectTrigger className="w-[160px] bg-background border-border/50">
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_SPORTS.map(s => (
                      <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[160px] bg-background border-border/50">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
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
              <p className="text-muted-foreground">Check back soon for new updates from our sports feed.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2">
              <div className="font-headline text-xl font-bold tracking-tighter">
                BHARATPULSE<span className="text-primary italic">SPORTS</span>
              </div>
              <p className="text-sm text-muted-foreground">© 2025 BharatPulse Media. All rights reserved.</p>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground font-medium">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
