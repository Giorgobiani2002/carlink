"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Calculator, Menu, Phone, X } from "lucide-react";

const navItems = [
  { label: "მთავარი", href: "/" },
  { label: "აუქციონები", href: "/auctions" },
  { label: "კალკულატორი", href: "/calculator" },
  { label: "VIN ანალიზი", href: "/vin" },
  { label: "ნაწილები", href: "/parts" },
  { label: "სერვისები", href: "/#services" },
  { label: "კონტაქტი", href: "/#contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const close = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/95 shadow-lg shadow-black/10 backdrop-blur">
      <nav className="mx-auto flex h-[82px] max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={close}>
          <Image src="/carlinkfooter.webp" width={118} height={64} alt="Carlink Logo" className="h-auto w-[118px]" priority />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const baseHref = item.href.split("#")[0];
            const active = item.href === "/" ? pathname === "/" : baseHref !== "/" && pathname.startsWith(baseHref);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    active ? "bg-white text-zinc-950" : "text-zinc-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+995544440506" className="flex items-center gap-2 text-sm font-semibold text-white">
            <Phone className="size-4 text-red-400" />
            544 440 506
          </a>
          <Link
            href="/calculator"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-red-700 px-4 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            <Calculator className="size-4" />
            დათვლა
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen((value) => !value)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-white/15 text-white md:hidden"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 top-[82px] z-40 bg-black/55 md:hidden" onClick={close} />
          <div className="fixed right-0 top-[82px] z-50 h-[calc(100vh-82px)] w-[min(360px,86vw)] border-l border-zinc-200 bg-white p-5 text-zinc-950 shadow-2xl md:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="rounded-md px-3 py-3 text-base font-semibold hover:bg-zinc-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 grid gap-2 border-t border-zinc-200 pt-5">
              <a href="tel:+995544440506" className="flex h-11 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white">
                <Phone className="size-4" />
                544 440 506
              </a>
              <Link href="/calculator" onClick={close} className="flex h-11 items-center gap-2 rounded-md bg-red-700 px-3 text-sm font-semibold text-white">
                <Calculator className="size-4" />
                კალკულატორი
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
