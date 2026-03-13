import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { setDoc } from '@/lib/documentStore';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { parseImage } from '@/lib/parsers/imageParser';
import { parseText } from '@/lib/parsers/textParser';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'text/plain', 'text/markdown'];

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
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `File type not supported: ${file.type}` }, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File too large: ${file.name}` }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      let text = '';

      if (file.type === 'application/pdf') {
        text = await parsePDF(buffer);
      } else if (file.type.startsWith('image/')) {
        text = await parseImage(buffer);
      } else {
        text = parseText(buffer);
      }

      combinedText += `\n\n=== File: ${file.name} ===\n\n${text}`;
      filenameList.push(file.name);
    }

    const documentId = uuidv4();
    setDoc(documentId, { text: combinedText.trim(), filenameList, createdAt: Date.now() });

    return NextResponse.json({ documentId, filenameList });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to process files.' }, { status: 500 });
  }
}
