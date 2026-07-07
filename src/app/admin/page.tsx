"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useFirestore } from "@/firebase/provider";
import { collection, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useToast } from "@/hooks/use-toast";
import { MOCK_SPORTS } from "@/lib/mock-data";
import { Event } from "@/lib/types";
import { ArrowLeft, Loader2, Save, PlusCircle, Trash2, Archive, ArchiveRestore, Globe, Tv, Star } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  const eventsQuery = useMemo(() => 
    db ? query(collection(db, "events"), orderBy("startDate", "desc")) : null
  , [db]);
  
  const { data: events, loading: eventsLoading } = useCollection<Event>(eventsQuery as any);

  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    sportSlug: "",
    startDate: "",
    endDate: "",
    city: "",
    country: "",
    level: "International" as const,
    status: "Upcoming" as const,
    eventType: "Tournament",
    indianParticipants: "",
    eventUrl: "",
    streamUrl: "",
    qualificationEvent: false,
    indianParticipation: true,
    isArchived: false,
    featured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    setLoading(true);
    try {
      const participantsArray = formData.indianParticipants
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== "");

      await addDoc(collection(db, "events"), {
        ...formData,
        indianParticipants: participantsArray,
        createdAt: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: "Event has been successfully added.",
      });

      setFormData({
        name: "",
        sport: "",
        sportSlug: "",
        startDate: "",
        endDate: "",
        city: "",
        country: "",
        level: "International",
        status: "Upcoming",
        eventType: "Tournament",
        indianParticipants: "",
        eventUrl: "",
        streamUrl: "",
        qualificationEvent: false,
        indianParticipation: true,
        isArchived: false,
        featured: false
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the event.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      toast({ title: "Deleted", description: "Event removed from database." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete." });
    }
  };

  const handleToggleArchive = async (event: Event) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "events", event.id), {
        isArchived: !event.isArchived
      });
      toast({ 
        title: event.isArchived ? "Unarchived" : "Archived", 
        description: `Event has been ${event.isArchived ? 'restored' : 'archived'}.` 
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Update failed." });
    }
  };

  const handleToggleFeatured = async (event: Event) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "events", event.id), {
        featured: !event.featured
      });
      toast({ 
        title: event.featured ? "Unfeatured" : "Featured", 
        description: `Event is ${event.featured ? 'no longer' : 'now'} featured.` 
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Update failed." });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Public View
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center gap-2 text-primary">
                    <PlusCircle className="h-5 w-5" />
                    <CardTitle className="text-xl">Add New Sports Event</CardTitle>
                  </div>
                  <CardDescription>Fill in the details to list a new event.</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Event Name</Label>
                          <Input id="name" name="name" placeholder="e.g. World Athletics Championships" required value={formData.name} onChange={handleInputChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sport">Sport Name</Label>
                            <Input id="sport" name="sport" placeholder="e.g. Javelin Throw" required value={formData.sport} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sportSlug">Category</Label>
                            <Select value={formData.sportSlug} onValueChange={(v) => setFormData(p => ({ ...p, sportSlug: v }))}>
                              <SelectTrigger><SelectValue placeholder="Sport" /></SelectTrigger>
                              <SelectContent>
                                {MOCK_SPORTS.filter(s => s.slug !== 'all').map((s) => (
                                  <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" name="startDate" type="date" required value={formData.startDate} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" name="endDate" type="date" required value={formData.endDate} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventType">Event Type</Label>
                          <Input id="eventType" name="eventType" placeholder="e.g. Championship, Tournament, League" value={formData.eventType} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="level">Level</Label>
                            <Select value={formData.level} onValueChange={(v: any) => setFormData(p => ({ ...p, level: v }))}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="International">International</SelectItem>
                                <SelectItem value="National">National</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(v: any) => setFormData(p => ({ ...p, status: v }))}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Upcoming">Upcoming</SelectItem>
                                <SelectItem value="Live">Live</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" required value={formData.country} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventUrl" className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5" /> Official Website URL
                          </Label>
                          <Input id="eventUrl" name="eventUrl" placeholder="https://..." value={formData.eventUrl} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="streamUrl" className="flex items-center gap-2">
                            <Tv className="h-3.5 w-3.5" /> Stream URL
                          </Label>
                          <Input id="streamUrl" name="streamUrl" placeholder="https://watch..." value={formData.streamUrl} onChange={handleInputChange} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="indianParticipants">Indian Participants (Comma separated)</Label>
                      <Textarea id="indianParticipants" name="indianParticipants" placeholder="e.g. Neeraj Chopra, Kishore Jena" value={formData.indianParticipants} onChange={handleInputChange} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 py-2">
                        <Switch 
                          id="qualificationEvent" 
                          checked={formData.qualificationEvent} 
                          onCheckedChange={(checked) => setFormData(p => ({...p, qualificationEvent: checked}))} 
                        />
                        <Label htmlFor="qualificationEvent">Qualification Event</Label>
                      </div>

                      <div className="flex items-center space-x-2 py-2">
                        <Switch 
                          id="featured" 
                          checked={formData.featured} 
                          onCheckedChange={(checked) => setFormData(p => ({...p, featured: checked}))} 
                        />
                        <Label htmlFor="featured" className="text-primary font-bold">Featured Event 🔥</Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-base font-bold" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />} Save Sports Event
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Management Column */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-headline uppercase tracking-tight">Manage Registry</h2>
              <div className="space-y-4">
                {eventsLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                ) : events?.map(event => (
                  <Card key={event.id} className={`border-border/50 ${event.isArchived ? 'opacity-50 grayscale' : ''}`}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          {event.featured && <Star className="h-3 w-3 fill-primary text-primary" />}
                          <h4 className="font-bold text-sm truncate uppercase tracking-tighter">{event.name}</h4>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">{event.sport} • {event.startDate}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`h-8 w-8 hover:bg-primary/10 ${event.featured ? 'text-primary' : 'text-muted-foreground'}`} 
                          title={event.featured ? "Unfeature" : "Feature"} 
                          onClick={() => handleToggleFeatured(event)}
                        >
                          <Star className={`h-4 w-4 ${event.featured ? 'fill-primary' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" title={event.isArchived ? "Unarchive" : "Archive"} onClick={() => handleToggleArchive(event)}>
                          {event.isArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Delete Permanently" onClick={() => handleDelete(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
