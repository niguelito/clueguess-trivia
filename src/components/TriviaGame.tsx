"use client";

import { useState, useCallback } from "react";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import ClueCard from "@/components/ClueCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RefreshCcw, Layers, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TriviaGame() {
  const { user } = useUser();
  const db = useFirestore();
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Fetch all decks for selection
  const decksQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'decks');
  }, [db, user]);

  const { data: decks } = useCollection(decksQuery);

  const startPlayingDeck = useCallback(async (deckId: string) => {
    setIsLoading(true);
    setSelectedDeckId(deckId);
    try {
      const cardsCol = collection(db, 'users', user!.uid, 'decks', deckId, 'triviaCards');
      const snapshot = await getDocs(cardsCol);
      const cards = snapshot.docs.map(doc => doc.data());
      
      if (cards.length > 0) {
        // Pick a random card
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        // Map to format ClueCard expects (additionalClues -> subClues)
        setCurrentCard({
          mainClue: randomCard.mainClue,
          subClues: randomCard.additionalClues,
          answer: randomCard.answer
        });
        setRevealedCount(0);
        setShowAnswer(false);
      } else {
        setCurrentCard(null);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setIsLoading(false);
    }
  }, [db, user]);

  const fetchNextCard = useCallback(async () => {
    if (selectedDeckId) {
      startPlayingDeck(selectedDeckId);
    }
  }, [selectedDeckId, startPlayingDeck]);

  const revealNextClue = () => {
    if (currentCard && revealedCount < currentCard.subClues.length) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  if (!selectedDeckId) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <PlayCircle className="h-16 w-16 text-primary mx-auto opacity-20" />
          <h2 className="text-2xl font-bold">Select a Deck to Play</h2>
          <p className="text-muted-foreground">Pick one of your custom decks to start the challenge.</p>
        </div>

        {decks && decks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {decks.map((deck) => (
              <Card key={deck.id} className="hover:border-primary/50 cursor-pointer transition-all" onClick={() => startPlayingDeck(deck.id)}>
                <CardHeader>
                  <CardTitle className="text-lg">{deck.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{deck.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-muted text-muted-foreground">
            No decks found. Go to "Manage Decks" to create your first trivia collection!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => setSelectedDeckId(null)}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Change Deck
        </Button>
        <Button onClick={fetchNextCard} disabled={isLoading} variant="outline">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Next Card
        </Button>
      </div>

      <section className="min-h-[500px] flex items-start justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4 text-primary">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="font-medium animate-pulse">Loading the next challenge...</p>
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
            <Layers className="h-12 w-12 opacity-20" />
            <p className="text-lg font-medium">This deck has no cards yet.</p>
            <p className="text-sm">Go to Manage Decks to add cards to "{decks?.find(d => d.id === selectedDeckId)?.name}".</p>
          </div>
        )}
      </section>
    </div>
  );
}
