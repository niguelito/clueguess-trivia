"use client";

import { useState, useCallback } from "react";
import { generateTriviaCard, GenerateTriviaCardOutput } from "@/ai/flows/generate-trivia-card-flow";
import ClueCard from "@/components/ClueCard";
import CategorySelector from "@/components/CategorySelector";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RefreshCcw } from "lucide-react";

export default function TriviaGame() {
  const [categories, setCategories] = useState<string[]>(["General Knowledge"]);
  const [currentCard, setCurrentCard] = useState<GenerateTriviaCardOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchNextCard = useCallback(async () => {
    setIsLoading(true);
    try {
      const card = await generateTriviaCard({ categories });
      setCurrentCard(card);
      setRevealedCount(0);
      setShowAnswer(false);
    } catch (error) {
      console.error("Failed to generate card:", error);
    } finally {
      setIsLoading(false);
    }
  }, [categories]);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const revealNextClue = () => {
    if (currentCard && revealedCount < currentCard.subClues.length) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-12">
      {/* Configuration Section */}
      <section className="bg-white/50 border border-white p-6 rounded-2xl shadow-sm backdrop-blur-sm">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-accent" /> Configure Game
        </h2>
        
        <div className="space-y-8">
          <div>
            <Label className="text-base font-semibold block mb-4">Choose Categories</Label>
            <CategorySelector 
              selectedCategories={categories} 
              onToggleCategory={toggleCategory} 
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={fetchNextCard}
              disabled={isLoading || categories.length === 0}
              size="lg"
              className="px-8 h-14 text-lg font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" /> Generating...
                </>
              ) : currentCard ? (
                <>
                  <RefreshCcw className="h-5 w-5 mr-3" /> New Trivia Card
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-3" /> Start Game
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Card Display Area */}
      <section className="min-h-[600px] flex items-start justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4 text-primary">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="font-medium animate-pulse">Brainstorming the perfect clues...</p>
          </div>
        ) : currentCard ? (
          <ClueCard
            card={currentCard}
            revealedCount={revealedCount}
            showAnswer={showAnswer}
            onRevealNext={revealNextClue}
            onToggleAnswer={() => setShowAnswer(!showAnswer)}
          />
        ) : (
          <div className="text-center p-20 border-2 border-dashed border-muted rounded-3xl w-full flex flex-col items-center gap-4 text-muted-foreground">
            <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mb-2">
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium">Select categories and click "Start Game" to begin.</p>
          </div>
        )}
      </section>
    </div>
  );
}

// Minimalist Label for localized use if needed, but we imported it from UI
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}>{children}</label>;
}
