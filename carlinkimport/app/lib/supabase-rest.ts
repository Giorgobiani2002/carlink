import { LocationTariff } from "./calculator";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && anonKey);

function mapTariff(row: Record<string, unknown>): LocationTariff {
  return {
    id: String(row.id),
    auction: row.auction as LocationTariff["auction"],
    state: String(row.state),
    city: String(row.city),
    yardName: String(row.yard_name ?? row.yardName ?? ""),
    port: String(row.port),
    inlandPrice: Number(row.inland_price ?? row.inlandPrice ?? 0),
    oceanPrice: Number(row.ocean_price ?? row.oceanPrice ?? 0),
    active: Boolean(row.active),
  };
}

function toSupabaseTariff(tariff: LocationTariff) {
  return {
    auction: tariff.auction,
    state: tariff.state,
    city: tariff.city,
    yard_name: tariff.yardName,
    port: tariff.port,
    inland_price: tariff.inlandPrice,
    ocean_price: tariff.oceanPrice,
    active: tariff.active,
  };
}

async function supabaseFetch(path: string, init: RequestInit = {}, token?: string) {
  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase env vars are not configured.");
  }

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token ?? anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function fetchPublicTariffs() {
  const rows = await supabaseFetch(
    "/rest/v1/location_tariffs?select=*&active=eq.true&order=state.asc,city.asc",
  );
  return (rows as Record<string, unknown>[]).map(mapTariff);
}

export async function loginAdmin(email: string, password: string) {
  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase env vars are not configured.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("ელფოსტა ან პაროლი არასწორია.");
  }

  return response.json() as Promise<{ access_token: string; user: { email?: string } }>;
}

export async function fetchAdminTariffs(token: string) {
  const rows = await supabaseFetch("/rest/v1/location_tariffs?select=*&order=state.asc,city.asc", {}, token);
  return (rows as Record<string, unknown>[]).map(mapTariff);
}

export async function upsertAdminTariff(token: string, tariff: LocationTariff) {
  const id = tariff.id || crypto.randomUUID();
  const row = await supabaseFetch(
    `/rest/v1/location_tariffs?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ id, ...toSupabaseTariff({ ...tariff, id }) }),
    },
    token,
  );

  if (Array.isArray(row) && row.length > 0) return mapTariff(row[0]);

  const inserted = await supabaseFetch(
    "/rest/v1/location_tariffs",
    {
      method: "POST",
      body: JSON.stringify({ id, ...toSupabaseTariff({ ...tariff, id }) }),
    },
    token,
  );

  return mapTariff((inserted as Record<string, unknown>[])[0]);
}
