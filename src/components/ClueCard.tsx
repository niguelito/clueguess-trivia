"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Plus, HelpCircle, ChevronRight } from "lucide-react";
import { GenerateTriviaCardOutput } from "@/ai/flows/generate-trivia-card-flow";

interface ClueCardProps {
  card: GenerateTriviaCardOutput;
  revealedCount: number;
  showAnswer: boolean;
  onRevealNext: () => void;
  onToggleAnswer: () => void;
}

export default function ClueCard({
  card,
  revealedCount,
  showAnswer,
  onRevealNext,
  onToggleAnswer,
}: ClueCardProps) {
  const allCluesRevealed = revealedCount >= card.subClues.length;

  return (
    <Card className="w-full border-none shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
      <CardHeader className="bg-primary text-primary-foreground p-8">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="secondary" className="bg-white/20 text-white border-none px-3 py-1">
            Challenge Clue
          </Badge>
          <HelpCircle className="text-white/40 h-8 w-8" />
        </div>
        <CardTitle className="text-2xl md:text-3xl leading-snug font-headline">
          {card.mainClue}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        {/* Progressive Sub-Clues */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Progressive Clues ({revealedCount}/{card.subClues.length})
            </h3>
            {!allCluesRevealed && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRevealNext}
                className="text-accent border-accent hover:bg-accent hover:text-white transition-all group"
              >
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                Reveal Clue
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {card.subClues.map((clue, index) => (
              <div 
                key={index}
                className={`flex gap-4 p-4 rounded-xl border-l-4 transition-all duration-500 ${
                  index < revealedCount 
                    ? "bg-accent/5 border-accent opacity-100 translate-x-0" 
                    : "bg-muted/30 border-muted opacity-30 blur-[2px] pointer-events-none"
                }`}
              >
                <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-accent/10 text-accent font-bold text-xs">
                  {index + 1}
                </div>
                <p className="text-foreground/90 font-medium">
                  {clue}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Answer Section */}
        <div className="pt-8 border-t">
          <div className="flex flex-col items-center gap-6">
            <Button
              variant={showAnswer ? "ghost" : "default"}
              onClick={onToggleAnswer}
              className={`w-full max-w-xs h-12 text-lg font-semibold transition-all ${
                showAnswer ? "bg-muted hover:bg-muted/80" : "bg-primary hover:bg-primary/90"
              }`}
            >
              {showAnswer ? (
                <>
                  <EyeOff className="h-5 w-5 mr-3" /> Hide Answer
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5 mr-3" /> Show Answer
                </>
              )}
            </Button>

            {showAnswer && (
              <div className="text-center animate-in slide-in-from-top-4 duration-300">
                <span className="text-sm font-medium uppercase text-muted-foreground block mb-2">
                  The correct answer is:
                </span>
                <p className="text-4xl font-bold font-headline text-primary tracking-tight">
                  {card.answer}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
