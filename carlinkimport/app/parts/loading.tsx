import { Package } from "lucide-react";

export default function PartsLoading() {
  return (
    <main className="bg-white text-zinc-950">
      <section className="bg-zinc-950 px-4 py-16 text-white md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-zinc-200">
              <Package className="size-4 text-red-400" />
              მანქანის ნაწილები
            </div>
            <div className="h-12 w-3/4 animate-pulse rounded-md bg-white/10" />
            <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
          <div className="min-h-[320px] animate-pulse rounded-lg border border-white/10 bg-white/5" />
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:grid-cols-3 md:px-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-200" />
              <div className="h-12 w-full animate-pulse rounded-md bg-zinc-200" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <div className="aspect-[4/3] animate-pulse bg-zinc-200" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-12 animate-pulse rounded-full bg-zinc-200" />
                <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
                <div className="h-5 w-20 animate-pulse rounded bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
