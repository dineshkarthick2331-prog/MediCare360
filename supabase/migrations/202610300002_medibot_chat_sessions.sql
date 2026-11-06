-- MediCare 360 — MediBot AI Assistant Chat Session Tables
-- Migration: 202610300002_medibot_chat_sessions.sql
-- Stores chat sessions, conversation history, and audit logs securely.
-- Row Level Security (RLS) ensures users can only access their own data.

-- ─── Chat Sessions ───────────────────────────────────────────────────────────
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  preferred_language text not null default 'en' check (preferred_language in ('en', 'ta', 'hi')),
  session_summary text,
  is_active boolean not null default true
);

alter table public.chat_sessions enable row level security;

create policy "Users can read own chat sessions"
  on public.chat_sessions for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own chat sessions"
  on public.chat_sessions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own chat sessions"
  on public.chat_sessions for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Admins can read all sessions for audit purposes (use service role, not anonymous key)
-- Do not expose admin-level access through the anon key.


-- ─── Chat Messages ────────────────────────────────────────────────────────────
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  sender text not null check (sender in ('user', 'bot', 'system')),
  message_text text not null,
  language text not null default 'en' check (language in ('en', 'ta', 'hi')),
  is_emergency boolean not null default false,
  widget_type text,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

create policy "Users can read own messages"
  on public.chat_messages for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own messages"
  on public.chat_messages for insert
  to authenticated
  with check (user_id = auth.uid());

-- ─── Chatbot Audit Logs ──────────────────────────────────────────────────────
-- Tracks sensitive chatbot actions: appointment booking, prescription views, etc.
create table if not exists public.chatbot_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  details text,
  ip_hash text,
  created_at timestamptz not null default now()
);

alter table public.chatbot_audit_logs enable row level security;

-- Audit logs are write-only from the client; read only via service role (server-side).
create policy "Authenticated users can insert audit logs"
  on public.chatbot_audit_logs for insert
  to authenticated
  with check (user_id = auth.uid());

-- ─── Chatbot Appointment Bookings ─────────────────────────────────────────────
-- Stores appointments made via the MediBot chat interface.
create table if not exists public.chatbot_appointments (
  id uuid primary key default gen_random_uuid(),
  appointment_ref text not null unique,
  token_number text not null,
  patient_user_id uuid references auth.users(id) on delete set null,
  patient_name text not null,
  doctor_id text not null,
  doctor_name text not null,
  department text not null,
  appointment_date date not null,
  appointment_time text not null,
  visit_type text not null default 'New Consultation',
  status text not null default 'Confirmed' check (status in ('Confirmed', 'Cancelled', 'Completed', 'Rescheduled', 'No-show')),
  fee_inr integer not null default 0,
  session_id uuid references public.chat_sessions(id) on delete set null,
  whatsapp_sent boolean not null default false,
  sms_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chatbot_appointments enable row level security;

create policy "Patients can read own chatbot appointments"
  on public.chatbot_appointments for select
  to authenticated
  using (patient_user_id = auth.uid());

create policy "Authenticated users can insert chatbot appointments"
  on public.chatbot_appointments for insert
  to authenticated
  with check (patient_user_id = auth.uid());

create policy "Patients can update own chatbot appointment status"
  on public.chatbot_appointments for update
  to authenticated
  using (patient_user_id = auth.uid())
  with check (patient_user_id = auth.uid());

-- ─── Data Retention Indexes ───────────────────────────────────────────────────
create index if not exists idx_chat_messages_session on public.chat_messages(session_id);
create index if not exists idx_chat_messages_user on public.chat_messages(user_id);
create index if not exists idx_chat_sessions_user on public.chat_sessions(user_id);
create index if not exists idx_chatbot_appointments_patient on public.chatbot_appointments(patient_user_id);
create index if not exists idx_chatbot_audit_user on public.chatbot_audit_logs(user_id, created_at);

-- Note: Apply data retention policies via scheduled pg_cron jobs or Supabase scheduled functions:
-- DELETE FROM public.chat_messages WHERE created_at < now() - interval '90 days';
-- DELETE FROM public.chatbot_audit_logs WHERE created_at < now() - interval '365 days';
