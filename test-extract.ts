import { extractTextFromPdfBuffer } from './lib/pdf/extract.ts';
import fs from 'fs';

async function run() {
    try {
        const buffer = fs.readFileSync('large.pdf');
        console.log("Extracting text from large.pdf...");
        const text = await extractTextFromPdfBuffer(buffer);
        console.log("Success! Extracted text length:", text.length);
    } catch (e) {
        console.error("Error extracting text:", e);
    }
}
run();
