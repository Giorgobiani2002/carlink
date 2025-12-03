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

  return (
    <header className="bg-white py-4 shadow-md sticky top-0 z-50">
      <nav className="max-w-[1220px] max-h-[81px] m-auto w-full px-4 md:px-6 font-serif text-[18px] flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={"/carlinkpng2.png"}
            width={120}
            height={87}
            alt="Carlink Logo"
            className="mt-3"
          />
        </div>

        {/* Desktop Navigation (Hidden on small/medium, shown on large) */}
        <ul className="hidden md:flex max-w-[700px] w-full justify-between text-black gap-6">
          <li>
            <Link href={"/auctions"} className="hover:text-green-900 transition-colors">
            აუქციონი
            </Link>
          </li>
          <li>
            <Link href={"/"} className="hover:text-green-900 transition-colors">
              მთავარი
            </Link>
          </li>
          <li>
            <Link href={"/"} className="hover:text-green-900 transition-colors">
              ჩვენს შესახებ
            </Link>
          </li>
          <li>
            <Link href={"/"} className="hover:text-green-900 transition-colors">
              სერვისები
            </Link>
          </li>
          <li>
            <Link href={"/"} className="hover:text-green-900 transition-colors">
            კალკულატორი
            </Link>
          </li>
        </ul>

        {/* Desktop Contact (Hidden on small/medium, shown on large) */}
        <div className="hidden md:flex gap-2.5 items-center">
          <Phone size={26} className="text-green-900" />
          <div className="text-black text-right">
            <h4 className="text-sm font-semibold">დაგვირეკე</h4>
            <span className="text-base font-bold text-green-900">
              +995 000 000 000
            </span>
          </div>
        </div>

        {/* Mobile Menu Icon (Hamburger/X - Visible only on small/medium screens) */}
        <button
          onClick={toggleMenu}
          // Increased z-index on button to ensure it's clickable over the menu when open
          className="md:hidden p-2 text-black z-[100] cursor-pointer"
        >
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      {/* Mobile Menu (Sliding from Right) */}
      <div
        className={`
          md:hidden 
          fixed top-0 right-0 
          w-3/4 max-w-sm h-screen 
          bg-white 
          transition-transform duration-300 ease-in-out 
          shadow-2xl z-40 p-6 pt-20 // z-40 keeps it below the button
          
          // Conditional classes for sliding
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <ul className="flex flex-col items-start gap-4 text-black text-xl font-semibold border-b pb-4 border-gray-100">
          <li>
            <Link href={"/auctions"} onClick={toggleMenu} className="block py-2">
              აუქციონი
            </Link>
          </li>
          <li>
            <Link href={"/"} onClick={toggleMenu} className="block py-2">
              მთავარი
            </Link>
          </li>
          <li>
            <Link href={"/"} onClick={toggleMenu} className="block py-2">
              ჩვენს შესახებ
            </Link>
          </li>
          <li>
            <Link href={"/"} onClick={toggleMenu} className="block py-2">
              სერვისები
            </Link>
          </li>
          <li>
            <Link href={"/"} onClick={toggleMenu} className="block py-2">
            დანამატის კალკულატორი
            </Link>
          </li>
        </ul>

        {/* Mobile Contact Info */}
        <div className="flex gap-2.5 items-center mt-6">
          <Phone size={24} className="text-green-900" />
          <div className="text-black text-left">
            <h4 className="text-sm font-semibold">დაგვირეკე</h4>
            <span className="text-base font-bold text-green-900">
              +995 000 000 000
            </span>
          </div>
        </div>
      </div>

      {/* Optional: Add a dimming overlay when the menu is open */}
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </header>
  );
}
