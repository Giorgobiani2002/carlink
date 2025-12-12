"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Phone, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const yOffset = -120; // offset in px
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsMenuOpen(false); // close mobile menu if open
    }
  };

  return (
    <header className="bg-black py-4 shadow-md sticky top-0 z-50">
      <nav className="max-w-[1220px] max-h-[81px] m-auto w-full px-4 md:px-6 font-serif text-[18px] flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={"/carlinkfooter.webp"}
            width={120}
            height={87}
            alt="Carlink Logo"
            className="mt-3"
          />
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex max-w-[700px] w-full justify-between text-white gap-6">
          <li>
            <Link
              href={"/auctions"}
              className="cursor-pointer hover:text-red-400 transition-colors"
            >
              აუქციონი
            </Link>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("home")}
              className="cursor-pointer hover:text-red-400 transition-colors"
            >
              მთავარი
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("aboutus")}
              className="cursor-pointer hover:text-red-400 transition-colors"
            >
              ჩვენს შესახებ
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("services")}
              className="cursor-pointer hover:text-red-400 transition-colors"
            >
              სერვისები
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("calculator")}
              className="cursor-pointer hover:text-red-400 transition-colors"
            >
              კალკულატორი
            </button>
          </li>
        </ul>

        {/* Desktop Contact */}
        <div className="hidden md:flex gap-2.5 items-center">
          <Phone size={26} className="text-red-800" />
          <div className="text-white text-right">
          <div className="text-white text-right">
  <h4 className="text-sm font-semibold">დაგვიკავშირდით</h4>
  <span className="font-bold text-red-800 font-mono text-lg tabular-nums">
    0322197955
  </span>
</div>

</div>

        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-white z-[100] cursor-pointer"
        >
          {isMenuOpen ? (
            <X className="text-black" size={32} />
          ) : (
            <Menu size={32} />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 w-3/4 max-w-sm h-screen bg-white transition-transform duration-300 ease-in-out shadow-2xl z-40 p-6 pt-20 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col items-start gap-4 text-black text-xl font-semibold border-b pb-4 border-gray-100">
          <li>
            <Link
              href={"/auctions"}
              onClick={() => setIsMenuOpen(false)}
              className="block py-2"
            >
              აუქციონი
            </Link>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("home")}
              className="block py-2"
            >
              მთავარი
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("aboutus")}
              className="block py-2"
            >
              ჩვენს შესახებ
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("services")}
              className="block py-2"
            >
              სერვისები
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("calculator")}
              className="block py-2"
            >
              კალკულატორი
            </button>
          </li>
        </ul>

        {/* Mobile Contact Info */}
        <div className="flex gap-2.5 items-center mt-6">
          <Phone size={24} className="text-green-900" />
          <div className="text-black text-left">
            <h4 className="text-sm font-semibold">დაგვირეკე</h4>
            <span className="text-base font-bold text-red-800">0322197955</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </header>
  );
}
