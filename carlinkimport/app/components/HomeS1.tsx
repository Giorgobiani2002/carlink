"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { send } from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function HomeS1() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isSending, setIsSending] = useState(false); // <-- loader state

  // Form submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;

    setIsSending(true); // start loader

    send(
      "service_lx1jtao",      
      "template_u7lxy4c",     
      { name, phone },        
      "WriQ6zi0lkHaU-bMR"       
    )
      .then(() => {
        toast.success("თქვენი მესიჯი გაიგზავნა წარმატებით!");
        form.reset();
        setIsOpen(false);
      })
      .catch((err) => {
        toast.error("მესიჯი არ გაიგზავნა.ხარვეზი" + err.text);
      })
      .finally(() => setIsSending(false)); // stop loader
  };

  return (
    <div id="home" className="relative w-full h-screen">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {/* Fallback Image */}
      <Image
        src="/lambo.png"
        alt="Car Thumbnail"
        fill
        priority
        className={`object-cover transition-opacity duration-700 ${
          videoLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Background Video */}
      <video
        src="/lambo.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
        className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center gap-2 justify-center text-center px-4">
        <Image
          src="/carlinkfooter.webp"
          width={300}
          height={200}
          alt="Carlink Logo"
          className="mt-10 relative pointer-events-none"
        />
        <p className="text-white mt-[-118px] pointer-events-none">
          ავტომობილების იმპორტი ამერიკიდან და ჩინეთიდან
        </p>
        <Link href="/auctions">
          <button
            className="w-60 h-14 rounded-full bg-red-800 text-white mt-4 
            hover:bg-red-400 hover:w-64 
            transform transition-all duration-300 ease-out 
            hover:-translate-y-2 hover:shadow-xl cursor-pointer"
          >
            აუქციონები
          </button>
        </Link>
      </div>

      {/* Floating Contact Button */}
      <div className="fixed right-5 bottom-20 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg hover:bg-gray-800 transition duration-300 group"
          title="Contact us"
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50 animate-ping"></span>
          <img
            src="/carlinkfooter.webp"
            alt="Contact"
            className="relative w-20 h-20 rounded-full transition-transform duration-300 hover:scale-125 cursor-pointer"
          />
        </button>
      </div>

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-xl w-full max-w-md p-6 relative transform transition-all duration-300 ease-out
          ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"}`}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>

          {/* Modal Content */}
          <h2 className="text-red-900 text-2xl font-bold mb-4 text-center">
            🚘 მანქანის შერჩევა
          </h2>
          <p className="mb-4 text-gray-700 text-center">
            მე დაგეხმარები შენთვის სასურველი მანქანის შერჩევასა და ჩამოყვანაში. შეავსე ფორმა და ძალიან მალე დაგიკავშირდები
          </p>

          {/* Form */}
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="სახელი"
              className="w-full border border-red-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
            />
            <input
              type="tel"
              name="phone"
              placeholder="+995 XXX XXX XXX"
              className="w-full border border-red-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
            />
            <button
              type="submit"
              className="w-full bg-black text-white cursor-pointer py-3 rounded-2xl hover:bg-red-600 transition mt-2 font-semibold flex items-center justify-center gap-2"
              disabled={isSending} // disable while sending
            >
              {isSending && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {isSending ? "Sending..." : "გაგზავნა"}
            </button>
          </form>

          {/* Optional Info */}
          <div className="mt-6 text-black space-y-2">
            <p className="font-bold">რატომ Carlink-ი?</p>
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
              className="flex-1 text-center py-2 bg-black text-white rounded-xl hover:bg-red-600 transition font-semibold"
            >
              📞 Call
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61583941749777"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 bg-black text-white rounded-xl hover:bg-red-500 transition font-semibold"
            >
              💬 Messenger
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
