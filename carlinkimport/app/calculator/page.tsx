"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Car, Check, Loader2, MapPin, Phone, Route, Ship, ShieldCheck } from "lucide-react";
import {
  AuctionProvider,
  OptionalService,
  VehicleType,
  calculateImportTotal,
  formatUsd,
  optionalServices,
  vehicleTypes,
  type LocationTariff,
} from "../lib/calculator";
import { fetchPublicTariffs, hasSupabaseConfig } from "../lib/supabase-rest";

const inputClass =
  "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-700/10";

export default function CalculatorPage() {
  const [tariffs, setTariffs] = useState<LocationTariff[]>([]);
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig);
  const [dataMessage, setDataMessage] = useState(
    hasSupabaseConfig ? "" : "Supabase ჯერ არ არის დაკავშირებული. ტარიფები გამოჩნდება დაკავშირების შემდეგ.",
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
          setDataMessage("აქტიური ტარიფები ჯერ არ არის დამატებული.");
        }
      })
      .catch(() => {
        setDataMessage("ტარიფების ჩატვირთვა ვერ მოხერხდა.");
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
    <main className="min-h-screen bg-[#f5f0e8] text-zinc-950">
      <section className="border-b border-black/5 bg-[linear-gradient(180deg,#f7f2ec_0%,#ece1d4_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/80 px-4 py-2 text-sm text-zinc-700">
            <Route className="size-4 text-red-700" />
            Import cost calculator
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                დაითვალე ჩამოყვანის ღირებულება მარტივად და ზუსტად.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 md:text-lg">
                აქ მხოლოდ კალკულაციაა. აირჩიე auction, yard-ის ლოკაცია, მანქანის ტიპი და მიიღე სრული breakdown.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <HeroChip label="Auction" value={auction.toUpperCase()} />
                <HeroChip
                  label="Location"
                  value={selectedTariff ? `${selectedTariff.city}, ${selectedTariff.state}` : "აირჩიე"}
                />
                <HeroChip label="Port" value={selectedTariff?.port ?? "აირჩიე"} />
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-zinc-950 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-red-700">
                  <Calculator className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Estimated total</p>
                  <h2 className="text-3xl font-semibold">{result ? formatUsd(result.total) : "$0"}</h2>
                </div>
              </div>
              <div className="mt-5 space-y-3 rounded-2xl bg-white/5 p-4">
                <Line label="Bid amount" value={result ? formatUsd(result.bid) : "-"} />
                <Line label="Auction fee" value={result ? formatUsd(result.auctionFee) : "-"} />
                <Line label="Inland" value={result ? formatUsd(result.inland) : "-"} />
                <Line label="Ocean" value={result ? formatUsd(result.ocean) : "-"} />
                <Line label="Service" value={result ? formatUsd(result.serviceFee) : "-"} />
                <Line label="Optional" value={result ? formatUsd(result.optionalFees) : "-"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-200 pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">Calculator</p>
              <h2 className="mt-2 text-2xl font-semibold">მარშრუტი და მონაცემები</h2>
            </div>
            {isLoading && <Loader2 className="size-5 animate-spin text-red-700" />}
          </div>

          {dataMessage && (
            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
                    type="button"
                    onClick={() => {
                      setAuction(item);
                      setState("");
                      setTariffId("");
                    }}
                    className={`h-12 rounded-xl border text-sm font-semibold uppercase transition ${
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
                <span className="mb-2 block text-sm font-semibold">ქალაქი / yard</span>
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
                <span className="mb-2 block text-sm font-semibold">Bid amount</span>
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
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`flex min-h-20 items-start gap-3 rounded-2xl border p-3 text-left transition ${
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

        <aside className="space-y-5">
          <div className="rounded-3xl border border-black/10 bg-[#171717] p-5 text-white shadow-sm">
            {!selectedTariff ? (
              <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-zinc-300">
                ამ აუქციონისთვის ტარიფი ჯერ არ არის დამატებული. ჯერ დაამატე ლოკაცია და ფასები admin-იდან.
              </div>
            ) : !result ? (
              <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-zinc-300">
                შეიყვანე სწორი bid amount, რომ შედეგი გამოჩნდეს.
              </div>
            ) : (
              <>
                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  <SummaryIcon icon={<MapPin className="size-4" />} label={selectedTariff.city} value={selectedTariff.port} />
                  <SummaryIcon icon={<Car className="size-4" />} label="Vehicle" value={vehicleTypes[vehicleType].label} />
                  <SummaryIcon icon={<Ship className="size-4" />} label="Ocean" value={formatUsd(result.ocean)} />
                </div>

                <div className="space-y-3 rounded-2xl bg-white/5 p-4">
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
              </>
            )}
          </div>

          <div className="rounded-3xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-red-700" />
              <div>
                <p className="font-semibold text-zinc-950">მნიშვნელოვანი შენიშვნა</p>
                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  ეს გვერდი მხოლოდ ღირებულებას ითვლის. საბოლოო ფასი შეიძლება შეიცვალოს title status-ის, ზუსტი yard-ის და shipping schedule-ის მიხედვით.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="tel:+995544440506"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-red-700 px-4 text-sm font-semibold text-white"
              >
                <Phone className="size-4" />
                კონსულტაცია
              </a>
              <Link
                href="/"
                className="inline-flex h-11 items-center rounded-xl border border-red-200 px-4 text-sm font-semibold text-zinc-900"
              >
                მთავარზე დაბრუნება
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function HeroChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function SummaryIcon({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
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
