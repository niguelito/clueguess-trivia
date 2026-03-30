"use client";

import { useState } from 'react';
import TriviaGame from '@/components/TriviaGame';
import DeckManager from '@/components/DeckManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn } from 'lucide-react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState("play");

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">ClueGuess Trivia</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          To start creating and playing custom trivia decks, please sign in.
        </p>
        <Button onClick={() => initiateAnonymousSignIn(auth)} size="lg">
          <LogIn className="mr-2 h-5 w-5" /> Start Playing
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-slate-50">
      <div className="w-full max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight mb-2">
            ClueGuess Trivia
          </h1>
          <p className="text-muted-foreground text-lg">
            Create your own decks or play your collection.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="play">Play Game</TabsTrigger>
              <TabsTrigger value="manage">Manage Decks</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="play" className="animate-in fade-in slide-in-from-bottom-4">
            <TriviaGame />
          </TabsContent>
          
          <TabsContent value="manage" className="animate-in fade-in slide-in-from-bottom-4">
            <DeckManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
