-- 001_init.sql — ZeroZero base schema for Neon

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  phone text,
  city text,
  created_at timestamptz default now()
);

create table if not exists onboarding (
  user_id uuid references users(id) on delete cascade,
  question text,
  answer text,
  created_at timestamptz default now()
);

create table if not exists tips (
  id uuid primary key default gen_random_uuid(),
  city text,
  category text,
  title text not null,
  body text,
  savings_est numeric,   -- e.g., pounds/euros
  carbon_est numeric,    -- e.g., kg CO2e
  lat numeric,
  lng numeric,
  freshness_rank int,
  rotation_bucket text,  -- today | new | later
  updated_at timestamptz default now()
);

create index if not exists tips_city_bucket_idx on tips(city, rotation_bucket);

create table if not exists likes (
  user_id uuid references users(id) on delete cascade,
  tip_id uuid references tips(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, tip_id)
);

create table if not exists user_totals (
  user_id uuid primary key references users(id) on delete cascade,
  realised_savings numeric default 0,
  realised_co2 numeric default 0,
  updated_at timestamptz default now()
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  tip_id uuid references tips(id) on delete set null,
  partner text,
  price numeric,
  url text,
  in_stock boolean,
  eco_badges jsonb,
  updated_at timestamptz default now()
);

create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  city text,
  name text,
  category text,
  lat numeric,
  lng numeric,
  url text,
  source text,
  updated_at timestamptz default now()
);

create table if not exists user_tip_seen (
  user_id uuid references users(id) on delete cascade,
  tip_id uuid references tips(id) on delete cascade,
  last_seen_at timestamptz default now(),
  primary key (user_id, tip_id)
);