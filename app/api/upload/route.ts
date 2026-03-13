import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { setDoc } from '@/lib/documentStore';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { parseText } from '@/lib/parsers/textParser';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_TYPES = ['application/pdf', 'text/plain', 'text/markdown'];
const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.md'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
    }

    let combinedText = '';
    const filenameList: string[] = [];

    for (const file of files) {
      // Check by extension as fallback since browsers sometimes mis-report MIME types
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const validType = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);

      if (!validType) {
        return NextResponse.json(
          { error: `File type not supported: ${file.name}. Please upload PDF, TXT, or MD files.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File too large: ${file.name} (max 20MB).` }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      let text = '';

      if (file.type === 'application/pdf' || ext === '.pdf') {
        text = await parsePDF(buffer);
      } else {
        text = parseText(buffer);
      }

      if (!text || text.trim().length < 20) {
        return NextResponse.json(
          { error: `Could not extract text from ${file.name}. The file may be empty or image-only.` },
          { status: 400 }
        );
      }

      combinedText += `\n\n=== File: ${file.name} ===\n\n${text}`;
      filenameList.push(file.name);
    }

    const documentId = uuidv4();
    setDoc(documentId, { text: combinedText.trim(), filenameList, createdAt: Date.now() });

    return NextResponse.json({ documentId, filenameList });
  } catch (err: unknown) {
    console.error('Upload error:', err);
    const message = err instanceof Error ? err.message : 'Failed to process files.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
