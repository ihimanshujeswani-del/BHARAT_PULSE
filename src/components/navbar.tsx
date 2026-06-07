"use client";

import Link from "next/link";
import { Trophy, Search, Calendar } from "lucide-react";
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

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/calendar" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Calendar
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="md:hidden">
              <Link href="/calendar">
                <Calendar className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="md:hidden">
              <Link href="/#explore">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
