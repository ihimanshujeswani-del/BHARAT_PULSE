"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { EventCard } from "@/components/event-card";
import { MOCK_EVENTS, MOCK_SPORTS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Search, Filter, LayoutGrid, List } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === "all" || event.sportSlug === sportFilter;
    const matchesLevel = levelFilter === "all" || event.level === levelFilter;
    
    return matchesSearch && matchesSport && matchesLevel;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">EXPLORE <span className="text-primary">ALL EVENTS</span></h1>
          <p className="text-muted-foreground">Browse through all upcoming international and national sports competitions.</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-card border border-border/50 rounded-xl p-4 mb-10 shadow-sm flex flex-col lg:flex-row gap-4">
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

            <div className="hidden sm:flex border-l pl-4 gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 bg-primary/10 text-primary">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="sports-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No matching events</h3>
            <p className="max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
          </div>
        )}
      </main>
    </div>
  );
}