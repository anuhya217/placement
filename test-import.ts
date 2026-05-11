import { extractTextFromPdfBuffer } from './lib/pdf/extract.ts';
import fs from 'fs';

async function run() {
    try {
        console.log("extractTextFromPdfBuffer:", typeof extractTextFromPdfBuffer);
    } catch (e) {
        console.error(e);
    }
}
run();
