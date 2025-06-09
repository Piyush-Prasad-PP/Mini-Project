"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { suggestPossibleConditions, type SuggestPossibleConditionsOutput } from "@/ai/flows/suggest-possible-conditions";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Metadata } from 'next';

// Cannot add metadata directly in client component, would need a separate layout or page.tsx for static metadata.
// For now, title can be set in RootLayout template.

const formSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters." }).max(1000),
});
type SymptomFormValues = z.infer<typeof formSchema>;

export default function SymptomCheckerPage() {
  const [results, setResults] = useState<SuggestPossibleConditionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const onSubmit: SubmitHandler<SymptomFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const response = await suggestPossibleConditions({ symptoms: data.symptoms });
      setResults(response);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError("Failed to get suggestions. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <AuthGuard requiredRoles={["patient"]}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-headline flex items-center justify-center gap-2">
            <Lightbulb className="h-8 w-8 text-primary" /> AI Symptom Checker
          </h1>
          <p className="text-muted-foreground mt-2">
            Describe your symptoms, and our AI will suggest possible conditions.
          </p>
        </header>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Enter Your Symptoms</CardTitle>
            <CardDescription>
              Please provide a detailed description of how you&apos;re feeling. This tool provides informational suggestions and is not a substitute for professional medical advice.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="symptoms">Symptoms Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="symptoms"
                          placeholder="e.g., I have a persistent cough, fever, and headache for the last 3 days..."
                          rows={5}
                          {...field}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-4">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Suggestions...
                    </>
                  ) : (
                    <>
                     <Sparkles className="mr-2 h-4 w-4" /> Get AI Suggestions
                    </>
                  )}
                </Button>
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Important Disclaimer</AlertTitle>
                  <AlertDescription>
                    This tool is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment.
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {error && (
          <Alert variant="destructive" className="mt-6 max-w-2xl mx-auto">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && results.possibleConditions.length > 0 && (
          <Card className="mt-8 max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-accent" /> Possible Conditions
              </CardTitle>
              <CardDescription>
                Based on your symptoms, here are some possibilities. Please discuss these with a doctor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside">
                {results.possibleConditions.map((condition, index) => (
                  <li key={index} className="text-foreground">
                    {condition}
                  </li>
                ))}
              </ul>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">Remember to consult a healthcare professional for an accurate diagnosis.</p>
            </CardFooter>
          </Card>
        )}
         {results && results.possibleConditions.length === 0 && !isLoading && (
            <Card className="mt-8 max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>No Specific Conditions Identified</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The AI could not identify specific conditions based on the symptoms provided, or the symptoms were too general. Please try to be more specific or consult a healthcare professional.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </AuthGuard>
  );
}
