"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Lock, Loader2, Plus, Save, Shield, ToggleLeft, ToggleRight } from "lucide-react";
import { AuctionProvider, LocationTariff } from "../lib/calculator";
import {
  fetchAdminTariffs,
  hasSupabaseConfig,
  loginAdmin,
  upsertAdminTariff,
} from "../lib/supabase-rest";

const emptyTariff: LocationTariff = {
  id: "",
  auction: "copart",
  state: "",
  city: "",
  yardName: "",
  port: "",
  inlandPrice: 0,
  oceanPrice: 0,
  active: true,
};

const inputClass =
  "h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-700/10";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tariffs, setTariffs] = useState<LocationTariff[]>([]);
  const [draft, setDraft] = useState<LocationTariff>(emptyTariff);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadTariffs = useCallback(async (accessToken = token) => {
    if (!hasSupabaseConfig) {
      setTariffs([]);
      setMessage("Supabase env vars არ არის დამატებული.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      setTariffs(await fetchAdminTariffs(accessToken));
    } catch {
      setMessage("ტარიფების ჩატვირთვა ვერ მოხერხდა. თავიდან შედით admin-ში.");
      window.localStorage.removeItem("carlink_admin_token");
      setToken("");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const stored = window.localStorage.getItem("carlink_admin_token");
    if (stored) {
      setToken(stored);
      loadTariffs(stored);
    }
  }, [loadTariffs]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const session = await loginAdmin(email, password);
      window.localStorage.setItem("carlink_admin_token", session.access_token);
      setToken(session.access_token);
      await loadTariffs(session.access_token);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "შესვლა ვერ მოხერხდა.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.state || !draft.city || !draft.yardName || !draft.port) {
      setMessage("შეავსეთ შტატი, ქალაქი, yard და პორტი.");
      return;
    }

    if (!hasSupabaseConfig) {
      setMessage("Supabase არ არის დაკავშირებული და შენახვა ვერ მოხერხდა.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const saved = await upsertAdminTariff(token, draft);
      setTariffs((current) => [saved, ...current.filter((tariff) => tariff.id !== saved.id)]);
      setDraft(emptyTariff);
      setMessage("ტარიფი შენახულია.");
    } catch {
      setMessage("შენახვა ვერ მოხერხდა. შეამოწმეთ Supabase table/RLS permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("carlink_admin_token");
    setToken("");
    setTariffs([]);
  };

  if (!token && hasSupabaseConfig) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
        <section className="mx-auto max-w-md rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-md bg-red-700">
              <Lock className="size-5" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Carlink Admin</p>
              <h1 className="text-2xl font-semibold">ტარიფების მართვა</h1>
            </div>
          </div>

          <form className="grid gap-4" onSubmit={handleLogin}>
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Admin email"
              required
            />
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
            />
            {message && <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-100">{message}</p>}
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-700 text-sm font-semibold text-white hover:bg-red-600">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Shield className="size-4" />}
              შესვლა
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 md:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-lg bg-zinc-950 p-5 text-white md:flex-row md:items-center">
          <div>
            <p className="text-sm text-red-300">Carlink Admin</p>
            <h1 className="text-3xl font-semibold">Location tariff manager</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => loadTariffs()}
              className="h-10 rounded-md border border-white/15 px-4 text-sm font-semibold hover:bg-white/10"
            >
              განახლება
            </button>
            <button onClick={logout} className="h-10 rounded-md bg-white px-4 text-sm font-semibold text-zinc-950">
              გამოსვლა
            </button>
          </div>
        </div>

        {message && <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{message}</div>}

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <form className="rounded-lg bg-white p-5 shadow-sm" onSubmit={handleSave}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{draft.id ? "ტარიფის რედაქტირება" : "ახალი ტარიფი"}</h2>
              <Plus className="size-5 text-red-700" />
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                Auction
                <select
                  className={inputClass}
                  value={draft.auction}
                  onChange={(event) => setDraft({ ...draft, auction: event.target.value as AuctionProvider })}
                >
                  <option value="copart">Copart</option>
                  <option value="iaai">IAAI</option>
                </select>
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="State" value={draft.state} onChange={(value) => setDraft({ ...draft, state: value })} />
                <Field label="City" value={draft.city} onChange={(value) => setDraft({ ...draft, city: value })} />
              </div>
              <Field label="Yard name" value={draft.yardName} onChange={(value) => setDraft({ ...draft, yardName: value })} />
              <Field label="Port" value={draft.port} onChange={(value) => setDraft({ ...draft, port: value })} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Inland price"
                  type="number"
                  value={String(draft.inlandPrice)}
                  onChange={(value) => setDraft({ ...draft, inlandPrice: Number(value) })}
                />
                <Field
                  label="Ocean price"
                  type="number"
                  value={String(draft.oceanPrice)}
                  onChange={(value) => setDraft({ ...draft, oceanPrice: Number(value) })}
                />
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, active: !draft.active })}
                className="flex h-11 items-center justify-between rounded-md border border-zinc-200 px-3 text-sm font-semibold"
              >
                Active tariff
                {draft.active ? <ToggleRight className="size-6 text-red-700" /> : <ToggleLeft className="size-6 text-zinc-400" />}
              </button>
              <button
                disabled={isLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-700 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                შენახვა
              </button>
            </div>
          </form>

          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-5">
              <h2 className="text-xl font-semibold">ტარიფები</h2>
              <p className="mt-1 text-sm text-zinc-500">Public calculator აჩვენებს მხოლოდ active ჩანაწერებს.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Auction</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Yard</th>
                    <th className="px-4 py-3">Port</th>
                    <th className="px-4 py-3">Prices</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {tariffs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">
                        ჯერ ტარიფები არ არის დამატებული.
                      </td>
                    </tr>
                  ) : (
                    tariffs.map((tariff) => (
                      <tr key={tariff.id}>
                        <td className="px-4 py-3 font-semibold uppercase">{tariff.auction}</td>
                        <td className="px-4 py-3">
                          {tariff.city}, {tariff.state}
                        </td>
                        <td className="px-4 py-3">{tariff.yardName}</td>
                        <td className="px-4 py-3">{tariff.port}</td>
                        <td className="px-4 py-3">
                          ${tariff.inlandPrice} / ${tariff.oceanPrice}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              tariff.active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                            }`}
                          >
                            {tariff.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setDraft(tariff)}
                            className="rounded-md border border-zinc-200 px-3 py-2 text-xs font-semibold hover:border-red-300"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input className={inputClass} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
