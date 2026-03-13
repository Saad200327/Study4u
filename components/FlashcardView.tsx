'use client';

import { useState } from 'react';
import { Flashcard } from '@/lib/aiClient';

export default function FlashcardView({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];

  const next = () => { setFlipped(false); setTimeout(() => setIndex((i) => Math.min(i + 1, cards.length - 1)), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setIndex((i) => Math.max(i - 1, 0)), 150); };

  return (
    <div className="flex flex-col items-center gap-6 animate-slide-up">
      <p className="text-apple-gray text-sm font-medium">Card {index + 1} of {cards.length}</p>

      <div
        onClick={() => setFlipped(!flipped)}
        className="w-full max-w-xl min-h-[200px] card flex items-center justify-center cursor-pointer text-center select-none hover:shadow-2xl transition-all duration-300"
        style={{ perspective: '1000px' }}
      >
        <div className={`transition-transform duration-500 w-full`} style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}>
          {!flipped ? (
            <div>
              <p className="text-xs uppercase tracking-widest text-apple-gray mb-3">Front</p>
              <p className="text-xl font-semibold text-apple-dark">{card.front}</p>
              <p className="text-xs text-apple-gray mt-4">Click to flip</p>
            </div>
          ) : (
            <div style={{ transform: 'rotateY(180deg)' }}>
              <p className="text-xs uppercase tracking-widest text-apple-blue mb-3">Back</p>
              <p className="text-lg text-apple-dark">{card.back}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={prev} disabled={index === 0} className="btn-secondary disabled:opacity-40">← Prev</button>
        <button onClick={next} disabled={index === cards.length - 1} className="btn-secondary disabled:opacity-40">Next →</button>
      </div>
    </div>
  );
}
