"use client";

import { send } from "@emailjs/browser";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CheckCircle2,
  FileCheck2,
  Mail,
  MapPinned,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { FeaturedVehicle } from "./lib/calculator";
import { fetchPublicVehicles, hasSupabaseConfig } from "./lib/supabase-rest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const steps = [
  { title: "შერჩევა", text: "ვპოულობთ მანქანას Copart, IAAI ან პარტნიორ ბაზებზე.", icon: Search },
  { title: "აუქციონი", text: "ვამოწმებთ title-ს, დაზიანებას, ისტორიას და ბიუჯეტს.", icon: BadgeCheck },
  { title: "ტრანსპორტი", text: "ვგეგმავთ yard pickup-ს, პორტს და საზღვაო გადაზიდვას.", icon: Truck },
  { title: "ჩაბარება", text: "გეხმარებით საბუთებში, განბაჟებაში და საბოლოო მიწოდებაში.", icon: FileCheck2 },
];

const services = [
  "ავტომობილის მოძიება და შეფასება",
  "Copart / IAAI აუქციონზე მონაწილეობა",
  "შიდა და საზღვაო ლოგისტიკა",
  "Title check და დოკუმენტების კონტროლი",
  "დაზღვევა და გზაში სტატუსის მონიტორინგი",
  "კონსულტაცია განბაჟებასა და რეგისტრაციაზე",
];

const faq = [
  ["რა შედის კალკულატორის ფასში?", "Bid, აუქციონის fee, inland transport, ocean shipping, service fee და არჩეული დამატებითი სერვისები."],
  ["რამდენი დრო სჭირდება ჩამოყვანას?", "საშუალოდ 6-10 კვირა, რაც დამოკიდებულია yard-ზე, პორტზე და გემის schedule-ზე."],
  ["დაზიანებულ მანქანასაც ამოწმებთ?", "დიახ, ვამოწმებთ ფოტოების, title status-ის და რისკების დონეს, სანამ აუქციონზე შევალთ."],
  ["შემიძლია კონკრეტული მანქანის მოძებნა?", "დიახ, დაგვიტოვეთ სასურველი მარკა, მოდელი, წელი და ბიუჯეტი, გუნდი დაგიკავშირდებათ."],
];

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [vehicles, setVehicles] = useState<FeaturedVehicle[]>([]);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    fetchPublicVehicles().then(setVehicles).catch(() => setVehicles([]));
  }, []);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const desiredCar = String(formData.get("desiredCar") ?? "").trim();
    const budget = String(formData.get("budget") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();

    if (!name || !phone) {
      toast.error("შეავსე სახელი და ტელეფონი.");
      return;
    }

    setIsSending(true);

    try {
      await send(
        "service_2v5rcbm",
        "template_0c7gopa",
        {
          name,
          phone,
          make: desiredCar || "Not specified",
          model: budget || "Not specified",
          year: notes || "Not specified",
        },
        "zkuga8Pi8HVdc2H_N",
      );
      toast.success("მოთხოვნა გაიგზავნა. მალე დაგიკავშირდებით.");
      form.reset();
      setContactOpen(false);
    } catch {
      toast.error("გაგზავნა ვერ მოხერხდა. სცადე თავიდან.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="bg-white text-zinc-950">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <section id="home" className="relative min-h-[calc(100vh-82px)] overflow-hidden bg-zinc-950 text-white">
        <video
          src="/tiktok.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-42"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/30" />
        <div className="relative mx-auto grid min-h-[calc(100vh-82px)] max-w-7xl items-center gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-zinc-200 backdrop-blur">
              <Sparkles className="size-4 text-red-400" />
              Auto import from USA, Canada and China
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
              ავტომობილის იმპორტი გამჭვირვალე ფასით და კონტროლით პირველივე დღიდან.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-200 md:text-lg">
              Carlink გეხმარებათ მანქანის შერჩევაში, აუქციონზე შეძენაში, ტრანსპორტირებაში და საბუთების მართვაში. თქვენ ხედავთ გზას, ფასს და მომდევნო ნაბიჯს.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/calculator"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-red-700 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                <Calculator className="size-4" />
                კალკულატორი
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                მოთხოვნის დატოვება
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                <Image src="/lambo.png" alt="Carlink import vehicle" fill className="object-cover" priority />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["2019", "წლიდან ბაზარზე"],
                  ["3", "მიმართულება"],
                  ["24/7", "სტატუსის კონტროლი"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-md bg-zinc-950/70 p-3">
                    <p className="text-xl font-semibold">{value}</p>
                    <p className="mt-1 text-xs text-zinc-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="bg-zinc-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading eyebrow="Workflow" title="როგორ მუშაობს იმპორტი" text="მთელი პროცესი დაყოფილია მარტივ ნაბიჯებად, რომ იცოდეთ სად არის მანქანა და რა ხდება შემდეგ." />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-lg border border-zinc-200 bg-white p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-md bg-red-700 text-white">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-400">0{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="services" className="bg-zinc-950 py-16 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading dark eyebrow="Services" title="რატომ Carlink" text="ჩვენი მიზანია იმპორტი იყოს პროგნოზირებადი: წინასწარი შემოწმებით, გამჭვირვალე ღირებულებით და ცოცხალი კომუნიკაციით." />
            <Link
              href="/calculator"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-red-700 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              ფასის დათვლა
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {services.map((service) => (
              <div key={service} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-red-400" />
                <span className="text-sm leading-6 text-zinc-200">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="routes" className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading eyebrow="Routes" title="მიმართულებები" text="ვმუშაობთ იმ ბაზრებზე, სადაც არჩევანი, ფასები და ლოგისტიკა რეალურად აძლევს კლიენტს უპირატესობას." />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["USA", "Copart / IAAI", "ყველაზე დიდი არჩევანი, დაზიანებული და clean title ავტომობილები."],
              ["Canada", "Dealer / Auctions", "კარგი მდგომარეობის მანქანები და ევროპულ ბაზართან ახლო სპეციფიკაციები."],
              ["China", "EV / New cars", "ელექტრომობილები, ახალი მოდელები და სწრაფად მზარდი არჩევანი."],
            ].map(([country, label, text]) => (
              <div key={country} className="rounded-lg border border-zinc-200 p-5">
                <MapPinned className="mb-5 size-7 text-red-700" />
                <h3 className="text-2xl font-semibold">{country}</h3>
                <p className="mt-1 text-sm font-semibold text-red-700">{label}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading eyebrow="Popular" title="ხშირად მოთხოვნილი მოდელები" text="ეს ბლოკი admin-იდან იმართება: ფოტო, ძრავი, წლების შუალედი, ცხენის ძალა და ფასის დიაპაზონი." />
          {vehicles.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
              Featured მანქანები ჯერ არ არის დამატებული. შეავსე `/admin`-ში vehicles სექცია.
            </div>
          ) : (
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {vehicles.map((car) => (
                <article key={car.id} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                  <div className="relative aspect-[16/10] bg-zinc-100">
                    <Image src={car.imageUrl} alt={`${car.brand} ${car.model}`} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold">{car.brand} {car.model}</h3>
                    <p className="mt-2 text-sm text-zinc-500">
                      {car.yearFrom} - {car.yearTo} • {car.engine} • {car.horsepower} HP
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {car.fuel} • {car.drive}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-red-700">
                      ${car.priceFrom.toLocaleString()} - ${car.priceTo.toLocaleString()}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg bg-zinc-950 p-6 text-white md:p-8">
            <SectionHeading dark eyebrow="Documents" title="რა დაგჭირდებათ" text="შეკვეთის დაწყებამდე საკმარისია რამდენიმე საბაზისო ინფორმაცია. დანარჩენ პროცესს ჩვენი გუნდი გაუძღვება." />
            <div className="mt-8 grid gap-3">
              {["პირადი მონაცემები და საკონტაქტო ნომერი", "სასურველი მარკა, მოდელი, წელი და ბიუჯეტი", "გადახდის გრაფიკის შეთანხმება", "საბუთების გადამოწმება ჩამოსვლამდე"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] p-3">
                  <ShieldCheck className="size-5 text-red-400" />
                  <span className="text-sm text-zinc-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 p-6 md:p-8">
            <SectionHeading eyebrow="FAQ" title="ხშირი კითხვები" text="მოკლე პასუხები ყველაზე პრაქტიკულ კითხვებზე." />
            <div className="mt-8 grid gap-3">
              {faq.map(([question, answer]) => (
                <details key={question} className="rounded-md border border-zinc-200 p-4">
                  <summary className="cursor-pointer text-sm font-semibold">{question}</summary>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {contactOpen && (
          <div className="w-[340px] rounded-2xl border border-zinc-200 bg-white p-4 text-zinc-950 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold">მოთხოვნის გაგზავნა</p>
              <button onClick={() => setContactOpen(false)} className="rounded-md p-1 hover:bg-zinc-100">
                <X className="size-4" />
              </button>
            </div>

            <form className="grid gap-3" onSubmit={handleContactSubmit}>
              <input
                name="name"
                placeholder="სახელი"
                className="h-11 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-red-700"
              />
              <input
                name="phone"
                placeholder="ტელეფონი"
                className="h-11 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-red-700"
              />
              <input
                name="desiredCar"
                placeholder="სასურველი მანქანა"
                className="h-11 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-red-700"
              />
              <input
                name="budget"
                placeholder="ბიუჯეტი"
                className="h-11 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-red-700"
              />
              <textarea
                name="notes"
                placeholder="დამატებითი ინფორმაცია"
                className="min-h-24 rounded-xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-red-700"
              />
              <button
                type="submit"
                disabled={isSending}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSending ? "იგზავნება..." : "გაგზავნა"}
              </button>
            </form>

            <div className="mt-3 grid gap-2">
              <a className="flex h-11 items-center gap-2 rounded-xl bg-zinc-950 px-3 text-sm font-semibold text-white" href="tel:+995544440506">
                <Phone className="size-4" />
                დარეკვა
              </a>
              <a className="flex h-11 items-center gap-2 rounded-xl border border-zinc-200 px-3 text-sm font-semibold" href="mailto:Carlinkautoimport@gmail.com">
                <Mail className="size-4" />
                ელფოსტა
              </a>
              <a className="flex h-11 items-center gap-2 rounded-xl border border-zinc-200 px-3 text-sm font-semibold" href="https://www.facebook.com/profile.php?id=61583941749777" target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                Messenger
              </a>
            </div>
          </div>
        )}
        <button
          onClick={() => setContactOpen((value) => !value)}
          className="flex size-14 items-center justify-center rounded-full bg-red-700 text-white shadow-xl shadow-red-900/30 transition hover:bg-red-600"
          aria-label="Open contact actions"
        >
          <MessageCircle className="size-6" />
        </button>
      </div>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  dark?: boolean;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="h-px w-10 bg-red-700" />
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">{eyebrow}</span>
      </div>
      <h2 className={`text-3xl font-semibold tracking-normal md:text-4xl ${dark ? "text-white" : "text-zinc-950"}`}>{title}</h2>
      <p className={`mt-4 max-w-2xl text-sm leading-7 md:text-base ${dark ? "text-zinc-300" : "text-zinc-600"}`}>{text}</p>
    </div>
  );
}
