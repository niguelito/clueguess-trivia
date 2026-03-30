import TriviaGame from '@/components/TriviaGame';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight mb-3">
            ClueGuess Trivia
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Test your knowledge with progressive clues. Challenge a friend to guess the answer!
          </p>
        </header>

        <TriviaGame />
      </div>
    </main>
  );
}
