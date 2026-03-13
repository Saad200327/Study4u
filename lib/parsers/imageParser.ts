import Tesseract from 'tesseract.js';

export async function parseImage(buffer: Buffer): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
  return text;
}
