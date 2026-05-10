import { PDFParse } from "pdf-parse";

export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const textResult = await parser.getText();
    return textResult.text?.trim() ?? "";
  } finally {
    await parser.destroy?.();
  }
}
