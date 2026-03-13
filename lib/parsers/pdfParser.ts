export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamically import pdfjs to avoid bundling issues
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs' as string);
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';

    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true });
    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .filter((item: { str?: string }) => 'str' in item)
        .map((item: { str?: string }) => item.str)
        .join(' ');
      fullText += `\n--- Page ${i} ---\n${pageText}`;
    }
    return fullText.trim();
  } catch (err) {
    console.error('PDF parse error:', err);
    throw new Error('Failed to extract text from PDF. Make sure the PDF is not password-protected.');
  }
}
