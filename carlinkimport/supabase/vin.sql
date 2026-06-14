-- VIN analysis feature: cached per-VIN data/analysis + paid orders.
-- Run this manually in the Supabase SQL editor.

-- Cached vehicle data + generated AI analysis (reused within 24h to save API calls).
create table if not exists public.vin_reports (
  id uuid primary key default gen_random_uuid(),
  vin text not null,
  decoded jsonb,          -- NHTSA decode (make/model/year/engine/...)
  recalls jsonb,          -- NHTSA recalls
  auction jsonb,          -- best-effort free auction history
  history jsonb,          -- VinAudit: title brands, odometer, salvage auction damage
  analysis_json jsonb,    -- structured analysis (risk_score, sections, checklist)
  analysis_text text,     -- narrative analysis (Georgian)
  created_at timestamptz default now()
);

create index if not exists vin_reports_vin_idx on public.vin_reports (vin);
create index if not exists vin_reports_created_idx on public.vin_reports (created_at desc);

-- One row per purchase. The full report is gated by (id + access_token) once paid.
create table if not exists public.vin_orders (
  id uuid primary key default gen_random_uuid(),
  vin text not null,
  contact text,                 -- email or phone for delivery
  amount_gel numeric not null default 5,
  status text not null default 'pending',   -- pending | paid | failed
  provider text default 'flitt',
  provider_order_id text,
  access_token text not null,   -- random; required to read the report
  report_id uuid references public.vin_reports (id),
  created_at timestamptz default now(),
  paid_at timestamptz
);

create index if not exists vin_orders_status_idx on public.vin_orders (status);

-- RLS: no public access. All reads/writes happen server-side via the
-- service-role key (which bypasses RLS). Enabling RLS with no policy means
-- the anon key cannot touch these tables at all.
alter table public.vin_reports enable row level security;
alter table public.vin_orders  enable row level security;
