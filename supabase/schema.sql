-- AI-Powered Placement Preparation Portal — PostgreSQL schema for Supabase
-- Run in Supabase SQL Editor or via CLI after linking the project.

-- Extensions
create extension if not exists "pgcrypto";

-- Enum-like checks via text + constraint (portable)

-- Profiles mirror auth.users
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  avatar_url text,
  leetcode_username text,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.problems (
  id uuid primary key default gen_random_uuid(),
  category text not null check (
    category in (
      'Arrays',
      'Strings',
      'Trees',
      'Graphs',
      'Dynamic Programming',
      'Greedy',
      'Recursion'
    )
  ),
  title text not null,
  slug text unique,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  description text,
  problem_statement text,
  input_format text,
  output_format text,
  sample_io text,
  constraints_text text,
  leetcode_url text,
  interviewer_tips text,
  created_at timestamptz not null default now()
);

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  problem_id uuid not null references public.problems (id) on delete cascade,
  solved boolean not null default false,
  notes text,
  updated_at timestamptz not null default now(),
  unique (user_id, problem_id)
);

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_date date not null default (timezone ('utc', now()))::date,
  problems_solved integer not null default 0,
  unique (user_id, activity_date)
);

create table public.sql_questions (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  question_text text not null,
  hints text,
  solution_sql text,
  explanation text,
  created_at timestamptz not null default now()
);

create table public.sql_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  sql_question_id uuid not null references public.sql_questions (id) on delete cascade,
  solved boolean not null default false,
  attempts integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, sql_question_id)
);

create table public.resume_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text,
  file_name text,
  ats_score integer,
  report jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.mock_tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  test_type text not null check (test_type in ('hr', 'technical', 'aptitude')),
  duration_minutes integer not null default 30,
  questions jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.interview_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mock_test_id uuid references public.mock_tests (id) on delete set null,
  score numeric not null default 0,
  max_score numeric not null default 100,
  answers jsonb default '[]'::jsonb,
  duration_seconds integer,
  completed_at timestamptz not null default now()
);

-- Indexes
create index idx_user_progress_user on public.user_progress (user_id);
create index idx_user_progress_problem on public.user_progress (problem_id);
create index idx_activity_log_user_date on public.activity_log (user_id, activity_date desc);
create index idx_sql_progress_user on public.sql_progress (user_id);
create index idx_resume_reports_user on public.resume_reports (user_id, created_at desc);
create index idx_interview_history_user on public.interview_history (user_id, completed_at desc);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

-- New user → profile row
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.problems enable row level security;
alter table public.user_progress enable row level security;
alter table public.activity_log enable row level security;
alter table public.sql_questions enable row level security;
alter table public.sql_progress enable row level security;
alter table public.resume_reports enable row level security;
alter table public.mock_tests enable row level security;
alter table public.interview_history enable row level security;

-- Helper: is admin
create or replace function public.is_admin(uid uuid)
returns boolean as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.role = 'admin'
  );
$$ language sql stable security definer set search_path = public;

-- Profiles
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin(auth.uid()));

-- Allow first-time row if the auth trigger did not run (migrations / manual users)
create policy "Users insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users update own profile row"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins update any profile"
  on public.profiles for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (
    public.is_admin(auth.uid()) or auth.uid() = id
  );

-- Problems
create policy "Authenticated read problems"
  on public.problems for select
  to authenticated
  using (true);

create policy "Admin insert problems"
  on public.problems for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

create policy "Admin update problems"
  on public.problems for update
  to authenticated
  using (public.is_admin(auth.uid()));

create policy "Admin delete problems"
  on public.problems for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- User progress
create policy "Own progress select"
  on public.user_progress for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Own progress insert"
  on public.user_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Own progress update"
  on public.user_progress for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Own progress delete"
  on public.user_progress for delete
  to authenticated
  using (auth.uid() = user_id);

-- Activity log
create policy "Own activity select"
  on public.activity_log for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Own activity upsert"
  on public.activity_log for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Own activity update"
  on public.activity_log for update
  to authenticated
  using (auth.uid() = user_id);

-- SQL questions
create policy "Authenticated read sql_questions"
  on public.sql_questions for select
  to authenticated
  using (true);

create policy "Admin manage sql_questions"
  on public.sql_questions for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- SQL progress
create policy "Own sql_progress"
  on public.sql_progress for all
  to authenticated
  using (auth.uid() = user_id or public.is_admin(auth.uid()))
  with check (auth.uid() = user_id);

-- Resume reports
create policy "Own resume_reports"
  on public.resume_reports for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Own resume_reports insert"
  on public.resume_reports for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Own resume_reports update"
  on public.resume_reports for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Own resume_reports delete"
  on public.resume_reports for delete
  to authenticated
  using (auth.uid() = user_id);

-- Mock tests
create policy "Read published mock tests"
  on public.mock_tests for select
  to authenticated
  using (is_published = true or public.is_admin(auth.uid()));

create policy "Admin manage mock_tests"
  on public.mock_tests for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Interview history
create policy "Own interview_history"
  on public.interview_history for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Own interview_history insert"
  on public.interview_history for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Own interview_history update"
  on public.interview_history for update
  to authenticated
  using (auth.uid() = user_id);

-- Storage: resumes bucket (run policies in Dashboard or extend here)
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

create policy "Users upload own resumes"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users read own resumes"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete own resumes"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Leaderboard view (DSA solved counts)
create or replace view public.leaderboard_view as
select
  p.id,
  p.full_name,
  p.avatar_url,
  p.current_streak,
  count(up.id) filter (where up.solved) as dsa_solved
from public.profiles p
left join public.user_progress up on up.user_id = p.id
group by p.id, p.full_name, p.avatar_url, p.current_streak;

-- Grant select on view to authenticated (RLS not on views — restrict via security invoker in PG15+)
-- For Supabase, expose via RPC instead if needed:
create or replace function public.get_leaderboard(limit_count integer default 50)
returns table (
  id uuid,
  full_name text,
  avatar_url text,
  current_streak integer,
  dsa_solved bigint
) as $$
begin
  return query
  select v.id, v.full_name, v.avatar_url, v.current_streak, v.dsa_solved
  from public.leaderboard_view v
  order by v.dsa_solved desc, v.current_streak desc
  limit limit_count;
end;
$$ language plpgsql stable security definer set search_path = public;

grant execute on function public.get_leaderboard(integer) to authenticated;

-- Sample data
insert into public.problems (category, title, slug, difficulty, description) values
('Arrays', 'Two Sum', 'two-sum', 'Easy', 'Find two indices that sum to target.'),
('Arrays', 'Maximum Subarray', 'maximum-subarray', 'Medium', 'Classic Kadane.'),
('Strings', 'Valid Parentheses', 'valid-parentheses', 'Easy', 'Stack-based validation.'),
('Trees', 'Binary Tree Inorder Traversal', 'binary-tree-inorder', 'Easy', 'Recursive / iterative inorder.'),
('Graphs', 'Number of Islands', 'number-of-islands', 'Medium', 'DFS/BFS on grid.'),
('Dynamic Programming', 'Climbing Stairs', 'climbing-stairs', 'Easy', 'Fibonacci-style DP.'),
('Greedy', 'Jump Game', 'jump-game', 'Medium', 'Greedy reachability.'),
('Recursion', 'Fibonacci', 'fibonacci', 'Easy', 'Baseline recursion vs memoization.')
on conflict (slug) do nothing;

insert into public.sql_questions (category, title, difficulty, question_text, solution_sql, explanation) values
('Window Functions', 'Running total sales', 'Medium',
 'Given orders(order_id, amount, order_date), compute running sum of amount per day ordering.',
 'select order_date, amount, sum(amount) over (order by order_date rows unbounded preceding) as running_total from orders;',
 'Demonstrates cumulative window frame.'),
('Joins', 'Employees and departments', 'Easy',
 'List employee names with department names using INNER JOIN.',
 'select e.name, d.name as dept from employees e join departments d on e.dept_id = d.id;',
 'Basic relational join pattern.'),
('Ranking', 'Top 3 salaries per department', 'Hard',
 'Using window functions, return top 3 salaries in each department.',
 'select * from (select name, dept_id, salary, dense_rank() over (partition by dept_id order by salary desc) as rnk from employees) t where rnk <= 3;',
 'dense_rank handles ties gracefully.')
;

insert into public.mock_tests (title, test_type, duration_minutes, questions, is_published) values
(
  'HR Screening — Fundamentals',
  'hr',
  15,
  '[
    {"id":"h1","prompt":"Tell me about yourself in under two minutes.","points":10},
    {"id":"h2","prompt":"Describe a conflict you resolved on a team.","points":10},
    {"id":"h3","prompt":"Why do you want this role?","points":10}
  ]'::jsonb,
  true
),
(
  'Technical — Data Structures',
  'technical',
  20,
  '[
    {"id":"t1","prompt":"What is the time complexity of lookup in a balanced BST?","choices":["O(1)","O(log n)","O(n)","O(n log n)"],"correctIndex":1,"points":10},
    {"id":"t2","prompt":"Which structure is best for LRU cache?","choices":["Queue","Hash map + doubly linked list","Array","Stack"],"correctIndex":1,"points":10}
  ]'::jsonb,
  true
),
(
  'Aptitude — Quick Math',
  'aptitude',
  12,
  '[
    {"id":"a1","prompt":"If a train travels 120km in 2 hours, what is its average speed?","choices":["40 km/h","50 km/h","60 km/h","80 km/h"],"correctIndex":2,"points":5},
    {"id":"a2","prompt":"20% of 450 is?","choices":["80","85","90","95"],"correctIndex":2,"points":5}
  ]'::jsonb,
  true
);
