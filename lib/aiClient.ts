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
  'You are a study assistant. Use ONLY the provided material. Do not invent or hallucinate any facts. Always respond with valid JSON only — no prose, no markdown fences, no code blocks.';

// All prompts now wrap arrays inside an object key to satisfy json_object format
const USER_PROMPTS: Record<Mode, string> = {
  summary:
    'Based ONLY on the material below, respond with JSON in this exact shape: {"sections":[{"heading":"string","bullets":["string"]}]}. Create sections for Key Concepts, Important Definitions, and Formulas (if present). Material:\n\n',
  flashcards:
    'Based ONLY on the material below, respond with JSON in this exact shape: {"flashcards":[{"front":"term or question","back":"definition or answer"}]}. Create 20 flashcards. Material:\n\n',
  practice:
    'Based ONLY on the material below, respond with JSON in this exact shape: {"practice":[{"question":"string","answer":"string"}]}. Create 15 open-ended Q&A pairs. Material:\n\n',
  quiz:
    'Based ONLY on the material below, respond with JSON in this exact shape: {"quiz":[{"question":"string","options":["A) ...","B) ...","C) ...","D) ..."],"correctIndex":0,"explanation":"string"}]}. Create 20 multiple-choice questions. correctIndex is 0-based. Material:\n\n',
};

const MAX_CHARS = 10000;

export async function generateStudyContent(
  text: string,
  mode: Mode
): Promise<GeneratedContent> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error('AI_API_KEY is not configured. Please contact the site admin.');

  const truncated = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) + '\n\n...[content truncated for length]' : text;
  const userMessage = USER_PROMPTS[mode] + truncated;

  let res: Response;
  try {
    res = await fetch(`${AI_BASE_URL}/chat/completions`, {
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
  } catch (networkErr) {
    throw new Error('Could not reach the AI service. Check your AI_BASE_URL setting.');
  }

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 401) throw new Error('Invalid AI API key. Please check your AI_API_KEY environment variable.');
    if (res.status === 429) throw new Error('AI rate limit hit. Please wait a moment and try again.');
    throw new Error(`AI API error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const raw: string = json.choices?.[0]?.message?.content ?? '{}';

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('AI returned malformed JSON. Try again.');
  }

  if (mode === 'summary') {
    const data = parsed as SummaryData;
    if (!data.sections || !Array.isArray(data.sections)) {
      throw new Error('AI did not return valid summary data. Try again.');
    }
    return { mode, data };
  }
  if (mode === 'flashcards') {
    const arr = (parsed.flashcards ?? parsed) as Flashcard[];
    if (!Array.isArray(arr)) throw new Error('AI did not return valid flashcard data. Try again.');
    return { mode, data: arr };
  }
  if (mode === 'practice') {
    const arr = (parsed.practice ?? parsed) as PracticeQA[];
    if (!Array.isArray(arr)) throw new Error('AI did not return valid practice data. Try again.');
    return { mode, data: arr };
  }
  // quiz
  const arr = (parsed.quiz ?? parsed) as QuizQuestion[];
  if (!Array.isArray(arr)) throw new Error('AI did not return valid quiz data. Try again.');
  return { mode, data: arr };
}
