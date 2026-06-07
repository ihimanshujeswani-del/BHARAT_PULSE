"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import { Event } from "@/lib/types";
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameDay, 
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay
} from "date-fns";
import { Calendar as CalendarIcon, ChevronRight, Loader2, Trophy } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const db = useFirestore();
  
  // Current view date (default to today)
  // Structured this way so navigation buttons can be added later by updating this state
  const [viewDate] = useState(new Date());

  // Calculate Monday to Sunday for the current week of viewDate
  const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(viewDate, { weekStartsOn: 1 });
  
  const weekDays = useMemo(() => {
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [weekStart, weekEnd]);

  // Fetch all events
  const eventsQuery = useMemo(() => 
    db ? query(collection(db, "events"), orderBy("startDate", "asc")) : null
  , [db]);
  
  const { data: events, loading } = useCollection<Event>(eventsQuery);

  // Group events by day, showing on every day between startDate and endDate inclusive
  const eventsByDay = useMemo(() => {
    const map: Record<string, Event[]> = {};
    
    if (!events) return map;

    weekDays.forEach(day => {
      const dateKey = format(day, "yyyy-MM-dd");
      const dayStart = startOfDay(day);
      
      map[dateKey] = events.filter(event => {
        try {
          const start = startOfDay(parseISO(event.startDate));
          const end = endOfDay(parseISO(event.endDate || event.startDate));
          
          return isWithinInterval(dayStart, { start, end });
        } catch (e) {
          return false;
        }
      });
    });
    
    return map;
  }, [events, weekDays]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-primary font-bold mb-2">
            <CalendarIcon className="h-5 w-5" />
            <span className="uppercase tracking-widest text-xs">Weekly Schedule</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4">
            EVENT <span className="text-primary">CALENDAR</span>
          </h1>
          <p className="text-muted-foreground">
            {format(weekStart, "MMMM d")} — {format(weekEnd, "MMMM d, yyyy")}
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Syncing week's events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-[600px]">
            {weekDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayEvents = eventsByDay[dateKey] || [];
              const isToday = isSameDay(day, new Date());

              return (
                <div key={dateKey} className="flex flex-col gap-3">
                  <div className={cn(
                    "p-3 rounded-lg text-center border transition-colors",
                    isToday ? "bg-primary/10 border-primary" : "bg-card/50 border-border/50"
                  )}>
                    <div className="text-[10px] uppercase tracking-tighter font-bold text-muted-foreground">
                      {format(day, "EEEE")}
                    </div>
                    <div className={cn(
                      "text-xl font-bold font-headline",
                      isToday ? "text-primary" : ""
                    )}>
                      {format(day, "d")}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    {dayEvents.length > 0 ? (
                      dayEvents.map((event) => (
                        <Link 
                          key={`${event.id}-${dateKey}`} 
                          href={`/events/${event.id}`}
                          className="group block p-3 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1"
                        >
                          <div className="text-[9px] font-bold text-primary uppercase tracking-wider mb-1">
                            {event.sport}
                          </div>
                          <h3 className="text-xs font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {event.name}
                          </h3>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline" className="text-[8px] h-4 px-1 leading-none uppercase">
                              {event.status}
                            </Badge>
                            <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border/30 rounded-xl bg-muted/5 opacity-30 h-full min-h-[100px]">
                         <Trophy className="h-4 w-4 mb-1" />
                         <span className="text-[10px] uppercase font-medium">No Events</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t py-6 bg-card/30 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest italic">
            BharatPulse Sports Schedule &copy; 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
