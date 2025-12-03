import Image from "next/image";
import React from "react";
import { FaFacebookF, FaInstagram, FaFacebookMessenger } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#24262b] pt-14 pb-10 text-gray-300">
      <div className="max-w-[1200px] mx-auto px-4">

        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Company Info */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-white font-semibold text-lg mb-4">ჩვენს შესახებ</h3>
            <p className="text-gray-400 leading-6">
              ჩვენ ვართ სანდო საერთაშორისო ავტოიმპორტიორი კომპანია, რომელსაც შეუძლია მთელი
              მსოფლიოს მასშტაბით თქვენთვის სასურველი მანქანის ჩამოყვანა,
              უსაფრთხო ტრანსპორტირებით და გამორჩეული სერვისით.
            </p>

            {/* Social Icons */}
            <div className="flex justify-center space-x-4 mt-8">
  <a
    href="https://www.facebook.com/YourPage"
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

  <a
    href="https://m.me/YourPage"  // Messenger link
    target="_blank"
    rel="noopener noreferrer"
    className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white hover:text-[#24262b] transition"
  >
    <FaFacebookMessenger />
  </a>
</div>

          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-white font-semibold text-lg mb-4">ლინკები</h3>
            <ul className="space-y-3">
              <li>
                <a className="hover:text-white transition cursor-pointer">მთავარი</a>
              </li>
              <li>
                <a className="hover:text-white transition cursor-pointer">ჩვენს შესახებ</a>
              </li>
              <li>
                <a className="hover:text-white transition cursor-pointer">
                  სერვისები
                </a>
              </li>
              <li>
                <a className="hover:text-white transition cursor-pointer">
                  კალკულატორი
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-white font-semibold text-lg mb-4">საკონტაქტო ინფორმაცია</h3>
            <ul className="space-y-3">
              <li>📞 +995 555 123 456</li>
              <li>📧 info@carexport.com</li>
              <li>📍 Tbilisi, Georgia</li>
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
