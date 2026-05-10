-- Run once if you deployed before `schema.sql` included "Users insert own profile".
-- Needed for missing-profile auto-heal in `lib/auth/profile.ts`.

drop policy if exists "Users insert own profile" on public.profiles;

create policy "Users insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);
