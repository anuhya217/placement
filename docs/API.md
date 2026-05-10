# API reference

All routes are served by the Next.js App Router. AI and resume flows use **Node.js** runtimes for PDF parsing and long-running model calls.

## Authentication

- **Supabase Auth** (email/password) with HTTP-only cookies via `@supabase/ssr`.
- **Middleware** (`middleware.ts`) refreshes the session and redirects unauthenticated users away from app routes.
- **Callback**: `GET /auth/callback?code=...&next=...` exchanges an auth code for a session (email confirmation / OAuth-ready).

## Protected JSON APIs

### `POST /api/resume/analyze`

- **Auth**: Required (session).
- **Body**: `multipart/form-data` with field `file` (PDF only, max 5MB).
- **Behavior**: Extracts text with `pdf-parse` (`PDFParse`), calls OpenAI or Gemini (`services/ai/resume-analyzer.ts`), uploads the PDF to Supabase Storage bucket `resumes`, inserts a row into `resume_reports`.
- **Response**: `{ analysis: ResumeAnalysis }` where `ResumeAnalysis` matches `types/index.ts`.

### `POST /api/chat`

- **Auth**: Required (session).
- **Body**: JSON `{ messages: { role: "user" | "assistant"; content: string }[] }` (last ~12 turns recommended client-side).
- **Behavior**: Calls `coachReply` in `services/ai/chat.ts`.
- **Response**: `{ reply: string }`.

## Server actions

Declared with `"use server"` under `app/actions/`:

| Action | Purpose |
|--------|---------|
| `toggleDsaProgress` / `saveDsaNotes` | Upsert `user_progress`, update streak + `activity_log`. |
| `markSqlSolved` | Upsert `sql_progress`, streak + activity. |
| `submitMockTest` | Insert `interview_history`. |
| `adminCreateProblem`, `adminDeleteProblem`, `adminCreateSqlQuestion`, `adminDeleteSqlQuestion`, `adminSetUserRole` | Content and role management (admin profile enforced server-side). |

## Supabase RPC

- **`get_leaderboard(limit_count integer)`** — Returns leaderboard rows (see `supabase/schema.sql`). Used by `/leaderboard`.

## Environment variables

See root `.env.example`. Missing `NEXT_PUBLIC_SUPABASE_*` disables strict middleware enforcement in development so `next build` can run without secrets; configure production fully before shipping.
