export default function PartDetailLoading() {
  return (
    <main className="bg-white text-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg border border-zinc-200 bg-zinc-200" />

          <div className="flex flex-col">
            <div className="mb-3 flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-200" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-200" />
            </div>
            <div className="h-9 w-3/4 animate-pulse rounded bg-zinc-200" />
            <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-zinc-200" />
            <div className="mt-6 h-10 w-32 animate-pulse rounded bg-zinc-200" />
            <div className="mt-8 h-12 w-48 animate-pulse rounded-md bg-zinc-200" />
          </div>
        </div>
      </section>
    </main>
  );
}
