import { NextRequest, NextResponse } from 'next/server';
import { getDoc } from '@/lib/documentStore';
import { generateStudyContent, Mode } from '@/lib/aiClient';

const VALID_MODES: Mode[] = ['summary', 'flashcards', 'practice', 'quiz'];

export async function POST(req: NextRequest) {
  try {
    const { documentId, mode } = await req.json() as { documentId: string; mode: Mode };

    if (!documentId || !mode) {
      return NextResponse.json({ error: 'documentId and mode are required.' }, { status: 400 });
    }
    if (!VALID_MODES.includes(mode)) {
      return NextResponse.json({ error: `Invalid mode: ${mode}` }, { status: 400 });
    }

    const doc = getDoc(documentId);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found. Please re-upload.' }, { status: 404 });
    }

    const result = await generateStudyContent(doc.text, mode);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: 'Failed to generate study content.' }, { status: 500 });
  }
}
