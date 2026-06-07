import Link from "next/link";
import { Calendar, MapPin, Users, ChevronRight, Globe, Flag } from "lucide-react";
import { Event } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 animate-slide-up">
      <CardHeader className="p-0">
        <div className="relative h-24 bg-gradient-to-r from-primary/10 to-accent/10 flex items-end px-5 pb-3">
          <Badge className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm border-none text-xs font-semibold">
            {event.level}
          </Badge>
          <div className="flex flex-col">
             <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
              {event.sport}
            </span>
            <h3 className="font-headline text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {event.name}
            </h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{new Date(event.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{event.city}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <Users className="h-4 w-4 text-accent" />
          <div className="flex -space-x-2">
            {event.indianParticipants.slice(0, 3).map((p, i) => (
              <div key={i} className="h-6 w-6 rounded-full bg-secondary border border-background flex items-center justify-center text-[8px] font-bold" title={p}>
                {p.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
            {event.indianParticipants.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-primary/20 border border-background flex items-center justify-center text-[8px] font-bold">
                +{event.indianParticipants.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            Indian Participation
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <Link 
          href={`/events/${event.id}`}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-secondary transition-colors text-sm font-semibold"
        >
          View Details
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}