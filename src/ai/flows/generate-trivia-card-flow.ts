'use server';
/**
 * @fileOverview A Genkit flow that generates a unique trivia card, including a main clue, up to five progressive sub-clues, and the correct answer, based on provided categories.
 *
 * - generateTriviaCard - A function that handles the trivia card generation process.
 * - GenerateTriviaCardInput - The input type for the generateTriviaCard function.
 * - GenerateTriviaCardOutput - The return type for the generateTriviaCard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTriviaCardInputSchema = z.object({
  categories: z
    .array(z.string())
    .describe(
      'An array of trivia categories to generate the card from (e.g., "History", "Science", "Pop Culture").'
    ),
});
export type GenerateTriviaCardInput = z.infer<
  typeof GenerateTriviaCardInputSchema
>;

const GenerateTriviaCardOutputSchema = z.object({
  mainClue: z
    .string()
    .describe('The primary, most challenging clue for the trivia question.'),
  subClues: z
    .array(z.string())
    .max(5)
    .describe(
      'An array of up to 5 additional clues, progressively getting easier, that lead to the answer. If less than 5 clues are generated, return fewer elements in the array.'
    ),
  answer: z.string().describe('The correct answer to the trivia question.'),
});
export type GenerateTriviaCardOutput = z.infer<
  typeof GenerateTriviaCardOutputSchema
>;

export async function generateTriviaCard(
  input: GenerateTriviaCardInput
): Promise<GenerateTriviaCardOutput> {
  return generateTriviaCardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTriviaCardPrompt',
  input: {schema: GenerateTriviaCardInputSchema},
  output: {schema: GenerateTriviaCardOutputSchema},
  prompt: `You are an expert trivia question generator. Your task is to create a unique trivia card based on the provided categories.

The card must contain a main clue, up to five progressive sub-clues, and the correct answer.
The sub-clues should progressively offer more hints, making the answer easier to guess with each additional clue. Each sub-clue should be distinct and provide new information.
Ensure the question is challenging yet solvable with the given clues.

Categories: {{{categories}}}

Output MUST be a JSON object conforming to the following schema:
{{json_schema GenerateTriviaCardOutputSchema}}`,
});

const generateTriviaCardFlow = ai.defineFlow(
  {
    name: 'generateTriviaCardFlow',
    inputSchema: GenerateTriviaCardInputSchema,
    outputSchema: GenerateTriviaCardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate trivia card output.');
    }
    return output;
  }
);
