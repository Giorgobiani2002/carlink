"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, Loader2 } from "lucide-react";
import {
  AuctionProvider,
  VehicleType,
  calculateImportTotal,
  formatUsd,
  type LocationTariff,
  vehicleTypes,
} from "../lib/calculator";
import { fetchPublicTariffs, hasSupabaseConfig } from "../lib/supabase-rest";

const inputClass =
  "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-700/10";

export default function CalculatorPage() {
  const [tariffs, setTariffs] = useState<LocationTariff[]>([]);
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig);
  const [dataMessage, setDataMessage] = useState(hasSupabaseConfig ? "" : "Supabase ჯერ არ არის დაკავშირებული.");
  const [auction, setAuction] = useState<AuctionProvider>("copart");
  const [state, setState] = useState("");
  const [tariffId, setTariffId] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("sedan");
  const [bid, setBid] = useState("0");

  useEffect(() => {
    if (!hasSupabaseConfig) return;

    fetchPublicTariffs()
      .then((items) => {
        setTariffs(items);
        setDataMessage(items.length > 0 ? "" : "აქტიური ტარიფები ჯერ არ არის დამატებული.");
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
    () => cityTariffs.find((tariff) => tariff.id === tariffId),
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
        })
      : null;

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 md:px-6">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-red-700 text-white">
                <Calculator className="size-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Import calculator</p>
                <h1 className="text-2xl font-semibold">კალკულატორი</h1>
              </div>
            </div>
            {isLoading ? <Loader2 className="size-5 animate-spin text-red-700" /> : null}
          </div>

          {dataMessage ? (
            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {dataMessage}
            </div>
          ) : null}

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
                <span className="mb-2 block text-sm font-semibold">ლოკაცია</span>
                <select className={inputClass} value={tariffId} onChange={(event) => setTariffId(event.target.value)}>
                  <option value="">აირჩიე ლოკაცია</option>
                  {cityTariffs.map((tariff) => (
                    <option key={tariff.id} value={tariff.id}>
                      {tariff.city}
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
                  placeholder="0"
                  type="number"
                />
              </label>
            </div>
          </div>
        </div>

        <aside className="rounded-3xl border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm md:p-7">
          <p className="text-sm text-zinc-400">სულ</p>
          <h2 className="mt-2 text-5xl font-semibold">{result ? formatUsd(result.total) : "$0"}</h2>

          <div className="mt-8 rounded-2xl bg-white/5 p-4">
            <Line label="Auction fee" value={result ? formatUsd(result.auctionFee) : "$0"} />
            <Line label="Transportation total" value={result ? formatUsd(result.transportTotal) : "$0"} />
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300">
            {selectedTariff ? `${selectedTariff.city}, ${selectedTariff.state}` : "ლოკაცია არ არის არჩეული"}
          </div>
        </aside>
      </section>
    </main>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
