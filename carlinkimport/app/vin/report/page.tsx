"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, Phone } from "lucide-react";

type Analysis = {
  riskScore: number;
  riskLabel: string;
  summary: string;
  narrative: string;
  sections: { title: string; body: string }[];
  checklist: string[];
};

type Recall = { component: string; summary: string; consequence: string; remedy: string };

type History = {
  available: boolean;
  titles: { date: string; state: string; meter: string; meterUnit: string; current: boolean }[];
  brands: { name: string; type: string; date: string }[];
  salvage: {
    date: string;
    location: string;
    primaryDamage: string;
    secondaryDamage: string;
    odometer: string;
    saleDocument: string;
  }[];
  jsi: { date: string; recordType: string; brander: string; disposition: string }[];
};

type ReportResponse = {
  status: "pending" | "generating" | "paid";
  vin?: string;
  vehicle?: { make: string; model: string; year: string } | null;
  recalls?: Recall[];
  history?: History | null;
  analysis?: Analysis | null;
  error?: string;
};

function riskColor(label: string): string {
  if (label.includes("მაღალ")) return "bg-red-50 text-red-700";
  if (label.includes("დაბალ")) return "bg-emerald-50 text-emerald-700";
  return "bg-amber-50 text-amber-700";
}

function ReportInner() {
  const params = useSearchParams();
  const order = params.get("order");
  const token = params.get("token");

  const [data, setData] = useState<ReportResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!order || !token) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(
          `/api/vin/report?order=${encodeURIComponent(order!)}&token=${encodeURIComponent(token!)}`,
        );
        const json = (await res.json()) as ReportResponse;
        if (!active) return;
        if (!res.ok) {
          setError(json.error || "შეცდომა.");
          return;
        }
        setData(json);
        if (json.status !== "paid") timer = setTimeout(poll, 3000);
      } catch {
        if (active) timer = setTimeout(poll, 4000);
      }
    }
    poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [order, token]);

  if (!order || !token) {
    return <Centered title="ბმული არასწორია." />;
  }
  if (error) {
    return <Centered title={error} />;
  }
  if (!data || data.status !== "paid") {
    return (
      <Centered
        title={data?.status === "generating" ? "ანალიზი მუშავდება..." : "ვამოწმებთ გადახდას..."}
        spinner
      />
    );
  }

  const a = data.analysis;
  return (
    <main className="bg-white text-zinc-950">
      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="size-4" /> გადახდილია — შენი ანალიზი მზადაა
        </div>
        <h1 className="text-2xl font-semibold md:text-3xl">
          {data.vehicle?.year} {data.vehicle?.make} {data.vehicle?.model}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">VIN: {data.vin}</p>

        {a && (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${riskColor(
                  a.riskLabel,
                )}`}
              >
                რისკი: {a.riskLabel} ({a.riskScore}/100)
              </span>
              <p className="flex-1 text-sm font-medium text-zinc-800">{a.summary}</p>
            </div>

            {a.narrative && (
              <p className="mt-6 whitespace-pre-line text-[15px] leading-8 text-zinc-700">
                {a.narrative}
              </p>
            )}

            {a.sections?.map((s, i) => (
              <div key={i} className="mt-6">
                <h2 className="text-base font-semibold text-zinc-900">{s.title}</h2>
                <p className="mt-1 whitespace-pre-line text-[15px] leading-8 text-zinc-700">{s.body}</p>
              </div>
            ))}

            {a.checklist?.length > 0 && (
              <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
                <h2 className="mb-3 text-base font-semibold">შესამოწმებელი პუნქტები ყიდვამდე</h2>
                <ul className="space-y-2">
                  {a.checklist.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm text-zinc-700">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-red-700" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {data.history?.available && (
          <div className="mt-8">
            <h2 className="mb-3 text-base font-semibold">მანქანის ისტორია</h2>

            {data.history.brands.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {data.history.brands.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                  >
                    {b.name}
                    {b.date ? ` · ${b.date}` : ""}
                  </span>
                ))}
              </div>
            )}

            {data.history.salvage.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-zinc-700">წარსული დაზიანება (აუქციონი)</p>
                {data.history.salvage.map((s, i) => (
                  <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-semibold text-zinc-900">{s.location || "—"}</span>
                      <span className="text-zinc-500">{s.date}</span>
                    </div>
                    <p className="mt-1 text-zinc-700">
                      დაზიანება: <span className="font-medium">{s.primaryDamage || "—"}</span>
                      {s.secondaryDamage ? ` / ${s.secondaryDamage}` : ""}
                    </p>
                    {s.odometer && <p className="text-zinc-700">გარბენი: {s.odometer}</p>}
                    {s.saleDocument && <p className="text-zinc-500">დოკუმენტი: {s.saleDocument}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-emerald-700">აუქციონის დაზიანების ჩანაწერი ვერ მოიძებნა.</p>
            )}

            {data.history.titles.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-zinc-700">გარბენის ისტორია</p>
                <ul className="space-y-1 text-sm text-zinc-700">
                  {data.history.titles.map((t, i) => (
                    <li key={i} className="flex justify-between border-b border-zinc-100 py-1">
                      <span>
                        {t.date} · {t.state}
                      </span>
                      <span className="font-medium">
                        {t.meter} {t.meterUnit === "K" ? "კმ" : "მილი"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {data.recalls && data.recalls.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-base font-semibold">გაწვევები (recalls)</h2>
            <div className="space-y-3">
              {data.recalls.map((r, i) => (
                <div key={i} className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                  <p className="font-semibold text-amber-900">{r.component}</p>
                  <p className="mt-1 text-zinc-700">{r.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3 border-t border-zinc-200 pt-6">
          <a
            href="tel:+995544440506"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-red-700 px-5 text-sm font-semibold text-white hover:bg-red-600"
          >
            <Phone className="size-4" />
            კონსულტაცია
          </a>
          <Link
            href="/vin"
            className="inline-flex h-12 items-center gap-2 rounded-md border border-zinc-300 px-5 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            სხვა VIN-ის შემოწმება
          </Link>
        </div>
      </section>
    </main>
  );
}

function Centered({ title, spinner }: { title: string; spinner?: boolean }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white px-4 text-center">
      <div>
        {spinner && <Loader2 className="mx-auto mb-4 size-8 animate-spin text-red-700" />}
        <p className="text-lg font-semibold text-zinc-800">{title}</p>
      </div>
    </main>
  );
}

export default function VinReportPage() {
  return (
    <Suspense fallback={<Centered title="იტვირთება..." spinner />}>
      <ReportInner />
    </Suspense>
  );
}
