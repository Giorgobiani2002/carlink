"use client";

import { useState } from "react";
import { AlertTriangle, Car, Loader2, Lock, Search, ShieldCheck } from "lucide-react";

const inputClass =
  "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-700/10";

type Preview = {
  vin: string;
  vehicle: {
    make: string;
    model: string;
    year: string;
    trim: string;
    bodyClass: string;
    engine: string;
    driveType: string;
    plant: string;
  };
  recallCount: number;
  auctionAvailable: boolean;
  checkDigitValid: boolean;
};

const SAMPLE_VIN = "1HGCV1F34LA000000";

export default function VinPage() {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);

  const [contact, setContact] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function runPreview() {
    setError("");
    setPreview(null);
    const clean = vin.toUpperCase().replace(/\s+/g, "");
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(clean)) {
      setError("VIN უნდა იყოს 17 სიმბოლო (ლათინური ასოები და ციფრები, გარდა I/O/Q).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/vin/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin: clean }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "შეცდომა. სცადე ხელახლა.");
      } else {
        setPreview(data);
      }
    } catch {
      setError("ქსელის შეცდომა. სცადე ხელახლა.");
    } finally {
      setLoading(false);
    }
  }

  async function startCheckout() {
    if (!preview) return;
    setCheckoutError("");
    if (!contact.trim()) {
      setCheckoutError("მიუთითე ელფოსტა ან ტელეფონი, სადაც გამოგიგზავნოთ.");
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/vin/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin: preview.vin, contact: contact.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        setCheckoutError(data.error || "გადახდის დაწყება ვერ მოხერხდა.");
      } else {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setCheckoutError("ქსელის შეცდომა. სცადე ხელახლა.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <main className="bg-white text-zinc-950">
      <section className="bg-zinc-950 px-4 py-16 text-white md:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-zinc-200">
            <ShieldCheck className="size-4 text-red-400" />
            VIN ანალიზი
          </div>
          <h1 className="text-4xl font-semibold leading-[1.05] md:text-5xl">
            შეამოწმე მანქანა ყიდვამდე — VIN კოდით
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-300">
            ჩაწერე VIN და მიიღე დეტალური ანალიზი: მახასიათებლები, ცნობილი ხარვეზები, რისკები და
            რჩევები ყიდვამდე. უფასო შემოწმება — წამებში.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runPreview()}
              placeholder="მაგ. 1HGCV1F34LA000000"
              maxLength={17}
              className="h-12 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 text-sm uppercase text-white placeholder:text-zinc-400 outline-none transition focus:border-red-500 focus:bg-white/15"
            />
            <button
              onClick={runPreview}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-red-700 px-6 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              უფასო შემოწმება
            </button>
          </div>
          <button
            onClick={() => setVin(SAMPLE_VIN)}
            className="mt-3 text-xs text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
          >
            სცადე ნიმუშით: {SAMPLE_VIN}
          </button>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
      </section>

      {preview && (
        <section className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Free vehicle summary */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <Car className="size-5 text-red-700" />
                <h2 className="text-lg font-semibold">
                  {preview.vehicle.year} {preview.vehicle.make} {preview.vehicle.model}
                </h2>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <Row label="ვერსია" value={preview.vehicle.trim} />
                <Row label="ძარა" value={preview.vehicle.bodyClass} />
                <Row label="ძრავი" value={preview.vehicle.engine} />
                <Row label="წამყვანი" value={preview.vehicle.driveType} />
                <Row label="აწყობის ქარხანა" value={preview.vehicle.plant} />
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    preview.recallCount > 0
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <AlertTriangle className="size-3.5" />
                  {preview.recallCount} გაწვევა (recall)
                </span>
                {!preview.checkDigitValid && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    VIN-ის საკონტროლო ციფრი არ ემთხვევა
                  </span>
                )}
              </div>
            </div>

            {/* Paywall */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="pointer-events-none select-none blur-[6px]" aria-hidden>
                <p className="text-sm font-semibold text-zinc-500">სრული ანალიზი</p>
                <p className="mt-2 text-sm leading-7 text-zinc-700">
                  წარსული დაზიანება, title-ის სტატუსი, გარბენის ისტორია, ცნობილი ხარვეზები და
                  დეტალური AI რჩევები ყიდვამდე — ნაბიჯ-ნაბიჯ.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-zinc-600">
                  <li>• რისკის ქულა და დასკვნა</li>
                  <li>• წარსული დაზიანება (აუქციონი) + გარბენი</li>
                  <li>• title-ის ბრენდები (salvage/flood)</li>
                  <li>• შესამოწმებელი პუნქტები</li>
                </ul>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 p-6 text-center">
                <Lock className="mb-3 size-7 text-zinc-700" />
                <p className="text-base font-semibold text-zinc-900">სრული AI ანალიზი</p>
                <p className="mt-1 text-3xl font-bold text-red-700">5 ₾</p>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="ელფოსტა ან ტელეფონი"
                  className={`${inputClass} mt-4 max-w-xs`}
                />
                <button
                  onClick={startCheckout}
                  disabled={checkoutLoading}
                  className="mt-3 inline-flex h-12 max-w-xs items-center justify-center gap-2 rounded-xl bg-red-700 px-6 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                >
                  {checkoutLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                  გადახდა და გახსნა
                </button>
                {checkoutError && <p className="mt-3 text-sm text-red-600">{checkoutError}</p>}
                <p className="mt-3 text-xs text-zinc-500">გადახდა დაცულია — Apple Pay / Google Pay / ბარათი</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-medium text-zinc-900">{value || "—"}</dd>
    </>
  );
}
