// Helpers for turning the raw model string (e.g. "BMW 3 G20 2020-2022")
// into a clean model label + a year range, used to build the
// Brand → Model → Year dropdowns on the parts page.

export const PART_BRANDS = ["BMW", "Mercedes", "Toyota", "Hyundai", "Kia", "Subaru"] as const;

export const MIN_PART_YEAR = 2020;

const YEAR_RANGE_RE = /(\d{4})\s*-\s*(\d{4})?\s*$/;
const SINGLE_YEAR_RE = /(\d{4})\s*$/;

const BRAND_PREFIX_RE: Record<string, RegExp> = {
  BMW: /^BMW\s*/i,
  Mercedes: /^MERCEDES(?:-BENZ)?\s*/i,
  Toyota: /^TOYOTA\s*/i,
  Hyundai: /^HYUNDAI\s*/i,
  Subaru: /^SUBARU\s*/i,
  Kia: /^KIA\s*/i,
};

export type ParsedModel = {
  label: string;
  yearFrom: number | null;
  yearTo: number | null; // null = open-ended ("2020-")
};

export function parseModel(brand: string, model: string): ParsedModel {
  let yearFrom: number | null = null;
  let yearTo: number | null = null;

  const range = model.match(YEAR_RANGE_RE);
  if (range) {
    yearFrom = Number(range[1]);
    yearTo = range[2] ? Number(range[2]) : null;
  } else {
    const single = model.match(SINGLE_YEAR_RE);
    if (single) {
      yearFrom = Number(single[1]);
      yearTo = Number(single[1]);
    }
  }

  let label = model.replace(YEAR_RANGE_RE, "").trim();
  const prefix = BRAND_PREFIX_RE[brand];
  if (prefix) label = label.replace(prefix, "").trim();
  label = label.replace(/[-–/\s]+$/, "").trim();

  return { label: label || model, yearFrom, yearTo };
}

// The newest year a model covers, treating open-ended ranges as "current".
export function modelEndYear(parsed: ParsedModel, currentYear: number): number {
  return parsed.yearTo ?? currentYear;
}

// Discrete year options for a parsed model, clamped to MIN_PART_YEAR..now.
export function yearOptions(parsed: ParsedModel, currentYear: number): number[] {
  if (parsed.yearFrom == null) return [];
  const start = Math.max(MIN_PART_YEAR, parsed.yearFrom);
  const end = modelEndYear(parsed, currentYear);
  const years: number[] = [];
  for (let y = end; y >= start; y--) years.push(y);
  return years;
}

// Whether a given calendar year falls inside a parsed model's range.
export function yearInRange(parsed: ParsedModel, year: number, currentYear: number): boolean {
  if (parsed.yearFrom == null) return true;
  const start = Math.max(MIN_PART_YEAR, parsed.yearFrom);
  return year >= start && year <= modelEndYear(parsed, currentYear);
}
