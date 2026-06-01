-- Car parts catalogue scraped from autopia.ge
-- Run this manually in the Supabase SQL editor.

create table if not exists public.car_parts (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  name text not null,
  brand text not null,
  category text,
  model text,
  price_gel numeric,
  image_url text,
  source_url text,
  description text,
  in_stock boolean default true,
  active boolean default true,
  created_at timestamptz default now()
);

create index if not exists car_parts_brand_idx on public.car_parts (brand);
create index if not exists car_parts_active_idx on public.car_parts (active);

alter table public.car_parts enable row level security;

drop policy if exists "public read active parts" on public.car_parts;
create policy "public read active parts" on public.car_parts
  for select using (active = true);

-- Storage bucket setup (run in the Supabase dashboard, not here):
--   1. Create a public bucket named "part-images".
--   2. Allow anon SELECT and service_role INSERT/UPDATE/DELETE on storage.objects
--      for bucket_id = 'part-images'.
