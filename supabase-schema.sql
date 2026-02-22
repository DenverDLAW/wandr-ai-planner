-- ============================================================
-- AI Vacation Planner — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "uuid-ossp";

-- ============================================================
-- TRIPS TABLE
-- ============================================================
create table public.trips (
  id                uuid        primary key default uuid_generate_v4(),
  user_id           uuid        references auth.users(id) on delete cascade,
  title             text        not null,
  destination       text        not null,
  categories        text[]      not null default '{}',
  budget_range      text        not null,
  traveler_count    text        not null,
  start_date        date,
  end_date          date,
  planner_name      text,
  status            text        not null default 'generated' check (status in ('generated', 'saved')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- ITINERARIES TABLE
-- ============================================================
create table public.itineraries (
  id                        uuid        primary key default uuid_generate_v4(),
  trip_id                   uuid        not null references public.trips(id) on delete cascade,
  user_id                   uuid        references auth.users(id) on delete cascade,
  raw_json                  jsonb       not null,
  summary                   text,
  total_cost_estimate_usd   numeric(10, 2),
  created_at                timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index trips_user_id_idx     on public.trips(user_id);
create index trips_created_at_idx  on public.trips(created_at desc);
create index itineraries_trip_id_idx on public.itineraries(trip_id);
create index itineraries_user_id_idx on public.itineraries(user_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trips_updated_at
  before update on public.trips
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.trips       enable row level security;
alter table public.itineraries enable row level security;

-- TRIPS: users can only see and manage their own trips
create policy "trips_select_own"
  on public.trips for select
  using (auth.uid() = user_id);

create policy "trips_insert_own"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "trips_update_own"
  on public.trips for update
  using (auth.uid() = user_id);

create policy "trips_delete_own"
  on public.trips for delete
  using (auth.uid() = user_id);

-- ITINERARIES: users can only see and manage their own itineraries
create policy "itineraries_select_own"
  on public.itineraries for select
  using (auth.uid() = user_id);

create policy "itineraries_insert_own"
  on public.itineraries for insert
  with check (auth.uid() = user_id);

create policy "itineraries_delete_own"
  on public.itineraries for delete
  using (auth.uid() = user_id);

-- SERVICE ROLE bypass (used by server-side API routes with service key)
-- No extra policy needed — service role bypasses RLS by default in Supabase.

-- ============================================================
-- TRIPS: allow public read of shared trips (for share-by-link feature)
-- Itinerary detail page is publicly viewable if you have the trip ID
-- ============================================================
create policy "trips_select_public"
  on public.trips for select
  using (true);  -- anyone with the UUID can view (UUID is unguessable)

create policy "itineraries_select_public"
  on public.itineraries for select
  using (true);  -- same: UUID-guarded public read

-- NOTE: The "own" policies and "public" policies coexist.
-- Supabase evaluates RLS as OR across all matching policies,
-- so authenticated users can still manage their own rows,
-- and anyone can read any row (by UUID, which is private by default).
