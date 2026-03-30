"use client";

import { useState } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface CardEditorProps {
  deckId: string;
  deckName: string;
}

export default function CardEditor({ deckId, deckName }: CardEditorProps) {
  const { user } = useUser();
  const db = useFirestore();
  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState({
    mainClue: '',
    additionalClues: ['', ''],
    answer: '',
  });

  const cardsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'decks', deckId, 'triviaCards');
  }, [db, user, deckId]);

  const { data: cards, isLoading } = useCollection(cardsQuery);

  const handleAddCard = () => {
    if (!db || !user || !newCard.mainClue.trim() || !newCard.answer.trim()) return;
    
    // Create a specific document reference with a pre-generated ID
    const colRef = collection(db, 'users', user.uid, 'decks', deckId, 'triviaCards');
    const cardId = doc(colRef).id;
    const cardRef = doc(db, 'users', user.uid, 'decks', deckId, 'triviaCards', cardId);
    
    // Use setDocumentNonBlocking to ensure the document ID matches the 'id' field in the data
    setDocumentNonBlocking(cardRef, {
      id: cardId,
      deckId,
      ownerId: user.uid,
      mainClue: newCard.mainClue,
      additionalClues: newCard.additionalClues.filter(c => c.trim() !== ''),
      answer: newCard.answer,
      categoryId: "General",
      createdAt: serverTimestamp()
    }, { merge: false });
    
    setNewCard({ mainClue: '', additionalClues: ['', ''], answer: '' });
    setIsAdding(false);
  };

  const handleDeleteCard = (cardId: string) => {
    if (!db || !user) return;
    const docRef = doc(db, 'users', user.uid, 'decks', deckId, 'triviaCards', cardId);
    deleteDocumentNonBlocking(docRef);
  };

  const updateAdditionalClue = (index: number, value: string) => {
    const newClues = [...newCard.additionalClues];
    newClues[index] = value;
    setNewCard({ ...newCard, additionalClues: newClues });
  };

  const addClueField = () => {
    if (newCard.additionalClues.length < 5) {
      setNewCard({ ...newCard, additionalClues: [...newCard.additionalClues, ''] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Managing Cards: {deckName}</h2>
          <p className="text-muted-foreground">{cards?.length || 0} cards in this deck</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Card
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-accent/50 shadow-md animate-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle>New Trivia Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Main Clue (Hardest)</label>
              <Textarea 
                placeholder="The initial clue shown on the card..." 
                value={newCard.mainClue}
                onChange={(e) => setNewCard({ ...newCard, mainClue: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Progressive Clues (Easier hints)</label>
                <Button variant="ghost" size="sm" onClick={addClueField} disabled={newCard.additionalClues.length >= 5}>
                  <Plus className="h-4 w-4 mr-1" /> Add Hint
                </Button>
              </div>
              {newCard.additionalClues.map((clue, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <div className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <Input 
                    placeholder={`Hint ${idx + 1}...`}
                    value={clue}
                    onChange={(e) => updateAdditionalClue(idx, e.target.value)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => {
                    const next = [...newCard.additionalClues];
                    next.splice(idx, 1);
                    setNewCard({...newCard, additionalClues: next});
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Correct Answer</label>
              <Input 
                placeholder="The answer to the riddle" 
                value={newCard.answer}
                onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleAddCard} disabled={!newCard.mainClue.trim() || !newCard.answer.trim()}>
              <Save className="mr-2 h-4 w-4" /> Save Card
            </Button>
          </CardFooter>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center p-8">Loading cards...</div>
      ) : cards?.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed text-muted-foreground">
          This deck is empty. Add your first trivia card!
        </div>
      ) : (
        <div className="space-y-4">
          {cards?.map((card) => (
            <Card key={card.id} className="bg-white/50">
              <CardContent className="p-4 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-primary">{card.mainClue}</p>
                  <p className="text-sm text-muted-foreground">Answer: <span className="font-medium text-foreground">{card.answer}</span></p>
                  <div className="flex gap-2 mt-2">
                    {card.additionalClues.map((_, i) => (
                      <div key={i} className="h-2 w-2 rounded-full bg-accent/30" />
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteCard(card.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
