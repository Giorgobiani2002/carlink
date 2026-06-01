import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, Package, Phone } from "lucide-react";
import { fetchPublicPartById } from "../../lib/supabase-rest";

export const dynamic = "force-dynamic";

function formatPrice(value: number): string {
  if (!value) return "ფასი მოთხოვნით";
  return `${value.toLocaleString("ka-GE")} ₾`;
}

export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let part;
  try {
    part = await fetchPublicPartById(id);
  } catch (error) {
    console.error("Failed to load part", error);
    notFound();
  }

  if (!part) {
    notFound();
  }

  return (
    <main className="bg-white text-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Link
          href="/parts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-red-700"
        >
          <ArrowLeft className="size-4" />
          ნაწილებზე დაბრუნება
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
            {part.imageUrl ? (
              <Image
                src={part.imageUrl}
                alt={part.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                <Package className="size-16" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                {part.brand}
              </span>
              {part.category && (
                <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                  {part.category}
                </span>
              )}
              {part.inStock && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="size-3.5" />
                  მარაგშია
                </span>
              )}
            </div>

            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              {part.name}
            </h1>

            {part.model && (
              <p className="mt-2 text-sm text-zinc-500">მოდელი: {part.model}</p>
            )}

            <p className="mt-6 text-4xl font-bold text-red-700">
              {formatPrice(part.priceGel)}
            </p>

            {part.description && (
              <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  აღწერა
                </h2>
                <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                  {part.description}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:+995544440506"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-red-700 px-5 text-sm font-semibold text-white hover:bg-red-600"
              >
                <Phone className="size-4" />
                შეუკვეთე ზარით
              </a>
              {part.sourceUrl && (
                <a
                  href={part.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-md border border-zinc-300 px-5 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
                >
                  ნახე ორიგინალი
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>

            <p className="mt-6 text-xs text-zinc-400">
              წყარო: autopia.ge — ფასი და მარაგი შესაძლოა შეიცვალოს.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
