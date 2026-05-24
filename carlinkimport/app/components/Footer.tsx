"use client";

import Image from "next/image";
import Link from "next/link";
import { Calculator, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.8fr_1fr]">
          <div>
            <Image src="/carlinkfooter.webp" alt="Carlink" width={138} height={78} className="h-auto w-[138px]" />
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
              Carlink Auto Import გეხმარებათ ავტომობილის მოძიებაში, აუქციონზე შეძენაში, ტრანსპორტირებასა და
              დოკუმენტების მართვაში USA, Canada და China მიმართულებებიდან.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href="https://www.facebook.com/profile.php?id=61583941749777"
                target="_blank"
                rel="noreferrer"
                className="flex size-10 items-center justify-center rounded-md border border-white/10 hover:bg-white/10"
                aria-label="Facebook"
              >
                <FaFacebookF className="size-4" />
              </a>
              <a
                href="https://www.instagram.com/YourPage"
                target="_blank"
                rel="noreferrer"
                className="flex size-10 items-center justify-center rounded-md border border-white/10 hover:bg-white/10"
                aria-label="Instagram"
              >
                <FaInstagram className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white">ლინკები</h3>
            <div className="mt-5 grid gap-3 text-sm">
              <Link href="/" className="hover:text-white">მთავარი</Link>
              <Link href="/auctions" className="hover:text-white">აუქციონები</Link>
              <Link href="/calculator" className="inline-flex items-center gap-2 hover:text-white">
                <Calculator className="size-4 text-red-400" />
                კალკულატორი
              </Link>
              <Link href="/#services" className="hover:text-white">სერვისები</Link>
              <Link href="/admin" className="hover:text-white">Admin</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white">საკონტაქტო ინფორმაცია</h3>
            <div className="mt-5 grid gap-3 text-sm">
              <a href="tel:+995544440506" className="flex items-center gap-2 hover:text-white">
                <Phone className="size-4 text-red-400" />
                +995 544 440 506
              </a>
              <a href="tel:+995322197955" className="flex items-center gap-2 hover:text-white">
                <Phone className="size-4 text-red-400" />
                0322 197 955
              </a>
              <a href="mailto:Carlinkautoimport@gmail.com" className="flex items-center gap-2 hover:text-white">
                <Mail className="size-4 text-red-400" />
                Carlinkautoimport@gmail.com
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-red-400" />
                თბილისი, ფარნავაზ მეფის 43
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Carlink Company. ყველა უფლება დაცულია.
        </div>
      </div>
    </footer>
  );
}
