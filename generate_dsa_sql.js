/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const tsCode = fs.readFileSync('data/dsaQuestions.ts', 'utf8');
// We need to parse the array carefully, since it's huge. 
// A safer way is to just compile it using ts-node or just require it if we strip the export

try {
  const getArray = new Function(
    tsCode
      .replace(/export /g, '')
      .replace(/import .*?from .*?;/g, '') + '; return dsaQuestions;'
  );
  const arr = getArray();
  
  let sql = '-- Seed 150 DSA Problems into the database\n';
  sql += '-- Ensure columns exist\n';
  sql += 'ALTER TABLE problems ADD COLUMN IF NOT EXISTS description TEXT;\n';
  sql += 'ALTER TABLE problems ADD COLUMN IF NOT EXISTS leetcode_url TEXT;\n\n';
  
  sql += 'INSERT INTO problems (id, category, title, slug, difficulty, description, leetcode_url) VALUES\n';
  
  sql += arr.map(q => {
    const id = q.id;
    const category = q.topic.replace(/'/g, "''");
    const title = q.title.replace(/'/g, "''");
    const slug = q.slug.replace(/'/g, "''");
    const difficulty = q.difficulty;
    const description = q.description.replace(/'/g, "''");
    const leetcode_url = q.leetcode_url ? `'${q.leetcode_url.replace(/'/g, "''")}'` : 'NULL';
    
    return `('${id}', '${category}', '${title}', '${slug}', '${difficulty}', '${description}', ${leetcode_url})`;
  }).join(',\n') + '\nON CONFLICT (id) DO NOTHING;';
  
  fs.writeFileSync('supabase/migrations/seed_150_dsa_problems.sql', sql);
  console.log('Successfully generated supabase/migrations/seed_150_dsa_problems.sql');
} catch (e) {
  console.error("Failed to parse array", e);
}
