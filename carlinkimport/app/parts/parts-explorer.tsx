"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Package } from "lucide-react";
import type { CarPart } from "../lib/supabase-rest";
import { parseModel, yearOptions, yearInRange } from "../lib/parts";

function formatPrice(value: number): string {
  if (!value) return "ფასი მოთხოვნით";
  return `${value.toLocaleString("ka-GE")} ₾`;
}

type ModelGroup = {
  label: string;
  yearFrom: number | null;
  yearTo: number | null;
  open: boolean;
};

export default function PartsExplorer({
  brands,
  selectedBrand,
  parts,
}: {
  brands: string[];
  selectedBrand?: string;
  parts: CarPart[];
}) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<number | "">("");

  // Group the brand's parts by clean model label, merging year ranges.
  const models = useMemo<ModelGroup[]>(() => {
    if (!selectedBrand) return [];
    const map = new Map<string, ModelGroup>();
    for (const part of parts) {
      const { label, yearFrom, yearTo } = parseModel(selectedBrand, part.model);
      if (!label) continue;
      const existing = map.get(label);
      if (!existing) {
        map.set(label, {
          label,
          yearFrom,
          yearTo,
          open: yearTo == null,
        });
      } else {
        if (yearFrom != null && (existing.yearFrom == null || yearFrom < existing.yearFrom)) {
          existing.yearFrom = yearFrom;
        }
        if (yearTo == null) existing.open = true;
        else if (existing.yearTo == null || yearTo > existing.yearTo) existing.yearTo = yearTo;
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "en"));
  }, [parts, selectedBrand]);

  const years = useMemo<number[]>(() => {
    const group = models.find((m) => m.label === model);
    if (!group) return [];
    return yearOptions(
      { label: group.label, yearFrom: group.yearFrom, yearTo: group.open ? null : group.yearTo },
      currentYear,
    );
  }, [models, model, currentYear]);

  const filtered = useMemo<CarPart[]>(() => {
    if (!selectedBrand || !model) return [];
    return parts.filter((part) => {
      const parsed = parseModel(selectedBrand, part.model);
      if (parsed.label !== model) return false;
      if (year !== "" && !yearInRange(parsed, year, currentYear)) return false;
      return true;
    });
  }, [parts, selectedBrand, model, year, currentYear]);

  function onBrandChange(value: string) {
    if (value) router.push(`/parts?brand=${encodeURIComponent(value)}`);
    else router.push("/parts");
  }

  return (
    <>
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:grid-cols-3 md:px-6">
          <Dropdown
            label="ბრენდი"
            value={selectedBrand ?? ""}
            placeholder="აირჩიე ბრენდი"
            options={brands.map((b) => ({ value: b, label: b }))}
            onChange={onBrandChange}
          />
          <Dropdown
            label="მოდელი"
            value={model}
            placeholder="აირჩიე მოდელი"
            disabled={!selectedBrand}
            options={models.map((m) => ({ value: m.label, label: m.label }))}
            onChange={(v) => {
              setModel(v);
              setYear("");
            }}
          />
          <Dropdown
            label="წელი"
            value={year === "" ? "" : String(year)}
            placeholder="ყველა წელი"
            disabled={!model}
            options={years.map((y) => ({ value: String(y), label: String(y) }))}
            onChange={(v) => setYear(v === "" ? "" : Number(v))}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        {!selectedBrand ? (
          <Prompt text="აირჩიე ბრენდი ნაწილების სანახავად." />
        ) : !model ? (
          <Prompt text="აირჩიე მოდელი ნაწილების სანახავად." />
        ) : filtered.length === 0 ? (
          <Prompt text="ამ მოდელზე ნაწილები ვერ მოიძებნა." />
        ) : (
          <>
            <p className="mb-5 text-sm text-zinc-500">
              ნაპოვნია <span className="font-semibold text-zinc-800">{filtered.length}</span> ნაწილი
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((part) => (
                <Link
                  key={part.id}
                  href={`/parts/${part.id}`}
                  className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:border-red-700 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] bg-zinc-100">
                    {part.imageUrl ? (
                      <Image
                        src={part.imageUrl}
                        alt={part.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-400">
                        <Package className="size-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2 inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700">
                      {part.brand}
                    </div>
                    <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold text-zinc-900">
                      {part.name}
                    </h3>
                    <p className="mt-2 text-lg font-bold text-red-700">
                      {formatPrice(part.priceGel)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}

function Dropdown({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-md border border-zinc-300 bg-white px-4 pr-10 text-sm font-semibold text-zinc-900 outline-none transition focus:border-red-700 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
      </div>
    </label>
  );
}

function Prompt({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center">
      <Package className="mx-auto mb-3 size-8 text-zinc-400" />
      <p className="text-base font-semibold text-zinc-700">{text}</p>
    </div>
  );
}
