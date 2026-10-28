-- Starter profile/role table only. Extend with reviewed migrations before real use.
create type public.app_role as enum ('patient', 'doctor', 'nurse', 'staff', 'admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  preferred_language text not null default 'en' check (preferred_language in ('en', 'ta', 'hi')),
  role public.app_role not null default 'patient',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile. Do NOT allow self-service role changes.
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update own basic profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- Provision profiles and privileged roles through a trusted server-side workflow.
-- Review policy behavior and migrations in a test project before production use.
