// OCR is disabled in serverless environment due to timeout constraints.
// Users should convert images to PDF or text before uploading.
export async function parseImage(_buffer: Buffer): Promise<string> {
  throw new Error(
    'Image OCR is not supported in the hosted version. Please convert your image to a PDF or copy the text into a .txt file and upload that instead.'
  );
}
