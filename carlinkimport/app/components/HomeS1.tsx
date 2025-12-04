"use client";
import React, { useState } from "react";

export default function HomeS1() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="home" className="relative w-full h-screen">
      {/* Background Video */}
      <video
        src="/lambo.webm"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        preload="none" 
      />

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center gap-2 justify-center text-center px-4">
        <h1 className="text-white text-[80px] font-bold drop-shadow-lg font-serif">
          CARLINK
        </h1>
        <span className="text-green-900 font-serif text-[20px] font-extrabold">
          AUTO IMPORT
        </span>
        <p className="text-white">
          ავტომობილების იმპორტი ამერიკიდან და ჩინეთიდან
        </p>
        <button
          className="w-60 h-14 rounded-full bg-green-900 text-white mt-4 
                   hover:w-72 hover:bg-green-800 
                   transform transition-all duration-300 hover:translate-x-2"
        >
          აუქციონები
        </button>
      </div>

      {/* Fixed Button on the Right */}
      <div className="fixed right-5 bottom-20 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 rounded-full bg-black  flex items-center justify-center shadow-lg hover:bg-gray-800 transition duration-300 group"
          title="Contact us"
        >
          {/* Animated ping effect */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50 animate-ping"></span>

          {/* Sergi Image */}
          <img
            src="/carlinkfooter.webp"
            alt="Contact"
            className="relative w-20 h-20 rounded-full transition-transform duration-300 hover:scale-125 cursor-pointer"
          />
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>

            {/* Modal Content */}
            <h2 className="text-green-900 text-2xl font-bold mb-4 text-center">
              🚘 მანქანის შერჩევა
            </h2>
            <p className="mb-4 text-gray-700 text-center">
              მე დაგეხმარები შენთვის სასურველი მანქანის შერჩევასა და
              ჩამოყვანაში. შეავსე ფორმა და ძალიან მალე დაგიკავშირდები
            </p>

            {/* Form */}
            <form className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="სახელი"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
              />
              <input
                type="tel"
                placeholder="+995 XXX XXX XXX"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
              />

              <button
                type="submit"
                className="w-full bg-green-900 text-white py-3 rounded-2xl hover:bg-green-800 transition mt-2"
              >
                გაგზავნა
              </button>
            </form>

            {/* Optional Info Section */}
            <div className="mt-6 text-gray-700 space-y-2">
              <p>რატომ Carlink-ი?</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>მრავალ-წლიანი გამოცდილება</li>
                <li>6000+ კმაყოფილი მომხმარებელი</li>
                <li>პროფესიონალი ქარდილერები</li>

                <li>დაზღვეული ტრანსპორტირება</li>
              </ul>
            </div>

            {/* Contact Options */}
            <div className="mt-4 flex justify-between gap-4">
              <a
                href="tel:+995544440506"
                className="flex-1 text-center py-2 bg-green-900 text-white rounded-xl hover:bg-green-800 transition"
              >
                📞 Call
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61583941749777"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition"
              >
                💬 Messenger
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
