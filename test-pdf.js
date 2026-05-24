const fs = require('fs');
const pdf = require('pdf-parse');
async function run() {
  try {
    const buf = fs.readFileSync('dummy.pdf');
    const text = await pdf(buf);
    console.log("SUCCESS", text.text);
  } catch (e) {
    console.error("FAIL", e);
  }
}
run();
