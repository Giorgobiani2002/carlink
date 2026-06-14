// VIN validation + free vehicle-data sources (NHTSA). Server-side only.

export type DecodedVin = {
  vin: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  bodyClass: string;
  vehicleType: string;
  engineCylinders: string;
  displacementL: string;
  fuelType: string;
  driveType: string;
  transmission: string;
  manufacturer: string;
  plantCountry: string;
  plantCity: string;
};

export type Recall = {
  component: string;
  summary: string;
  consequence: string;
  remedy: string;
  campaign: string;
  date: string;
};

export type AuctionData = {
  available: boolean;
  records: unknown[];
};

export type VehicleData = {
  decoded: DecodedVin;
  recalls: Recall[];
  auction: AuctionData;
  checkDigitValid: boolean;
  history?: import("./history").HistoryRecord;
};

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/; // no I, O, Q

export function normalizeVin(raw: string): string {
  return (raw || "").toUpperCase().replace(/\s+/g, "");
}

export function isValidVinFormat(vin: string): boolean {
  return VIN_RE.test(vin);
}

// ISO-3779 check digit (position 9). Holds for North American / US-auction VINs;
// treated as a soft signal since some imported VINs from other regions differ.
const TRANSLIT: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
  "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
};
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

export function checkDigitValid(vin: string): boolean {
  if (!isValidVinFormat(vin)) return false;
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const v = TRANSLIT[vin[i]];
    if (v === undefined) return false;
    sum += v * WEIGHTS[i];
  }
  const remainder = sum % 11;
  const expected = remainder === 10 ? "X" : String(remainder);
  return vin[8] === expected;
}

function pick(row: Record<string, string>, key: string): string {
  const v = row[key];
  return v && v !== "Not Applicable" ? v.trim() : "";
}

export async function fetchDecodedVin(vin: string): Promise<DecodedVin> {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(
    vin,
  )}?format=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`NHTSA decode failed: ${res.status}`);
  const json = (await res.json()) as { Results?: Record<string, string>[] };
  const row = json.Results?.[0] ?? {};
  return {
    vin,
    make: pick(row, "Make"),
    model: pick(row, "Model"),
    year: pick(row, "ModelYear"),
    trim: pick(row, "Trim"),
    bodyClass: pick(row, "BodyClass"),
    vehicleType: pick(row, "VehicleType"),
    engineCylinders: pick(row, "EngineCylinders"),
    displacementL: pick(row, "DisplacementL"),
    fuelType: pick(row, "FuelTypePrimary"),
    driveType: pick(row, "DriveType"),
    transmission: pick(row, "TransmissionStyle"),
    manufacturer: pick(row, "Manufacturer"),
    plantCountry: pick(row, "PlantCountry"),
    plantCity: pick(row, "PlantCity"),
  };
}

export async function fetchRecalls(decoded: DecodedVin): Promise<Recall[]> {
  if (!decoded.make || !decoded.model || !decoded.year) return [];
  const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(
    decoded.make,
  )}&model=${encodeURIComponent(decoded.model)}&modelYear=${encodeURIComponent(decoded.year)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      results?: Record<string, string>[];
    };
    return (json.results ?? []).map((r) => ({
      component: r.Component ?? "",
      summary: r.Summary ?? "",
      consequence: r.Consequence ?? "",
      remedy: r.Remedy ?? "",
      campaign: r.NHTSACampaignNumber ?? "",
      date: r.ReportReceivedDate ?? "",
    }));
  } catch {
    return [];
  }
}

// Best-effort auction history (Copart/IAAI). No reliable free official API yet —
// Phase 2 wires a real source. Degrades gracefully so the rest of the flow works.
export async function fetchAuctionHistory(): Promise<AuctionData> {
  return { available: false, records: [] };
}

export async function gatherVehicleData(vin: string): Promise<VehicleData> {
  const decoded = await fetchDecodedVin(vin);
  const [recalls, auction] = await Promise.all([
    fetchRecalls(decoded),
    fetchAuctionHistory(),
  ]);
  return { decoded, recalls, auction, checkDigitValid: checkDigitValid(vin) };
}
