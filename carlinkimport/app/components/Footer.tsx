"use client";

import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  // Scroll function same as in Header
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const yOffset = -120; // same offset as header
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#24262b] pt-14 pb-10 text-gray-300">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-white font-semibold text-lg mb-4">ჩვენს შესახებ</h3>
            <p className="text-gray-400 leading-6">
              ჩვენი გუნდი დაარსების დღიდან ინარჩუნებს, მომსახურებისა და
              კეთილისინდისიერბის უმაღლეს სტანდარტებს. გუნდი რომელსაც ნამდვილად
              შეგიძლია ანდოთ თქვენი ავტომობილის შერჩევა, შეძენა და
              ტრანსპორტირება.
            </p>

            {/* Social Icons */}
            <div className="flex justify-center space-x-4 mt-8">
              <a
                href="https://www.facebook.com/profile.php?id=61583941749777"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white hover:text-[#24262b] transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/YourPage"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white hover:text-[#24262b] transition"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-white font-semibold text-lg mb-4">ლინკები</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="hover:text-white transition cursor-pointer"
                >
                  მთავარი
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("aboutus")}
                  className="hover:text-white transition cursor-pointer"
                >
                  ჩვენს შესახებ
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-white transition cursor-pointer"
                >
                  სერვისები
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("calculator")}
                  className="hover:text-white transition cursor-pointer"
                >
                  კალკულატორი
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-white font-semibold text-lg mb-4">
              საკონტაქტო ინფორმაცია
            </h3>
            <ul className="space-y-3">
              <li>📞 0322 197 955</li>
              <li>📧 Carlinkautoimport@gmail.com</li>
              <li>📍 Tbilisi ფარნავაზ მეფის 43 ნ</li>
              <li>⏰ სამუშაო საათები: 10:00 - 19:00</li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="text-center text-gray-500 text-sm mt-10 px-4 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} Carlink Company — ყველა უფლება დაცულია.
        </div>
      </div>
    </footer>
  );
}
