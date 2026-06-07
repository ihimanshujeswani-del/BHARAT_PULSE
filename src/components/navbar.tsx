"use client";

import Link from "next/link";
import { Trophy, Search, Home, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tighter">
            BHARATPULSE<span className="text-primary italic">SPORTS</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
            <Calendar className="h-4 w-4" /> All Events
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/events">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            Join Pulse
          </Button>
        </div>
      </div>
    </nav>
  );
}