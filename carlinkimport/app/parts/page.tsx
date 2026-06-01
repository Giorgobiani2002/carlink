import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, Package, Phone } from "lucide-react";
import { fetchPublicParts, type CarPart } from "../lib/supabase-rest";

export const dynamic = "force-dynamic";

const BRANDS = ["Hyundai", "BMW", "Toyota", "Mercedes", "Lexus", "Kia", "Subaru"];

function formatPrice(value: number): string {
  if (!value) return "ფასი მოთხოვნით";
  return `${value.toLocaleString("ka-GE")} ₾`;
}

async function loadParts(brand?: string): Promise<CarPart[]> {
  try {
    return await fetchPublicParts(brand ? { brand } : undefined);
  } catch (error) {
    console.error("Failed to load parts", error);
    return [];
  }
}

export default async function PartsPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const { brand } = await searchParams;
  const selectedBrand = brand && BRANDS.includes(brand) ? brand : undefined;
  const parts = await loadParts(selectedBrand);

  return (
    <main className="bg-white text-zinc-950">
      <section className="bg-zinc-950 px-4 py-16 text-white md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-zinc-200">
              <Package className="size-4 text-red-400" />
              მანქანის ნაწილები
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] md:text-5xl lg:text-6xl">
              მანქანის ნაწილების ფასები ერთ სივრცეში.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
              მოძებნე საჭირო ნაწილი ბრენდის მიხედვით, ნახე ფასი და ფოტო. შეუკვეთე
              ზარით ან ნახე ორიგინალი ბმული autopia.ge-ზე.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:+995544440506"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-red-700 px-5 text-sm font-semibold text-white hover:bg-red-600"
              >
                <Phone className="size-4" />
                კონსულტაცია
              </a>
              <Link
                href="/calculator"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/15 px-5 text-sm font-semibold hover:bg-white/10"
              >
                <Calculator className="size-4" />
                კალკულატორი
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-white/10">
            <Image
              src="https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Car parts"
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/parts"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              !selectedBrand
                ? "border-red-700 bg-red-700 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            ყველა
          </Link>
          {BRANDS.map((b) => {
            const active = selectedBrand === b;
            return (
              <Link
                key={b}
                href={`/parts?brand=${encodeURIComponent(b)}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-red-700 bg-red-700 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {b}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        {parts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center">
            <Package className="mx-auto mb-3 size-8 text-zinc-400" />
            <p className="text-base font-semibold text-zinc-700">
              {selectedBrand
                ? `${selectedBrand}-ის ნაწილები ჯერ არ დაგვემატებია.`
                : "მონაცემები მალე დაემატება."}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              დაგვირეკე და დაგეხმარებით ნაწილის მოძიებაში.
            </p>
          </div>
        ) : (
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
        )}
      </section>
    </main>
  );
}
