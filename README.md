# AI-Powered Placement Preparation Portal

Industry-style placement workspace: **DSA tracking**, **SQL interview drills**, **AI resume analysis** (PDF → ATS-oriented insights), **mock interviews** with timers and scoring, **leaderboard**, **smart topic recommendations**, **contest mode**, and an **AI placement coach** chat.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Supabase** (Postgres auth + storage + RLS), **OpenAI / Gemini**, and **shadcn-style** UI primitives (Radix + `tailwind-merge`).

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com/) project
- An OpenAI and/or Google Gemini API key for AI features

## Quick start

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local` with your Supabase URL/anon key and at least one AI provider key (see `.env.example`).

**Important:** Until `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, middleware skips session enforcement so `next build` can succeed without secrets. Use real keys locally before testing authentication or deploying.

### 1. Database & security

1. In Supabase → **SQL Editor**, run the script in `supabase/schema.sql`.
2. This creates tables (`profiles`, `problems`, `user_progress`, `sql_questions`, `mock_tests`, etc.), **RLS policies**, the **`resumes`** storage bucket, seeds sample problems/SQL/mocks, and defines **`get_leaderboard`**.
3. Confirm **Authentication → Providers → Email** is enabled.

If you already ran an older schema and sign-in redirects you to `/login` even though you’re authenticated, apply `supabase/patches/add_profiles_insert_policy.sql` in the SQL editor so the app can create a missing `profiles` row for your user id.

DSA interview bank extras (problem statements, I/O samples, LeetCode URLs, recruiter tips):

1. Run `supabase/patches/add_dsa_problem_interview_bank.sql` (adds columns + `profiles.leetcode_username`).
2. Run `supabase/seeds/dsa_interview_bank.sql` (upserts a broad curated list keyed by slug).

### 2. Promote an admin

After your first user registers, set role in SQL:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

### 3. Local development

```bash
npm run dev
```

Visit `http://localhost:3000`. Sign up, then explore `/dashboard`, `/dsa`, `/resume`, etc.

### 4. Quality checks

```bash
npx tsc --noEmit
npx eslint .
```

## Project layout

| Path | Purpose |
|------|---------|
| `app/` | Routes (marketing, auth, `(portal)` app shell), API routes, server actions |
| `components/` | UI (layout, feature modules, `components/ui/*`) |
| `lib/` | Supabase clients, queries, streak logic, PDF extraction |
| `services/ai/` | OpenAI/Gemini integrations + retries |
| `supabase/schema.sql` | Portable DDL + RLS + seeds |
| `docs/API.md` | HTTP API & actions reference |

## Deployment (Vercel + Supabase production)

1. Create a **production** Supabase project; run the same `schema.sql`.
2. Set production env vars in Vercel (**Project → Settings → Environment Variables**) matching `.env.example`.
3. In Supabase **Authentication → URL configuration**, add your Vercel URL to **Site URL** and **Redirect URLs** (`https://your-app.vercel.app/**`).
4. Connect the Git repo to Vercel and deploy; build command: `npm run build`, output: `.next`.

Ensure the **`resumes`** bucket exists (included in schema) and email confirmations align with your auth settings.

## Premium-style features included

- Leaderboard (`get_leaderboard` RPC)
- Daily streak + activity log feeding charts
- AI coach (`/api/chat`)
- Contest mode (deterministic daily problem)
- Smart recommendations (weakest DSA topics)

## License

MIT — use freely for portfolios and learning.
