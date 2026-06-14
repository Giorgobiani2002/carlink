// Server-side data access for the VIN feature. Uses the service-role key
// (bypasses RLS) — never import this into client components.
import type { VehicleData } from "./vin";
import type { VinAnalysis } from "./gemini";
import type { HistoryRecord } from "./history";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function headers(extra?: Record<string, string>) {
  if (!supabaseUrl || !serviceKey) throw new Error("Supabase service env vars are not configured.");
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function sb(path: string, init: RequestInit = {}) {
  const res = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: { ...headers(), ...(init.headers as Record<string, string>) },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${(await res.text()).slice(0, 200)}`);
  if (res.status === 204) return null;
  return res.json();
}

export type ReportRow = {
  id: string;
  vin: string;
  decoded: VehicleData["decoded"];
  recalls: VehicleData["recalls"];
  auction: VehicleData["auction"];
  history: HistoryRecord | null;
  analysis_json: VinAnalysis | null;
  analysis_text: string | null;
  created_at: string;
};

export type OrderRow = {
  id: string;
  vin: string;
  contact: string | null;
  amount_gel: number;
  status: string;
  provider: string;
  provider_order_id: string | null;
  access_token: string;
  report_id: string | null;
  created_at: string;
  paid_at: string | null;
};

// Most recent cached report for a VIN (any age — caller decides freshness).
export async function recentReportByVin(vin: string): Promise<ReportRow | null> {
  const rows = (await sb(
    `/rest/v1/vin_reports?vin=eq.${encodeURIComponent(vin)}&order=created_at.desc&limit=1`,
  )) as ReportRow[];
  return rows[0] ?? null;
}

export async function getReportById(id: string): Promise<ReportRow | null> {
  const rows = (await sb(`/rest/v1/vin_reports?id=eq.${encodeURIComponent(id)}&limit=1`)) as ReportRow[];
  return rows[0] ?? null;
}

export async function insertReport(input: {
  vin: string;
  data: VehicleData;
  analysis: VinAnalysis | null;
}): Promise<ReportRow> {
  const rows = (await sb("/rest/v1/vin_reports", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      vin: input.vin,
      decoded: input.data.decoded,
      recalls: input.data.recalls,
      auction: input.data.auction,
      analysis_json: input.analysis,
      analysis_text: input.analysis?.narrative ?? null,
    }),
  })) as ReportRow[];
  return rows[0];
}

// Persist the pulled history + generated analysis on a report in one write.
export async function finalizeReport(
  id: string,
  input: { history: HistoryRecord; analysis: VinAnalysis },
): Promise<void> {
  await sb(`/rest/v1/vin_reports?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      history: input.history,
      analysis_json: input.analysis,
      analysis_text: input.analysis.narrative,
    }),
  });
}

export async function insertOrder(input: {
  vin: string;
  contact: string;
  accessToken: string;
  reportId: string | null;
}): Promise<OrderRow> {
  const rows = (await sb("/rest/v1/vin_orders", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      vin: input.vin,
      contact: input.contact,
      access_token: input.accessToken,
      report_id: input.reportId,
      amount_gel: 5,
      status: "pending",
      provider: "flitt",
    }),
  })) as OrderRow[];
  return rows[0];
}

export async function getOrder(id: string): Promise<OrderRow | null> {
  const rows = (await sb(`/rest/v1/vin_orders?id=eq.${encodeURIComponent(id)}&limit=1`)) as OrderRow[];
  return rows[0] ?? null;
}

export async function updateOrder(id: string, patch: Partial<OrderRow>): Promise<void> {
  await sb(`/rest/v1/vin_orders?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
}
