'use client';

import { useState } from 'react';
import { PracticeQA } from '@/lib/aiClient';

export default function PracticeView({ items }: { items: PracticeQA[] }) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-4 animate-slide-up">
      {items.map((item, i) => (
        <div key={i} className="card">
          <p className="font-semibold text-apple-dark mb-3">Q{i + 1}. {item.question}</p>
          {revealed[i] ? (
            <div className="mt-3 p-4 bg-blue-50 rounded-xl text-apple-dark text-sm leading-relaxed animate-fade-in">
              {item.answer}
            </div>
          ) : (
            <button
              onClick={() => setRevealed((prev) => ({ ...prev, [i]: true }))}
              className="text-apple-blue text-sm font-medium hover:underline"
            >
              Show Answer
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
