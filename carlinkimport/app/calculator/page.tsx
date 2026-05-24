"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Calculator,
  Car,
  Check,
  Loader2,
  MapPin,
  Phone,
  Route,
  Ship,
  ShieldCheck,
} from "lucide-react";
import {
  AuctionProvider,
  LocationTariff,
  OptionalService,
  VehicleType,
  calculateImportTotal,
  formatUsd,
  optionalServices,
  sampleTariffs,
  vehicleTypes,
} from "../lib/calculator";
import { fetchPublicTariffs, hasSupabaseConfig } from "../lib/supabase-rest";

const inputClass =
  "h-12 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-700/10";

export default function CalculatorPage() {
  const [tariffs, setTariffs] = useState<LocationTariff[]>(sampleTariffs);
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig);
  const [dataMessage, setDataMessage] = useState(
    hasSupabaseConfig ? "" : "Supabase ჯერ არ არის დაკავშირებული, ნაჩვენებია sample ტარიფები.",
  );
  const [auction, setAuction] = useState<AuctionProvider>("copart");
  const [state, setState] = useState("");
  const [tariffId, setTariffId] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("sedan");
  const [bid, setBid] = useState("6500");
  const [selectedServices, setSelectedServices] = useState<OptionalService[]>(["titleCheck"]);

  useEffect(() => {
    if (!hasSupabaseConfig) return;

    fetchPublicTariffs()
      .then((items) => {
        if (items.length > 0) {
          setTariffs(items);
          setDataMessage("");
        } else {
          setDataMessage("აქტიური ტარიფები ჯერ არ არის დამატებული, ნაჩვენებია sample მონაცემები.");
        }
      })
      .catch(() => {
        setDataMessage("ტარიფების ჩატვირთვა ვერ მოხერხდა, დროებით ვიყენებთ sample მონაცემებს.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const auctionTariffs = useMemo(
    () => tariffs.filter((tariff) => tariff.active && tariff.auction === auction),
    [auction, tariffs],
  );

  const states = useMemo(
    () => Array.from(new Set(auctionTariffs.map((tariff) => tariff.state))).sort(),
    [auctionTariffs],
  );

  const cityTariffs = useMemo(
    () => auctionTariffs.filter((tariff) => !state || tariff.state === state),
    [auctionTariffs, state],
  );

  const selectedTariff = useMemo(
    () => cityTariffs.find((tariff) => tariff.id === tariffId) ?? cityTariffs[0],
    [cityTariffs, tariffId],
  );

  const numericBid = Number(bid);
  const result =
    selectedTariff && Number.isFinite(numericBid) && numericBid > 0
      ? calculateImportTotal({
          bid: numericBid,
          auction,
          tariff: selectedTariff,
          vehicleType,
          selectedServices,
        })
      : null;

  const toggleService = (service: OptionalService) => {
    setSelectedServices((current) =>
      current.includes(service) ? current.filter((item) => item !== service) : [...current, service],
    );
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.32),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-zinc-200">
              <Route className="size-4 text-red-400" />
              Location based import calculator
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-white md:text-6xl">
              დაითვალე ავტომობილის ჩამოყვანა ლოკაციით, პორტით და სერვისებით.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
              აირჩიე აუქციონი, yard-ის მდებარეობა და მანქანის ტიპი. კალკულატორი აჩვენებს ცოცხალ
              breakdown-ს, რომ გადაწყვეტილება ციფრებით მიიღო.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:+995544440506"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-red-700 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                <Phone className="size-4" />
                კონსულტაცია
              </a>
              <Link
                href="/"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/15 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                პლატფორმის ნახვა
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur md:grid-cols-3">
            {[
              ["Auction", auction.toUpperCase()],
              ["Location", selectedTariff ? `${selectedTariff.city}, ${selectedTariff.state}` : "აირჩიე"],
              ["Port", selectedTariff?.port ?? "აირჩიე"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-zinc-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:px-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg bg-white p-4 text-zinc-950 shadow-2xl shadow-black/20 md:p-6">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-200 pb-5">
            <div>
              <p className="text-sm font-semibold text-red-700">Route builder</p>
              <h2 className="mt-1 text-2xl font-semibold">მარშრუტი და მონაცემები</h2>
            </div>
            {isLoading && <Loader2 className="size-5 animate-spin text-red-700" />}
          </div>

          {dataMessage && (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {dataMessage}
            </div>
          )}

          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">აუქციონი</label>
              <div className="grid grid-cols-2 gap-2">
                {(["copart", "iaai"] as AuctionProvider[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setAuction(item);
                      setState("");
                      setTariffId("");
                    }}
                    className={`h-12 rounded-md border text-sm font-semibold uppercase transition ${
                      auction === item
                        ? "border-red-700 bg-red-700 text-white"
                        : "border-zinc-200 bg-white hover:border-red-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">შტატი</span>
                <select
                  className={inputClass}
                  value={state}
                  onChange={(event) => {
                    setState(event.target.value);
                    setTariffId("");
                  }}
                >
                  <option value="">ყველა შტატი</option>
                  {states.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">ქალაქი / Yard</span>
                <select
                  className={inputClass}
                  value={selectedTariff?.id ?? ""}
                  onChange={(event) => setTariffId(event.target.value)}
                >
                  {cityTariffs.map((tariff) => (
                    <option key={tariff.id} value={tariff.id}>
                      {tariff.city} - {tariff.yardName}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">მანქანის ტიპი</span>
                <select
                  className={inputClass}
                  value={vehicleType}
                  onChange={(event) => setVehicleType(event.target.value as VehicleType)}
                >
                  {Object.entries(vehicleTypes).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Bid Amount</span>
                <input
                  className={inputClass}
                  min="0"
                  inputMode="decimal"
                  value={bid}
                  onChange={(event) => setBid(event.target.value)}
                  placeholder="6500"
                  type="number"
                />
              </label>
            </div>

            <div>
              <span className="mb-3 block text-sm font-semibold">დამატებითი სერვისები</span>
              <div className="grid gap-3 md:grid-cols-3">
                {(Object.keys(optionalServices) as OptionalService[]).map((service) => {
                  const active = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`flex min-h-20 items-start gap-3 rounded-md border p-3 text-left transition ${
                        active ? "border-red-700 bg-red-50" : "border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border ${
                          active ? "border-red-700 bg-red-700 text-white" : "border-zinc-300"
                        }`}
                      >
                        {active && <Check className="size-3" />}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{optionalServices[service].label}</span>
                        <span className="text-sm text-zinc-500">{formatUsd(optionalServices[service].price)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-white/10 bg-zinc-900 p-4 md:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-md bg-red-700">
              <Calculator className="size-5" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Estimated total</p>
              <h2 className="text-3xl font-semibold">{result ? formatUsd(result.total) : "$0"}</h2>
            </div>
          </div>

          {!selectedTariff ? (
            <div className="rounded-md border border-dashed border-white/20 p-6 text-center text-zinc-300">
              ამ აუქციონისთვის ტარიფი ჯერ არ არის დამატებული. დაგვიკავშირდით ზუსტი ფასისთვის.
            </div>
          ) : !result ? (
            <div className="rounded-md border border-dashed border-white/20 p-6 text-center text-zinc-300">
              შეიყვანე სწორი bid amount, რომ ფასის breakdown გამოჩნდეს.
            </div>
          ) : (
            <>
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <SummaryIcon icon={<MapPin className="size-4" />} label={selectedTariff.city} value={selectedTariff.port} />
                <SummaryIcon icon={<Car className="size-4" />} label="Type" value={vehicleTypes[vehicleType].label} />
                <SummaryIcon icon={<Ship className="size-4" />} label="Ocean" value={formatUsd(result.ocean)} />
              </div>

              <div className="space-y-3 rounded-md bg-zinc-950 p-4">
                <Line label="Bid amount" value={formatUsd(result.bid)} />
                <Line label="Auction fee" value={formatUsd(result.auctionFee)} />
                <Line label="Inland transport" value={formatUsd(result.inland)} />
                <Line label="Ocean shipping" value={formatUsd(result.ocean)} />
                <Line label="Carlink service" value={formatUsd(result.serviceFee)} />
                <Line label="Optional services" value={formatUsd(result.optionalFees)} />
                <div className="border-t border-white/10 pt-3">
                  <Line strong label="Estimated total" value={formatUsd(result.total)} />
                </div>
              </div>

              <div className="mt-5 rounded-md border border-red-500/30 bg-red-500/10 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 size-5 shrink-0 text-red-300" />
                  <p className="text-sm leading-6 text-red-50">
                    ეს არის სავარაუდო ღირებულება. საბოლოო ფასი დამოკიდებულია title status-ზე, ზუსტ yard-ზე,
                    პორტის დატვირთვაზე და shipping schedule-ზე.
                  </p>
                </div>
              </div>

              <a
                href={`mailto:Carlinkautoimport@gmail.com?subject=Import estimate ${selectedTariff.city}&body=Auction: ${auction.toUpperCase()}%0ALocation: ${selectedTariff.city}, ${selectedTariff.state}%0AYard: ${selectedTariff.yardName}%0APort: ${selectedTariff.port}%0AVehicle: ${vehicleTypes[vehicleType].label}%0ABid: ${formatUsd(result.bid)}%0ATotal: ${formatUsd(result.total)}`}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-red-700 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                დაგვიკავშირდი ამ ფასით
                <ArrowRight className="size-4" />
              </a>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

function SummaryIcon({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 p-3">
      <div className="mb-2 text-red-300">{icon}</div>
      <p className="truncate text-sm font-semibold">{label}</p>
      <p className="truncate text-xs text-zinc-400">{value}</p>
    </div>
  );
}

function Line({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "text-lg font-semibold" : "text-sm"}`}>
      <span className={strong ? "text-white" : "text-zinc-400"}>{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
