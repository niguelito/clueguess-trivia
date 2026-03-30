"use client";

import { useState } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit3, X, BookOpen, Layers } from 'lucide-react';
import CardEditor from '@/components/CardEditor';

export default function DeckManager() {
  const { user } = useUser();
  const db = useFirestore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
  const [newDeck, setNewDeck] = useState({ name: '', description: '' });

  const decksQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'decks');
  }, [db, user]);

  const { data: decks, isLoading } = useCollection(decksQuery);

  const handleCreateDeck = () => {
    if (!db || !user || !newDeck.name.trim()) return;
    
    // Create a specific document reference with a pre-generated ID
    const colRef = collection(db, 'users', user.uid, 'decks');
    const deckId = doc(colRef).id;
    const deckRef = doc(db, 'users', user.uid, 'decks', deckId);
    
    // Use setDocumentNonBlocking to ensure the document ID matches the 'id' field in the data
    setDocumentNonBlocking(deckRef, {
      id: deckId,
      name: newDeck.name,
      description: newDeck.description,
      createdAt: serverTimestamp(),
      ownerId: user.uid
    }, { merge: false });
    
    setNewDeck({ name: '', description: '' });
    setIsCreating(false);
  };

  const handleDeleteDeck = (deckId: string) => {
    if (!db || !user) return;
    const docRef = doc(db, 'users', user.uid, 'decks', deckId);
    deleteDocumentNonBlocking(docRef);
  };

  if (editingDeckId) {
    const deck = decks?.find(d => d.id === editingDeckId);
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setEditingDeckId(null)} className="mb-4">
          <X className="mr-2 h-4 w-4" /> Back to Decks
        </Button>
        {deck && <CardEditor deckId={deck.id} deckName={deck.name} />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="text-primary" /> My Trivia Decks
        </h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Deck
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader>
            <CardTitle>New Trivia Deck</CardTitle>
            <CardDescription>Give your deck a name and optional description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Deck Name</label>
              <Input 
                placeholder="e.g., 80s Movies, Animal Kingdom" 
                value={newDeck.name}
                onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="What is this deck about?" 
                value={newDeck.description}
                onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button onClick={handleCreateDeck} disabled={!newDeck.name.trim()}>Create</Button>
          </CardFooter>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center p-12">Loading decks...</div>
      ) : decks?.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed text-muted-foreground">
          You haven't created any decks yet. Start by clicking "Create Deck".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks?.map((deck) => (
            <Card key={deck.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{deck.name}</span>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription className="line-clamp-2 h-10">
                  {deck.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-end gap-2 border-t pt-4 bg-slate-50/50">
                <Button variant="outline" size="sm" onClick={() => setEditingDeckId(deck.id)}>
                  <Edit3 className="mr-2 h-4 w-4" /> Manage Cards
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteDeck(deck.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
