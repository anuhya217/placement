import fs from 'fs';

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/test-error', { method: 'POST' });
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));
    const text = await res.text();
    console.log('Body length:', text.length);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
run();
