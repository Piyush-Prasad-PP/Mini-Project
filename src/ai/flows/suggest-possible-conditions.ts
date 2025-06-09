// src/ai/flows/suggest-possible-conditions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests possible medical conditions based on user-provided symptoms.
 *
 * - suggestPossibleConditions - An asynchronous function that takes user-reported symptoms as input and returns a list of possible medical conditions.
 * - SuggestPossibleConditionsInput - The input type for the suggestPossibleConditions function, representing user-reported symptoms.
 * - SuggestPossibleConditionsOutput - The output type for the suggestPossibleConditions function, representing a list of possible medical conditions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPossibleConditionsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A description of the symptoms the user is experiencing.'),
});

export type SuggestPossibleConditionsInput = z.infer<
  typeof SuggestPossibleConditionsInputSchema
>;

const SuggestPossibleConditionsOutputSchema = z.object({
  possibleConditions: z
    .array(z.string())
    .describe('A list of possible medical conditions the user might have.'),
});

export type SuggestPossibleConditionsOutput = z.infer<
  typeof SuggestPossibleConditionsOutputSchema
>;

export async function suggestPossibleConditions(
  input: SuggestPossibleConditionsInput
): Promise<SuggestPossibleConditionsOutput> {
  return suggestPossibleConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPossibleConditionsPrompt',
  input: {schema: SuggestPossibleConditionsInputSchema},
  output: {schema: SuggestPossibleConditionsOutputSchema},
  prompt: `You are a medical expert. A patient will describe their symptoms to you.
  Based on these symptoms, suggest a list of possible medical conditions they might have.
  Return only a JSON array of strings representing those conditions. Do not provide any additional information.
  Symptoms: {{{symptoms}}} `,
});

const suggestPossibleConditionsFlow = ai.defineFlow(
  {
    name: 'suggestPossibleConditionsFlow',
    inputSchema: SuggestPossibleConditionsInputSchema,
    outputSchema: SuggestPossibleConditionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
