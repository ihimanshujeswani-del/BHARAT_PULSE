"use client";

import { useState } from "react";
import { Sparkles, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeAthletePerformance } from "@/ai/flows/athlete-performance-summary";

interface AthleteBriefingProps {
  athleteNames: string[];
}

export function AthleteBriefing({ athleteNames }: AthleteBriefingProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await summarizeAthletePerformance({ athleteNames });
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Athlete Briefing Tool
        </CardTitle>
        <Button 
          size="sm" 
          onClick={handleGenerate} 
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pulse Analysis"}
        </Button>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="text-sm leading-relaxed text-muted-foreground space-y-4 whitespace-pre-line animate-in fade-in slide-in-from-top-2">
            {summary}
          </div>
        ) : (
          <div className="flex items-start gap-3 p-3 rounded-md bg-background/50 border border-dashed border-primary/20">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Get an AI-powered summary of the current form and previous performances of the participating Indian athletes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}