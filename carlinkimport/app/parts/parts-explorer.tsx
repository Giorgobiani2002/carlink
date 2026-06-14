"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Package } from "lucide-react";
import type { PartCard } from "../lib/supabase-rest";
import { PART_BRANDS, parseModel, yearOptions, yearInRange } from "../lib/parts";

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

export default function PartsExplorer({ parts }: { parts: PartCard[] }) {
  const currentYear = new Date().getFullYear();

  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<number | "">("");

  // Brands that actually have parts, in the preferred order.
  const brands = useMemo<string[]>(() => {
    const present = new Set(parts.map((p) => p.brand));
    return PART_BRANDS.filter((b) => present.has(b));
  }, [parts]);

  // A mixed default showcase: a few parts from each brand, interleaved.
  const featured = useMemo<PartCard[]>(() => {
    const byBrand = new Map<string, PartCard[]>();
    for (const part of parts) {
      if (!part.imageUrl) continue;
      const arr = byBrand.get(part.brand) ?? [];
      if (arr.length < 2) arr.push(part);
      byBrand.set(part.brand, arr);
    }
    const out: PartCard[] = [];
    for (let i = 0; i < 2; i++) {
      for (const b of PART_BRANDS) {
        const arr = byBrand.get(b);
        if (arr && arr[i]) out.push(arr[i]);
      }
    }
    return out.slice(0, 10);
  }, [parts]);

  // Models for the selected brand, with merged year ranges.
  const models = useMemo<ModelGroup[]>(() => {
    if (!brand) return [];
    const map = new Map<string, ModelGroup>();
    for (const part of parts) {
      if (part.brand !== brand) continue;
      const { label, yearFrom, yearTo } = parseModel(brand, part.model);
      if (!label) continue;
      const existing = map.get(label);
      if (!existing) {
        map.set(label, { label, yearFrom, yearTo, open: yearTo == null });
      } else {
        if (yearFrom != null && (existing.yearFrom == null || yearFrom < existing.yearFrom)) {
          existing.yearFrom = yearFrom;
        }
        if (yearTo == null) existing.open = true;
        else if (existing.yearTo == null || yearTo > existing.yearTo) existing.yearTo = yearTo;
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "en"));
  }, [parts, brand]);

  const years = useMemo<number[]>(() => {
    const group = models.find((m) => m.label === model);
    if (!group) return [];
    return yearOptions(
      { label: group.label, yearFrom: group.yearFrom, yearTo: group.open ? null : group.yearTo },
      currentYear,
    );
  }, [models, model, currentYear]);

  const filtered = useMemo<PartCard[]>(() => {
    if (!brand || !model) return [];
    return parts.filter((part) => {
      if (part.brand !== brand) return false;
      const parsed = parseModel(brand, part.model);
      if (parsed.label !== model) return false;
      if (year !== "" && !yearInRange(parsed, year, currentYear)) return false;
      return true;
    });
  }, [parts, brand, model, year, currentYear]);

  const showFeatured = !brand && !model;

  return (
    <>
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:grid-cols-3 md:px-6">
          <Dropdown
            label="ბრენდი"
            value={brand}
            placeholder="აირჩიე ბრენდი"
            options={brands.map((b) => ({ value: b, label: b }))}
            onChange={(v) => {
              setBrand(v);
              setModel("");
              setYear("");
            }}
          />
          <Dropdown
            label="მოდელი"
            value={model}
            placeholder="აირჩიე მოდელი"
            disabled={!brand}
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
        {showFeatured ? (
          <>
            <p className="mb-5 text-sm text-zinc-500">
              აირჩიე ბრენდი, მოდელი და წელი — ან გადახედე ნაწილებს
            </p>
            <PartsGrid parts={featured} />
          </>
        ) : !model ? (
          <Prompt text="აირჩიე მოდელი ნაწილების სანახავად." />
        ) : filtered.length === 0 ? (
          <Prompt text="ამ მოდელზე ნაწილები ვერ მოიძებნა." />
        ) : (
          <>
            <p className="mb-5 text-sm text-zinc-500">
              ნაპოვნია <span className="font-semibold text-zinc-800">{filtered.length}</span> ნაწილი
            </p>
            <PartsGrid parts={filtered} />
          </>
        )}
      </section>
    </>
  );
}

function PartsGrid({ parts }: { parts: PartCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {parts.map((part) => (
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
                unoptimized
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
            <p className="mt-2 text-lg font-bold text-red-700">{formatPrice(part.priceGel)}</p>
          </div>
        </Link>
      ))}
    </div>
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
