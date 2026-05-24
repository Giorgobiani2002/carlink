import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, Calculator, Search } from "lucide-react";

const auctionSources = [
  { name: "Copart", text: "დაზიანებული, clean title და insurance vehicles დიდი არჩევანით.", image: "/slide11.png" },
  { name: "IAAI", text: "branch-based აუქციონები, title check და განსხვავებული inventory.", image: "/slide22.png" },
  { name: "Dealer search", text: "კონკრეტული მოდელის მოძიება პარტნიორი დილერებიდან.", image: "/slide4.jpg" },
];

export default function AuctionPage() {
  return (
    <main className="bg-white text-zinc-950">
      <section className="bg-zinc-950 px-4 py-16 text-white md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-zinc-200">
              <Bell className="size-4 text-red-400" />
              Auction desk
            </div>
            <h1 className="text-4xl font-semibold tracking-normal md:text-6xl">აუქციონების გვერდი მალე სრულად დაემატება</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
              მანამდე გუნდი დაგეხმარებათ კონკრეტული მანქანის მოძიებაში, lot-ის შემოწმებაში და ფასის წინასწარ დათვლაში.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/calculator" className="inline-flex h-12 items-center gap-2 rounded-md bg-red-700 px-5 text-sm font-semibold text-white hover:bg-red-600">
                <Calculator className="size-4" />
                კალკულატორი
              </Link>
              <a href="tel:+995544440506" className="inline-flex h-12 items-center gap-2 rounded-md border border-white/15 px-5 text-sm font-semibold hover:bg-white/10">
                კონსულტაცია
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-white/10">
            <Image src="/container.jpg" alt="Car import container" fill className="object-cover opacity-80" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="mb-8 flex items-center gap-2">
          <Search className="size-5 text-red-700" />
          <h2 className="text-2xl font-semibold">საძიებო წყაროები</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {auctionSources.map((source) => (
            <article key={source.name} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <div className="relative aspect-[16/10]">
                <Image src={source.image} alt={source.name} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold">{source.name}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{source.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
