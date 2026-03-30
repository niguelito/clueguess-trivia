"use client";

import { useState, useRef } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit3, X, BookOpen, Layers, Download, Upload, Loader2 } from 'lucide-react';
import CardEditor from '@/components/CardEditor';
import { useToast } from '@/hooks/use-toast';

export default function DeckManager() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
  const [newDeck, setNewDeck] = useState({ name: '', description: '' });
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const decksQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'decks');
  }, [db, user]);

  const { data: decks, isLoading } = useCollection(decksQuery);

  const handleCreateDeck = () => {
    if (!db || !user || !newDeck.name.trim()) return;
    
    const colRef = collection(db, 'users', user.uid, 'decks');
    const deckId = doc(colRef).id;
    const deckRef = doc(db, 'users', user.uid, 'decks', deckId);
    
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

  const handleExportDeck = async (deck: any) => {
    if (!db || !user) return;
    setIsExporting(deck.id);

    try {
      const cardsCol = collection(db, 'users', user.uid, 'decks', deck.id, 'triviaCards');
      const snapshot = await getDocs(cardsCol);
      const cards = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          mainClue: data.mainClue,
          additionalClues: data.additionalClues,
          answer: data.answer,
          categoryId: data.categoryId || "General"
        };
      });

      const exportData = {
        name: deck.name,
        description: deck.description,
        cards: cards,
        version: "1.0"
      };

      const jsonString = JSON.stringify(exportData);
      const base64String = btoa(unescape(encodeURIComponent(jsonString)));
      
      const blob = new Blob([base64String], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${deck.name.replace(/\s+/g, '_')}_deck.clueguess`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Deck "${deck.name}" has been exported.`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your deck.",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !db || !user) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const decodedString = decodeURIComponent(escape(atob(content)));
        const importedData = JSON.parse(decodedString);

        if (!importedData.name || !Array.isArray(importedData.cards)) {
          throw new Error("Invalid deck format");
        }

        const colRef = collection(db, 'users', user.uid, 'decks');
        const deckId = doc(colRef).id;
        const deckRef = doc(db, 'users', user.uid, 'decks', deckId);

        setDocumentNonBlocking(deckRef, {
          id: deckId,
          name: `${importedData.name} (Imported)`,
          description: importedData.description || "",
          createdAt: serverTimestamp(),
          ownerId: user.uid
        }, { merge: false });

        importedData.cards.forEach((card: any) => {
          const cardColRef = collection(db, 'users', user.uid, 'decks', deckId, 'triviaCards');
          const cardId = doc(cardColRef).id;
          const cardRef = doc(db, 'users', user.uid, 'decks', deckId, 'triviaCards', cardId);

          setDocumentNonBlocking(cardRef, {
            id: cardId,
            deckId,
            ownerId: user.uid,
            mainClue: card.mainClue,
            additionalClues: card.additionalClues,
            answer: card.answer,
            categoryId: card.categoryId || "General",
            createdAt: serverTimestamp()
          }, { merge: false });
        });

        toast({
          title: "Import Successful",
          description: `Deck "${importedData.name}" has been imported with ${importedData.cards.length} cards.`,
        });
      } catch (error) {
        console.error("Import failed:", error);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "Invalid file format or corrupted data.",
        });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="text-primary" /> My Trivia Decks
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".clueguess"
            className="hidden"
          />
          <Button variant="outline" onClick={handleImportClick} disabled={isImporting}>
            {isImporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="mr-2 h-4 w-4" />}
            Import Deck
          </Button>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Deck
            </Button>
          )}
        </div>
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
          You haven't created any decks yet. Start by clicking "Create Deck" or import an existing one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks?.map((deck) => (
            <Card key={deck.id} className="hover:shadow-md transition-shadow group">
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleExportDeck(deck)}
                  disabled={isExporting === deck.id}
                >
                  {isExporting === deck.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditingDeckId(deck.id)}>
                  <Edit3 className="mr-2 h-4 w-4" /> Manage
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
