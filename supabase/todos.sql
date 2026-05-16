-- Run this in the Supabase SQL Editor (Dashboard → SQL) once per project.
-- Intended for local / hackathon smoke tests only — tighten RLS before production.

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;

drop policy if exists "todos_select_anon" on public.todos;
drop policy if exists "todos_insert_anon" on public.todos;
drop policy if exists "todos_update_anon" on public.todos;
drop policy if exists "todos_delete_anon" on public.todos;

create policy "todos_select_anon"
  on public.todos for select
  to anon, authenticated
  using (true);

create policy "todos_insert_anon"
  on public.todos for insert
  to anon, authenticated
  with check (true);

create policy "todos_update_anon"
  on public.todos for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "todos_delete_anon"
  on public.todos for delete
  to anon, authenticated
  using (true);
