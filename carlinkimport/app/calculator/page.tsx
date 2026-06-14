"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, Loader2 } from "lucide-react";
import { AuctionProvider, calculateImportTotal, formatUsd, formatGel, type LocationTariff, type FuelType, type SteeringPosition } from "../lib/calculator";
import { fetchPublicTariffs, hasSupabaseConfig } from "../lib/supabase-rest";

const inputClass =
  "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-700/10";

export default function CalculatorPage() {
  const [view, setView] = useState<"import" | "customs">("import");
  const [tariffs, setTariffs] = useState<LocationTariff[]>([]);
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig);
  const [dataMessage, setDataMessage] = useState(hasSupabaseConfig ? "" : "Supabase ჯერ არ არის დაკავშირებული.");
  const [auction, setAuction] = useState<AuctionProvider>("copart");
  const [state, setState] = useState("");
  const [tariffId, setTariffId] = useState("");
  const [bid, setBid] = useState("0");

  // Customs states (shared between both views for persistence)
  const [year, setYear] = useState("");
  const [cc, setCc] = useState("");
  const [fuel, setFuel] = useState<FuelType>("petrol");
  const [steering, setSteering] = useState<SteeringPosition>("left");

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
  const result = calculateImportTotal({
    bid: Number.isFinite(numericBid) ? numericBid : 0,
    auction,
    tariff: selectedTariff ?? null,
    customs: {
      year: Number(year),
      cc: Number(cc),
      fuel,
      steering,
    },
  });

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 md:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 rounded-2xl bg-white p-1 shadow-sm w-fit border border-zinc-200">
          <button
            onClick={() => setView("import")}
            className={`px-6 h-11 rounded-xl text-sm font-semibold transition ${view === "import"
              ? "bg-red-700 text-white shadow-md shadow-red-700/20"
              : "text-zinc-600 hover:bg-zinc-50"
              }`}
          >
            იმპორტის კალკულატორი
          </button>
          <button
            onClick={() => setView("customs")}
            className={`px-6 h-11 rounded-xl text-sm font-semibold transition ${view === "customs"
              ? "bg-red-700 text-white shadow-md shadow-red-700/20"
              : "text-zinc-600 hover:bg-zinc-50"
              }`}
          >
            განბაჟება
          </button>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-200 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-red-700 text-white">
                  <Calculator className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">
                    {view === "import" ? "Import Calculator" : "Customs Calculator"}
                  </p>
                  <h1 className="text-2xl font-semibold">
                    {view === "import" ? "იმპორტის კალკულატორი" : "განბაჟების კალკულატორი"}
                  </h1>
                </div>
              </div>
              {isLoading ? <Loader2 className="size-5 animate-spin text-red-700" /> : null}
            </div>

            {dataMessage && view === "import" ? (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {dataMessage}
              </div>
            ) : null}

            <div className="grid gap-8">
              {view === "import" ? (
                <section className="grid gap-6">
                  {/* Auction & Logistics Section ONLY */}
                  <div className="grid gap-5">
                    <h2 className="text-lg font-bold text-zinc-900">აუქციონი და ლოგისტიკა</h2>
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
                            className={`h-12 rounded-xl border text-sm font-semibold uppercase transition ${auction === item
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
                        <select
                          className={inputClass}
                          value={tariffId}
                          onChange={(event) => setTariffId(event.target.value)}
                        >
                          <option value="">აირჩიე ლოკაცია</option>
                          {cityTariffs.map((tariff) => (
                            <option key={tariff.id} value={tariff.id}>
                              {tariff.city}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">Bid amount ($)</span>
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
                </section>
              ) : (
                <section className="grid gap-6">
                  {/* Dedicated Customs View ONLY */}
                  <h2 className="text-lg font-bold text-zinc-900">ავტომობილის მონაცემები</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">გამოშვების წელი</span>
                      <select className={inputClass} value={year} onChange={(event) => setYear(event.target.value)}>
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">ძრავის მოცულობა (CC)</span>
                      <input
                        className={inputClass}
                        min="0"
                        inputMode="numeric"
                        value={cc}
                        onChange={(event) => setCc(event.target.value)}
                        placeholder="2000"
                        type="number"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">საწვავის ტიპი</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["petrol", "hybrid", "electric", "diesel"] as FuelType[]).map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setFuel(item)}
                            className={`h-11 rounded-xl border text-xs font-semibold capitalize transition ${fuel === item
                              ? "border-red-700 bg-red-700 text-white"
                              : "border-zinc-200 bg-white hover:border-red-300"
                              }`}
                          >
                            {item === "petrol"
                              ? "ბენზინი"
                              : item === "diesel"
                                ? "დიზელი"
                                : item === "hybrid"
                                  ? "ჰიბრიდი"
                                  : "ელექტრო"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">საჭე</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["left", "right"] as SteeringPosition[]).map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setSteering(item)}
                            className={`h-11 rounded-xl border text-xs font-semibold transition ${steering === item
                              ? "border-red-700 bg-red-700 text-white"
                              : "border-zinc-200 bg-white hover:border-red-300"
                              }`}
                          >
                            {item === "left" ? "მარცხნივ" : "მარჯვნივ"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>

          <aside className="rounded-3xl border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm md:p-7">
            <p className="text-sm text-zinc-400">სულ</p>
            <h2 className="mt-2 text-5xl font-semibold">
              {view === "import" ? formatUsd(result.carPrice + result.auctionFee + result.transportTotal) : formatGel(result.customs.totalGel)}
            </h2>

            <div className="mt-8 space-y-6">
              {view === "import" && (
                <div className="rounded-2xl bg-white/5 p-4">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    აუქციონი და ლოგისტიკა
                  </h3>
                  <Line label="Car price" value={formatUsd(result.carPrice)} />
                  <Line label="Auction fee" value={formatUsd(result.auctionFee)} />
                  <Line label="Transportation" value={formatUsd(result.transportTotal)} />
                </div>
              )}

              {view === "customs" && (
                <div className="rounded-2xl bg-white/5 p-4">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    განბაჟება აშშ-დან (სავარაუდო)
                  </h3>
                  <Line label="აქციზი" value={formatGel(result.customs.excise)} />
                  <Line label="იმპორტის გადასახადი" value={formatGel(result.customs.importTax)} />
                  <Line label="საბაჟო მომსახურება" value={formatGel(result.customs.serviceFee)} />
                  <Line label="რეგისტრაცია" value={formatGel(result.customs.registration)} />
                  <Line label="სხვა ხარჯები (დეკლ., ექსპ., ტრანზ.)" value={formatGel(result.customs.smallFees)} />
                  <div className="mt-2 border-t border-white/10 pt-2 text-xs text-zinc-500 italic">
                    * ჯამი დოლარში: {formatUsd(result.customs.totalUsd)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300">
              {view === "import" ? (
                "მოცემული თანხა მოიცავს მხოლოდ ავტომობილის ფასს, აუქციონის მოსაკრებელს და ტრანსპორტირებას."
              ) : (
                "აქ მოცემულია მხოლოდ განბაჟების სავარაუდო ხარჯები. ავტომობილის ფასი და ტრანსპორტირება არ არის გათვალისწინებული."
              )}
            </div>
          </aside>
        </section>
      </div>
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
