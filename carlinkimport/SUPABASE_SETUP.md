# Supabase setup for Carlink tariffs

Add these env vars:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Create the public tariff table:

```sql
create table if not exists public.location_tariffs (
  id text primary key,
  auction text not null check (auction in ('copart', 'iaai')),
  state text not null,
  city text not null,
  yard_name text not null,
  port text not null,
  inland_price numeric not null default 0,
  ocean_price numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.location_tariffs enable row level security;

create policy "Public can read active tariffs"
on public.location_tariffs
for select
using (active = true);

create policy "Authenticated admins can manage tariffs"
on public.location_tariffs
for all
to authenticated
using (true)
with check (true);

create table if not exists public.featured_vehicles (
  id text primary key,
  brand text not null,
  model text not null,
  engine text not null default '',
  year_from integer not null,
  year_to integer not null,
  horsepower integer not null default 0,
  fuel text not null default '',
  drive text not null default '',
  image_url text not null,
  price_from numeric not null default 0,
  price_to numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.featured_vehicles enable row level security;

create policy "Public can read active vehicles"
on public.featured_vehicles
for select
using (active = true);

create policy "Authenticated admins can manage vehicles"
on public.featured_vehicles
for all
to authenticated
using (true)
with check (true);
```

Create an admin user in Supabase Auth. Use that email/password on `/admin`.
