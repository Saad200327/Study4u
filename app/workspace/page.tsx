'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Tabs from '@/components/Tabs';
import SummaryView from '@/components/SummaryView';
import FlashcardView from '@/components/FlashcardView';
import PracticeView from '@/components/PracticeView';
import QuizView from '@/components/QuizView';
import type { SummaryData, Flashcard, PracticeQA, QuizQuestion, Mode } from '@/lib/aiClient';

const TABS: { id: Mode; label: string; emoji: string }[] = [
  { id: 'summary', label: 'Summary', emoji: '📄' },
  { id: 'flashcards', label: 'Flashcards', emoji: '🃏' },
  { id: 'practice', label: 'Practice', emoji: '✏️' },
  { id: 'quiz', label: 'Quiz', emoji: '🧠' },
];

interface WorkspaceState {
  summary?: SummaryData;
  flashcards?: Flashcard[];
  practice?: PracticeQA[];
  quiz?: QuizQuestion[];
}

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get('doc');
  const [activeTab, setActiveTab] = useState<Mode>('summary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cache, setCache] = useState<WorkspaceState>({});

  const fetchMode = async (mode: Mode) => {
    if ((cache as Record<string, unknown>)[mode]) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, mode }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Generation failed.');
      setCache((prev) => ({ ...prev, [mode]: result.data }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchMode('summary');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const handleTabChange = (tab: Mode) => {
    setActiveTab(tab);
    fetchMode(tab);
  };

  if (!documentId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-apple-gray text-lg">No document found. <a href="/" className="text-apple-blue underline">Go back and upload.</a></p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

      <div className="mt-6">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="spinner" />
          </div>
        )}
        {error && !loading && (
          <div className="card text-center text-red-500">{error}</div>
        )}
        {!loading && !error && (
          <>
            {activeTab === 'summary' && cache.summary && <SummaryView data={cache.summary} />}
            {activeTab === 'flashcards' && cache.flashcards && <FlashcardView cards={cache.flashcards} />}
            {activeTab === 'practice' && cache.practice && <PracticeView items={cache.practice} />}
            {activeTab === 'quiz' && cache.quiz && <QuizView questions={cache.quiz} />}
          </>
        )}
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="spinner" /></div>}>
        <WorkspaceContent />
      </Suspense>
    </main>
  );
}
