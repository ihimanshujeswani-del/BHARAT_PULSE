"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useFirestore } from "@/firebase/provider";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { MOCK_SPORTS } from "@/lib/mock-data";
import { ArrowLeft, Loader2, Save, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
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
    indianParticipation: true
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
        description: "Event has been successfully added to the database.",
      });

      // Clear form
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
        indianParticipation: true
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the event. Please try again.",
      });
    } finally {
      setLoading(false);
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
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Public View
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-headline">ADMIN <span className="text-primary">DASHBOARD</span></h1>
              <p className="text-muted-foreground">Manage the BharatPulse Sports event database.</p>
            </div>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center gap-2 text-primary">
                <PlusCircle className="h-5 w-5" />
                <CardTitle className="text-xl">Add New Sports Event</CardTitle>
              </div>
              <CardDescription>Fill in the details to list a new event on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Basic Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Event Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="e.g. All England Open 2025" 
                        required 
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sport">Sport Name</Label>
                        <Input 
                          id="sport" 
                          name="sport" 
                          placeholder="e.g. Badminton" 
                          required 
                          value={formData.sport}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sportSlug">Sport Category</Label>
                        <Select 
                          value={formData.sportSlug} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, sportSlug: value }))}
                        >
                          <SelectTrigger id="sportSlug">
                            <SelectValue placeholder="Select Sport" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_SPORTS.filter(s => s.slug !== 'all').map((sport) => (
                              <SelectItem key={sport.id} value={sport.slug}>{sport.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input 
                          id="startDate" 
                          name="startDate" 
                          type="date" 
                          required 
                          value={formData.startDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input 
                          id="endDate" 
                          name="endDate" 
                          type="date" 
                          required 
                          value={formData.endDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Host City</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          placeholder="e.g. Birmingham" 
                          required 
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input 
                          id="country" 
                          name="country" 
                          placeholder="e.g. United Kingdom" 
                          required 
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Secondary Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="level">Competition Level</Label>
                        <Select 
                          value={formData.level} 
                          onValueChange={(value: any) => setFormData(prev => ({ ...prev, level: value }))}
                        >
                          <SelectTrigger id="level">
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="International">International</SelectItem>
                            <SelectItem value="National">National</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Current Status</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="Live">Live</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Input 
                        id="eventType" 
                        name="eventType" 
                        placeholder="e.g. BWF World Tour Super 1000" 
                        value={formData.eventType}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventUrl">Official Website URL</Label>
                      <Input 
                        id="eventUrl" 
                        name="eventUrl" 
                        placeholder="https://..." 
                        value={formData.eventUrl}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="streamUrl">Broadcasting/Stream URL</Label>
                      <Input 
                        id="streamUrl" 
                        name="streamUrl" 
                        placeholder="https://..." 
                        value={formData.streamUrl}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-secondary/20">
                      <div className="space-y-0.5">
                        <Label>Qualification Event</Label>
                        <p className="text-xs text-muted-foreground">Does this event offer qualification spots?</p>
                      </div>
                      <Switch 
                        checked={formData.qualificationEvent}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, qualificationEvent: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="indianParticipants">Indian Participants (Comma separated)</Label>
                  <Textarea 
                    id="indianParticipants" 
                    name="indianParticipants" 
                    placeholder="e.g. PV Sindhu, Lakshya Sen, HS Prannoy" 
                    className="min-h-[100px]"
                    value={formData.indianParticipants}
                    onChange={handleInputChange}
                  />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Separate names with commas</p>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto min-w-[200px] bg-primary hover:bg-primary/90" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Event
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-6 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest italic">
            BharatPulse Admin Console &copy; 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
