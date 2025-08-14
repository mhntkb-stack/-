// A smart job recommendation AI agent.
//
// - getJobRecommendations - A function that handles the job recommendation process.
// - GetJobRecommendationsInput - The input type for the getJobRecommendations function.
// - GetJobRecommendationsOutput - The return type for the getJobRecommendations function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetJobRecommendationsInputSchema = z.object({
  userProfile: z
    .string()
    .describe('The user profile, including skills, experience, and preferences.'),
  jobMarketTrends: z
    .string()
    .describe('The current job market trends and demands.'),
  pastEngagement: z
    .string()
    .describe(
      'The past engagement of the user, e.g. jobs applied to, jobs saved, etc.'
    ),
});
export type GetJobRecommendationsInput =
  z.infer<typeof GetJobRecommendationsInputSchema>;

const GetJobRecommendationsOutputSchema = z.object({
  recommendedJobs: z
    .array(z.string())
    .describe('A list of recommended jobs based on the user profile and market trends.'),
});
export type GetJobRecommendationsOutput =
  z.infer<typeof GetJobRecommendationsOutputSchema>;

export async function getJobRecommendations(
  input: GetJobRecommendationsInput
): Promise<GetJobRecommendationsOutput> {
  return getJobRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getJobRecommendationsPrompt',
  input: {schema: GetJobRecommendationsInputSchema},
  output: {schema: GetJobRecommendationsOutputSchema},
  prompt: `You are a job recommendation expert. Based on the user profile, job market trends, and past engagement, recommend a list of jobs that the user might be interested in.

User Profile: {{{userProfile}}}
Job Market Trends: {{{jobMarketTrends}}}
Past Engagement: {{{pastEngagement}}}

Provide a list of recommended jobs:`, // Removed the Handlebars if statement
});

const getJobRecommendationsFlow = ai.defineFlow(
  {
    name: 'getJobRecommendationsFlow',
    inputSchema: GetJobRecommendationsInputSchema,
    outputSchema: GetJobRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
