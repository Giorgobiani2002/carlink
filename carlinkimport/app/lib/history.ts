// VinAudit vehicle-history adapter (NMVTIS title + brands + odometer + salvage
// auction damage). Server-side only. The pullreport call is PAID, so it runs
// only in the paid flow — never in the free preview. Degrades gracefully to
// { available: false } when credentials are absent.

export type TitleRecord = {
  date: string;
  state: string;
  meter: string;
  meterUnit: string;
  current: boolean;
};

export type BrandCheck = { name: string; type: string; date: string };

export type SalvageRecord = {
  date: string;
  location: string;
  primaryDamage: string;
  secondaryDamage: string;
  odometer: string;
  saleDocument: string;
};

export type JsiRecord = {
  date: string;
  recordType: string;
  brander: string;
  disposition: string;
};

export type HistoryRecord = {
  available: boolean;
  titles: TitleRecord[];
  brands: BrandCheck[];
  salvage: SalvageRecord[];
  jsi: JsiRecord[];
};

const EMPTY: HistoryRecord = { available: false, titles: [], brands: [], salvage: [], jsi: [] };

type RawReport = {
  titles?: Record<string, unknown>[];
  checks?: Record<string, unknown>[];
  salvage?: Record<string, unknown>[];
  jsi?: Record<string, unknown>[];
};

function s(row: Record<string, unknown>, key: string): string {
  const v = row[key];
  return v == null ? "" : String(v).trim();
}

export async function fetchHistory(vin: string, reportId: string): Promise<HistoryRecord> {
  const key = process.env.VINAUDIT_API_KEY;
  const user = process.env.VINAUDIT_USER;
  const pass = process.env.VINAUDIT_PASS;
  if (!key || !user || !pass) return EMPTY;

  const url =
    `https://api.vinaudit.com/v2/pullreport?format=json` +
    `&vin=${encodeURIComponent(vin)}&id=${encodeURIComponent(reportId)}` +
    `&key=${encodeURIComponent(key)}&user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) {
      console.warn("vinaudit pullreport status", res.status);
      return EMPTY;
    }
    const json = (await res.json()) as RawReport & { success?: boolean; error?: string };
    if (json.error) {
      console.warn("vinaudit error", json.error);
      return EMPTY;
    }

    return {
      available: true,
      titles: (json.titles ?? []).map((r) => ({
        date: s(r, "date"),
        state: s(r, "state"),
        meter: s(r, "meter"),
        meterUnit: s(r, "meter_unit"),
        current: Boolean(r.current),
      })),
      brands: (json.checks ?? []).map((r) => ({
        name: s(r, "brander_name"),
        type: s(r, "brander_type"),
        date: s(r, "date"),
      })),
      salvage: (json.salvage ?? []).map((r) => ({
        date: s(r, "date"),
        location: s(r, "location"),
        primaryDamage: s(r, "primary_damage"),
        secondaryDamage: s(r, "secondary_damage"),
        odometer: s(r, "odometer"),
        saleDocument: s(r, "sale_document"),
      })),
      jsi: (json.jsi ?? []).map((r) => ({
        date: s(r, "date"),
        recordType: s(r, "record_type"),
        brander: s(r, "brander_name"),
        disposition: s(r, "vehicle_disposition"),
      })),
    };
  } catch (error) {
    console.warn("vinaudit fetch failed", error);
    return EMPTY;
  }
}
