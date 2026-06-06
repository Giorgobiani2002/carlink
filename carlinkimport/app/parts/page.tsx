import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, Package, Phone } from "lucide-react";
import { fetchPublicParts, type CarPart } from "../lib/supabase-rest";
import { PART_BRANDS } from "../lib/parts";
import PartsExplorer from "./parts-explorer";

export const dynamic = "force-dynamic";

const BRANDS: string[] = [...PART_BRANDS];

async function loadParts(brand: string): Promise<CarPart[]> {
  try {
    return await fetchPublicParts({ brand });
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
  const parts = selectedBrand ? await loadParts(selectedBrand) : [];

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
              აირჩიე ბრენდი, მოდელი და წელი — ვნახოთ შენთვის საჭირო ნაწილი, ფასი
              და ფოტო. შეუკვეთე ზარით მარტივად.
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

      <PartsExplorer
        key={selectedBrand ?? "none"}
        brands={BRANDS}
        selectedBrand={selectedBrand}
        parts={parts}
      />
    </main>
  );
}
