-- Run after initial schema — adds interview-style columns + optional LeetCode profile field.
alter table public.profiles add column if not exists leetcode_username text;

alter table public.problems add column if not exists problem_statement text;
alter table public.problems add column if not exists input_format text;
alter table public.problems add column if not exists output_format text;
alter table public.problems add column if not exists sample_io text;
alter table public.problems add column if not exists constraints_text text;
alter table public.problems add column if not exists leetcode_url text;
alter table public.problems add column if not exists interviewer_tips text;
