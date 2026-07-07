import Link from "next/link";
import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { Event } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const participants = Array.isArray(event.indianParticipants)
    ? event.indianParticipants
    : [];

  const formattedDate = event.startDate 
    ? new Date(event.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    : 'TBD';

  return (
    <Card className={`group overflow-hidden border-border bg-card transition-all duration-300 animate-slide-up ${event.featured ? 'border-primary/40 ring-1 ring-primary/20 shadow-lg' : 'hover:border-primary/50'}`}>
      <CardHeader className="p-0">
        <div className={`relative h-24 flex items-end px-5 pb-3 ${event.featured ? 'bg-gradient-to-r from-primary/20 to-accent/20' : 'bg-gradient-to-r from-primary/10 to-accent/10'}`}>
          <div className="absolute top-4 right-4 flex gap-2">
            {event.featured && (
              <Badge className="bg-primary text-primary-foreground border-none text-[10px] font-bold px-2 py-0.5">
                🔥 FEATURED
              </Badge>
            )}
            <Badge className="bg-background/50 backdrop-blur-sm border-none text-[10px] font-semibold">
              {event.level || "TBD"}
            </Badge>
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
              {event.sport || "Other"}
            </span>
            <h3 className="font-headline text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {event.name || "Untitled Event"}
            </h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="truncate">{event.city || "TBD"}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <Users className="h-4 w-4 text-accent" aria-hidden="true" />
          <div className="flex -space-x-2" aria-label={`Indian participants: ${participants.length > 0 ? participants.join(', ') : 'None listed'}`}>
            {participants.slice(0, 3).map((p, i) => (
              <div key={i} className="h-6 w-6 rounded-full bg-secondary border border-background flex items-center justify-center text-[8px] font-bold" title={p}>
                {p.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
            {participants.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-primary/20 border border-background flex items-center justify-center text-[8px] font-bold">
                +{participants.length - 3}
              </div>
            )}
            {participants.length === 0 && (
               <div className="h-6 w-6 rounded-full bg-muted border border-background flex items-center justify-center text-[8px] font-bold">
                ?
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            {participants.length > 0 ? "Indian Participation" : "TBD Participation"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <Link 
          href={`/events/${event.id}`}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-secondary transition-colors text-sm font-semibold"
          aria-label={`View details for ${event.name}`}
        >
          View Details
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
