'use server';
/**
 * @fileOverview A Genkit flow for generating a summary of participating Indian athletes' recent form and key achievements.
 *
 * - summarizeAthletePerformance - A function that handles the generation of the athlete performance summary.
 * - AthletePerformanceSummaryInput - The input type for the summarizeAthletePerformance function.
 * - AthletePerformanceSummaryOutput - The return type for the summarizeAthletePerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AthletePerformanceSummaryInputSchema = z.object({
  athleteNames: z.array(z.string()).describe('A list of names of Indian athletes.'),
});
export type AthletePerformanceSummaryInput = z.infer<typeof AthletePerformanceSummaryInputSchema>;

// Output Schema
const AthletePerformanceSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the athletes\' recent form and key achievements.'),
});
export type AthletePerformanceSummaryOutput = z.infer<typeof AthletePerformanceSummaryOutputSchema>;

// Wrapper function to call the flow
export async function summarizeAthletePerformance(
  input: AthletePerformanceSummaryInput
): Promise<AthletePerformanceSummaryOutput> {
  return athletePerformanceSummaryFlow(input);
}

// Prompt definition
const athletePerformanceSummaryPrompt = ai.definePrompt({
  name: 'athletePerformanceSummaryPrompt',
  input: {schema: AthletePerformanceSummaryInputSchema},
  output: {schema: AthletePerformanceSummaryOutputSchema},
  prompt: `You are an expert sports analyst providing concise summaries of athlete performance.
For the following Indian athletes, provide a brief summary of their recent form, key achievements, and potential impact.
If you don't have specific information for an athlete, state that politely.

Athletes:
{{#each athleteNames}}
- {{{this}}}
{{/each}}

Please provide the summary in a paragraph format for each athlete, then an overall concluding remark about the group's potential impact.
`,
});

// Flow definition
const athletePerformanceSummaryFlow = ai.defineFlow(
  {
    name: 'athletePerformanceSummaryFlow',
    inputSchema: AthletePerformanceSummaryInputSchema,
    outputSchema: AthletePerformanceSummaryOutputSchema,
  },
  async input => {
    const {output} = await athletePerformanceSummaryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate athlete performance summary.');
    }
    return output;
  }
);
