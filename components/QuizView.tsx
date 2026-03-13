'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/lib/aiClient';

export default function QuizView({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.correctIndex).length
    : 0;

  const getOptionClass = (qi: number, oi: number) => {
    if (!submitted) return answers[qi] === oi ? 'bg-blue-50 border-apple-blue' : 'border-gray-200 hover:border-apple-blue hover:bg-blue-50';
    if (oi === questions[qi].correctIndex) return 'bg-green-50 border-green-500';
    if (answers[qi] === oi) return 'bg-red-50 border-red-400';
    return 'border-gray-200 opacity-60';
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {submitted && (
        <div className="card text-center bg-gradient-to-r from-blue-50 to-indigo-50 animate-fade-in">
          <p className="text-3xl font-bold text-apple-dark">{score} / {questions.length}</p>
          <p className="text-apple-gray mt-1">{score === questions.length ? '🎉 Perfect score!' : score >= questions.length * 0.7 ? '👍 Great job!' : '📚 Keep studying!'}</p>
        </div>
      )}

      {questions.map((q, qi) => (
        <div key={qi} className="card">
          <p className="font-semibold text-apple-dark mb-4">Q{qi + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <label
                key={oi}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-150 ${getOptionClass(qi, oi)}`}
              >
                <input
                  type="radio"
                  name={`q-${qi}`}
                  disabled={submitted}
                  checked={answers[qi] === oi}
                  onChange={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                  className="accent-apple-blue"
                />
                <span className="text-sm text-apple-dark">{opt}</span>
              </label>
            ))}
          </div>
          {submitted && q.explanation && (
            <p className="mt-3 text-xs text-apple-gray bg-gray-50 rounded-xl p-3">{q.explanation}</p>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < questions.length}
          className="btn-primary w-full disabled:opacity-40"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}
