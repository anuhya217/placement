import * as fs from 'fs';
import { dsaQuestions } from './data/dsaQuestions';

let sql = '-- Seed 150 DSA Problems into the database\n';
sql += '-- Fix the UUID column type so we can insert string IDs like dsa-001\n';
sql += 'ALTER TABLE problems ALTER COLUMN id TYPE text USING id::text;\n';
sql += 'ALTER TABLE user_progress ALTER COLUMN problem_id TYPE text USING problem_id::text;\n\n';

sql += '-- Ensure columns exist\n';
sql += 'ALTER TABLE problems ADD COLUMN IF NOT EXISTS description TEXT;\n';
sql += 'ALTER TABLE problems ADD COLUMN IF NOT EXISTS leetcode_url TEXT;\n\n';

sql += 'INSERT INTO problems (id, category, title, slug, difficulty, description, leetcode_url) VALUES\n';

sql += dsaQuestions.map(q => {
  const id = q.id;
  const category = (q.topic || '').replace(/'/g, "''");
  const title = (q.title || '').replace(/'/g, "''");
  const slug = q.title ? q.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
  const difficulty = q.difficulty || 'Medium';
  const description = (q.description || '').replace(/'/g, "''");
  const leetcode_url = q.leetcode_url ? `'${q.leetcode_url.replace(/'/g, "''")}'` : 'NULL';
  
  return `('${id}', '${category}', '${title}', '${slug}', '${difficulty}', '${description}', ${leetcode_url})`;
}).join(',\n') + '\nON CONFLICT (id) DO NOTHING;';

fs.writeFileSync('supabase/migrations/seed_150_dsa_problems.sql', sql);
console.log('Successfully generated supabase/migrations/seed_150_dsa_problems.sql');
