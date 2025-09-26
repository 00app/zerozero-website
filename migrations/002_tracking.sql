-- 002_tracking.sql
create table if not exists onboarding_sessions (
  session_id uuid primary key,
  created_at timestamptz default now(),
  city text,
  profile jsonb
);

create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references onboarding_sessions(session_id) on delete cascade,
  kind text not null,
  tip_id uuid,
  offer_id uuid,
  meta jsonb,
  created_at timestamptz default now()
);
