-- SnapCut AI — Phase 1 MVP Schema
-- Run this in Supabase SQL editor or via supabase db push

-- ─── Extensions ──────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── Users ───────────────────────────────────────────────────────────────
create table if not exists public.users (
  id                uuid primary key default uuid_generate_v4(),
  email             text unique not null,
  name              text,
  image             text,
  plan              text not null default 'free'
                    check (plan in ('free', 'pro', 'business')),
  credits_used      integer not null default 0,
  credits_reset_at  timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- ─── Images ───────────────────────────────────────────────────────────────
create table if not exists public.images (
  id                        uuid primary key default uuid_generate_v4(),
  user_id                   uuid references public.users(id) on delete cascade,
  original_url              text not null,
  processed_url             text,
  cloudinary_original_id    text,
  cloudinary_processed_id   text,
  tool_used                 text not null
                            check (tool_used in (
                              'background_remover',
                              'white_background',
                              'passport_photo',
                              'linkedin_photo',
                              'instagram_dp'
                            )),
  status                    text not null default 'pending'
                            check (status in ('pending', 'processing', 'completed', 'failed')),
  metadata                  jsonb not null default '{}',
  file_size_bytes           integer,
  created_at                timestamptz not null default now()
);

create index if not exists idx_images_user_id on public.images(user_id);
create index if not exists idx_images_created_at on public.images(created_at desc);
create index if not exists idx_images_tool_used on public.images(tool_used);

-- ─── Subscriptions ────────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid unique references public.users(id) on delete cascade,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  stripe_price_id         text,
  status                  text
                          check (status in (
                            'active', 'canceled', 'past_due',
                            'trialing', 'incomplete'
                          )),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ─── Usage Logs ───────────────────────────────────────────────────────────
create table if not exists public.usage_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete cascade,
  action      text not null,
  tool        text,
  image_id    uuid references public.images(id) on delete set null,
  ip_address  text,
  timestamp   timestamptz not null default now()
);

create index if not exists idx_usage_logs_user_id on public.usage_logs(user_id);
create index if not exists idx_usage_logs_timestamp on public.usage_logs(timestamp desc);

-- ─── Row Level Security ───────────────────────────────────────────────────
alter table public.users         enable row level security;
alter table public.images        enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_logs    enable row level security;

-- Users: read/update own row only
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- Images: full CRUD on own rows
create policy "images_select_own" on public.images
  for select using (auth.uid() = user_id);

create policy "images_insert_own" on public.images
  for insert with check (auth.uid() = user_id);

create policy "images_update_own" on public.images
  for update using (auth.uid() = user_id);

create policy "images_delete_own" on public.images
  for delete using (auth.uid() = user_id);

-- Subscriptions: read own
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Usage logs: read own
create policy "usage_logs_select_own" on public.usage_logs
  for select using (auth.uid() = user_id);
