import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Phone } from "lucide-react";

export default function Header() {
  return (
    <div className="h-[150px] bg-white  p-2 ">
      <nav className="max-w-[1220px]   m-auto w-full font-serif text-[18px] text-white flex justify-between items-center">
        {/* Logo */}
        <Image
          src={"/carlink22.png"}
          width={150}
          height={150}
          alt="Carlink Logo"
        />

        {/* Navigation */}
        <ul className="flex max-w-[630px] w-full justify-between text-black">
          <li>
            <Link href={"/"}>მთავარი</Link>
          </li>
          <li>
            <Link href={"/"}>ჩვენს შესახებ</Link>
          </li>
          <li>
            <Link href={"/"}>სერვისები</Link>
          </li>
          <li>
            <Link href={"/"}>გახდი დილერი</Link>
          </li>
          <li>
            <Link href={"/"}>ბენეფიტები</Link>
          </li>
        </ul>

        {/* Contact */}
        <div className="flex gap-2.5 items-center">
          <Phone size={26} className="text-green-900" />
          <div className="text-black">
            <h4>დაგვირეკე</h4>
            <span>+995 000 000 000</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
