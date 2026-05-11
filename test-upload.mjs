import fs from 'fs';
import path from 'path';

async function testUpload() {
  const filePath = path.join(process.cwd(), 'large.pdf');
  
  const blob = new Blob([fs.readFileSync(filePath)], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('file', blob, 'large.pdf');
  
  try {
    const res = await fetch('http://localhost:3000/api/resume/analyze', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));
    const text = await res.text();
    console.log('Response body:', text.substring(0, 500));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testUpload();
