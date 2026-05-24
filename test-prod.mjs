import fs from 'fs';
import path from 'path';

async function testUploadProd() {
  const filePath = path.join(process.cwd(), 'dummy.pdf');
  fs.writeFileSync(filePath, 'dummy pdf content');
  
  const blob = new Blob([fs.readFileSync(filePath)], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('file', blob, 'dummy.pdf');
  
  try {
    const res = await fetch('https://placement-cfkh.vercel.app/api/resume/analyze', {
      method: 'POST',
      body: formData,
      redirect: 'manual'
    });
    
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));
    const text = await res.text();
    console.log('Response body length:', text.length);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testUploadProd();
