const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1';
const MODEL_NAME = process.env.MODEL_NAME || 'llama3-70b-8192';

export type Mode = 'summary' | 'flashcards' | 'practice' | 'quiz';

export interface SummaryData {
  sections: { heading: string; bullets: string[] }[];
}
export interface Flashcard { front: string; back: string; }
export interface PracticeQA { question: string; answer: string; }
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}
export type GeneratedContent =
  | { mode: 'summary'; data: SummaryData }
  | { mode: 'flashcards'; data: Flashcard[] }
  | { mode: 'practice'; data: PracticeQA[] }
  | { mode: 'quiz'; data: QuizQuestion[] };

const SYSTEM_PROMPT =
  'You are a study assistant. Use ONLY the provided material. Do not invent or hallucinate any facts not present in the input. Always respond with valid JSON only — no prose, no markdown fences.';

const USER_PROMPTS: Record<Mode, string> = {
  summary:
    'Based ONLY on the material below, produce a JSON response in this exact shape: {"sections":[{"heading":"string","bullets":["string"]}]}. Include sections like Key Concepts, Important Definitions, and Formulas if present. Material:\n\n',
  flashcards:
    'Based ONLY on the material below, produce a JSON array of 20 flashcards: [{"front":"question or term","back":"answer or definition"}]. Material:\n\n',
  practice:
    'Based ONLY on the material below, produce a JSON array of 15 open-ended Q&A pairs: [{"question":"string","answer":"string"}]. Material:\n\n',
  quiz:
    'Based ONLY on the material below, produce a JSON array of 20 multiple-choice questions: [{"question":"string","options":["A","B","C","D"],"correctIndex":0,"explanation":"string"}]. Material:\n\n',
};

const MAX_CHARS = 12000;

export async function generateStudyContent(
  text: string,
  mode: Mode
): Promise<GeneratedContent> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error('AI_API_KEY is not set in environment variables.');

  const truncated = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) + '...[truncated]' : text;
  const userMessage = USER_PROMPTS[mode] + truncated;

  const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error ${res.status}: ${err}`);
  }

  const json = await res.json();
  const raw = json.choices?.[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(raw);

  if (mode === 'summary') return { mode, data: parsed as SummaryData };
  if (mode === 'flashcards') return { mode, data: (parsed.flashcards ?? parsed) as Flashcard[] };
  if (mode === 'practice') return { mode, data: (parsed.practice ?? parsed) as PracticeQA[] };
  return { mode, data: (parsed.quiz ?? parsed) as QuizQuestion[] };
}
