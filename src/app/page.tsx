"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { EventCard } from "@/components/event-card";
import { MOCK_EVENTS, MOCK_SPORTS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Clock } from "lucide-react";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredEvents = activeFilter === "all" 
    ? MOCK_EVENTS 
    : MOCK_EVENTS.filter(e => e.sportSlug === activeFilter);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-20 pb-12">
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
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                Explore Events
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
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold mb-2">
              <Clock className="h-5 w-5" />
              <span className="uppercase tracking-widest text-xs">Stay Updated</span>
            </div>
            <h2 className="text-3xl font-bold font-headline">UPCOMING <span className="text-accent">EVENTS</span></h2>
          </div>
          
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {MOCK_SPORTS.map((sport) => (
              <Button
                key={sport.id}
                variant={activeFilter === sport.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(sport.slug)}
                className={`rounded-full border-border/50 ${
                  activeFilter === sport.slug ? "bg-primary text-primary-foreground" : "hover:border-primary/50"
                }`}
              >
                {sport.name}
              </Button>
            ))}
          </div>
        </div>

        {filteredEvents.length > 0 ? (
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
            <p className="text-muted-foreground">Try a different sport filter or check back later.</p>
          </div>
        )}
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