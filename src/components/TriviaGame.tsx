"use client";

import { useState, useCallback } from "react";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import ClueCard from "@/components/ClueCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RefreshCcw, Layers, PlayCircle, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DEFAULT_DECKS, type DefaultTriviaCard } from "@/lib/default-decks";
import { Badge } from "@/components/ui/badge";

export default function TriviaGame() {
  const { user } = useUser();
  const db = useFirestore();
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Fetch all user decks for selection
  const decksQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'decks');
  }, [db, user]);

  const { data: userDecks } = useCollection(decksQuery);

  const startPlayingDeck = useCallback(async (deckId: string) => {
    setIsLoading(true);
    setSelectedDeckId(deckId);
    
    try {
      let cards: any[] = [];

      // Check if it's a default deck
      const defaultDeck = DEFAULT_DECKS.find(d => d.id === deckId);
      
      if (defaultDeck) {
        cards = defaultDeck.cards;
      } else if (db && user) {
        // It's a user deck, fetch from Firestore
        const cardsCol = collection(db, 'users', user.uid, 'decks', deckId, 'triviaCards');
        const snapshot = await getDocs(cardsCol);
        cards = snapshot.docs.map(doc => doc.data());
      }
      
      if (cards.length > 0) {
        // Pick a random card
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        // Map to format ClueCard expects (user cards use 'additionalClues', default use 'subClues')
        setCurrentCard({
          mainClue: randomCard.mainClue,
          subClues: randomCard.subClues || randomCard.additionalClues,
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

  const getDeckName = () => {
    const def = DEFAULT_DECKS.find(d => d.id === selectedDeckId);
    if (def) return def.name;
    const userD = userDecks?.find(d => d.id === selectedDeckId);
    return userD?.name || "Deck";
  };

  if (!selectedDeckId) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <PlayCircle className="h-16 w-16 text-primary mx-auto opacity-20" />
          <h2 className="text-2xl font-bold">Select a Deck to Play</h2>
          <p className="text-muted-foreground">Choose from our curated default decks or your own custom collection.</p>
        </div>

        {/* Default Decks Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-2">
            <Globe className="h-4 w-4" /> Curated Decks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEFAULT_DECKS.map((deck) => (
              <Card 
                key={deck.id} 
                className="hover:border-primary/50 cursor-pointer transition-all border-2 border-transparent bg-primary/5 group" 
                onClick={() => startPlayingDeck(deck.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{deck.name}</CardTitle>
                    <Badge variant="secondary">Global</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{deck.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* User Decks Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-2">
            <Layers className="h-4 w-4" /> My Custom Decks
          </h3>
          {userDecks && userDecks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userDecks.map((deck) => (
                <Card 
                  key={deck.id} 
                  className="hover:border-primary/50 cursor-pointer transition-all border-2 border-transparent group" 
                  onClick={() => startPlayingDeck(deck.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{deck.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{deck.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-muted text-muted-foreground">
              You haven't created any custom decks yet. Go to "Manage Decks" to start building your own!
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Playing Deck</span>
          <span className="font-bold text-primary truncate max-w-[200px]">{getDeckName()}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDeckId(null)}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Change Deck
          </Button>
          <Button onClick={fetchNextCard} disabled={isLoading} size="sm" className="shadow-md">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Next Card
          </Button>
        </div>
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
            <p className="text-sm">Add cards to this deck to start playing.</p>
          </div>
        )}
      </section>
    </div>
  );
}
