"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { send } from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Static car database - no API needed!
const CAR_DATABASE: Record<string, string[]> = {
  "Acura": ["ILX", "Integra", "MDX", "NSX", "RDX", "RLX", "TLX", "TSX", "ZDX"],
  "Alfa Romeo": ["4C", "Giulia", "Stelvio", "Tonale"],
  "Audi": ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "R8", "RS3", "RS5", "RS6", "RS7", "S3", "S4", "S5", "S6", "S7", "S8", "TT"],
  "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "i7", "iX", "M2", "M3", "M4", "M5", "M8"],
  "Buick": ["Enclave", "Encore", "Envision", "LaCrosse", "Regal"],
  "Cadillac": ["ATS", "CT4", "CT5", "CT6", "CTS", "Escalade", "Lyriq", "SRX", "XT4", "XT5", "XT6", "XTS"],
  "Chevrolet": ["Blazer", "Bolt", "Camaro", "Captiva", "Colorado", "Corvette", "Cruze", "Equinox", "Express", "Impala", "Malibu", "Silverado 1500", "Silverado 2500HD", "Silverado 3500HD", "Spark", "Suburban", "Tahoe", "Trailblazer", "Traverse", "Trax"],
  "Chrysler": ["200", "300", "Pacifica", "Town & Country", "Voyager"],
  "Dodge": ["Challenger", "Charger", "Durango", "Grand Caravan", "Hornet", "Journey", "Ram 1500", "Ram 2500", "Ram 3500"],
  "Ferrari": ["296 GTB", "812", "F8", "Portofino", "Roma", "SF90"],
  "Fiat": ["500", "500L", "500X", "124 Spider"],
  "Ford": ["Bronco", "Bronco Sport", "Edge", "Escape", "Expedition", "Explorer", "F-150", "F-250", "F-350", "Fiesta", "Flex", "Fusion", "Maverick", "Mustang", "Mustang Mach-E", "Ranger", "Super Duty", "Taurus", "Transit"],
  "Genesis": ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  "GMC": ["Acadia", "Canyon", "Sierra 1500", "Sierra 2500HD", "Sierra 3500HD", "Terrain", "Yukon", "Yukon XL"],
  "Honda": ["Accord", "Civic", "CR-V", "CR-Z", "Fit", "HR-V", "Insight", "Odyssey", "Passport", "Pilot", "Ridgeline"],
  "Hyundai": ["Accent", "Elantra", "Genesis", "Ioniq 5", "Ioniq 6", "Kona", "Nexo", "Palisade", "Santa Cruz", "Santa Fe", "Sonata", "Tucson", "Veloster", "Venue"],
  "Infiniti": ["Q50", "Q60", "Q70", "QX30", "QX50", "QX55", "QX60", "QX80"],
  "Jaguar": ["E-PACE", "F-PACE", "F-TYPE", "I-PACE", "XE", "XF", "XJ"],
  "Jeep": ["Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Grand Wagoneer", "Renegade", "Wagoneer", "Wrangler"],
  "Kia": ["Carnival", "Forte", "K5", "Niro", "Optima", "Rio", "Sedona", "Seltos", "Sorento", "Soul", "Sportage", "Stinger", "Telluride"],
  "Lamborghini": ["Aventador", "Huracan", "Urus"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
  "Lexus": ["ES", "GS", "GX", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "RZ", "UX"],
  "Lincoln": ["Aviator", "Corsair", "MKC", "MKT", "MKX", "MKZ", "Nautilus", "Navigator"],
  "Maserati": ["Ghibli", "GranTurismo", "Grecale", "Levante", "MC20", "Quattroporte"],
  "Mazda": ["CX-3", "CX-30", "CX-5", "CX-50", "CX-9", "CX-90", "Mazda3", "Mazda6", "MX-5 Miata"],
  "Mercedes-Benz": ["A-Class", "C-Class", "CLA", "CLS", "E-Class", "EQB", "EQE", "EQS", "G-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "S-Class", "SL", "SLC"],
  "Mini": ["Clubman", "Convertible", "Countryman", "Hardtop", "Paceman"],
  "Mitsubishi": ["Eclipse Cross", "Mirage", "Outlander", "Outlander PHEV", "Outlander Sport"],
  "Nissan": ["370Z", "Altima", "Armada", "Frontier", "GT-R", "Kicks", "Leaf", "Maxima", "Murano", "Pathfinder", "Rogue", "Rogue Sport", "Sentra", "Titan", "Versa", "Z"],
  "Porsche": ["911", "718 Boxster", "718 Cayman", "Cayenne", "Macan", "Panamera", "Taycan"],
  "RAM": ["1500", "2500", "3500", "ProMaster"],
  "Subaru": ["Ascent", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "Solterra", "WRX"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  "Toyota": ["4Runner", "Avalon", "bZ4X", "C-HR", "Camry", "Corolla", "Corolla Cross", "Crown", "GR Supra", "GR86", "Highlander", "Land Cruiser", "Mirai", "Prius", "RAV4", "Sequoia", "Sienna", "Tacoma", "Tundra", "Venza"],
  "Volkswagen": ["Arteon", "Atlas", "Atlas Cross Sport", "Golf", "Golf GTI", "ID.4", "Jetta", "Passat", "Taos", "Tiguan"],
  "Volvo": ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"]
};

export default function HomeS1() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYearFrom, setSelectedYearFrom] = useState<number | "">("");
  const [selectedYearTo, setSelectedYearTo] = useState<number | "">("");

  const [makeSearch, setMakeSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [yearFromSearch, setYearFromSearch] = useState("");
  const [yearToSearch, setYearToSearch] = useState("");

  const [isMakeOpen, setIsMakeOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isYearFromOpen, setIsYearFromOpen] = useState(false);
  const [isYearToOpen, setIsYearToOpen] = useState(false);

  // Get all makes from database
  const allMakes = useMemo(() => Object.keys(CAR_DATABASE).sort(), []);

  // Get models for selected make
  const allModels = useMemo(() => {
    if (!selectedMake) return [];
    return CAR_DATABASE[selectedMake] || [];
  }, [selectedMake]);

  // Filtered makes
  const filteredMakes = useMemo(() => {
    if (!makeSearch) return allMakes;
    const search = makeSearch.toLowerCase();
    return allMakes.filter(make => make.toLowerCase().includes(search));
  }, [allMakes, makeSearch]);

  // Filtered models
  const filteredModels = useMemo(() => {
    if (!modelSearch) return allModels;
    const search = modelSearch.toLowerCase();
    return allModels.filter(model => model.toLowerCase().includes(search));
  }, [allModels, modelSearch]);

  // Generate years array
  const allYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 40 }, (_, i) => currentYear - i);
  }, []);

  const filteredYearsFrom = useMemo(() => {
    if (!yearFromSearch) return allYears;
    return allYears.filter(year => year.toString().includes(yearFromSearch));
  }, [allYears, yearFromSearch]);

  const filteredYearsTo = useMemo(() => {
    if (!yearToSearch) return allYears;
    return allYears.filter(year => year.toString().includes(yearToSearch));
  }, [allYears, yearToSearch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.make-dropdown')) setIsMakeOpen(false);
      if (!target.closest('.model-dropdown')) setIsModelOpen(false);
      if (!target.closest('.year-from-dropdown')) setIsYearFromOpen(false);
      if (!target.closest('.year-to-dropdown')) setIsYearToOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form submit handler
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();

    if (!name || !phone) {
      toast.error("გთხოვთ შეავსოთ სახელი და ტელეფონი!");
      return;
    }

    if (selectedYearFrom && selectedYearTo && selectedYearFrom > selectedYearTo) {
      toast.error("წელი 'დან' არ უნდა იყოს მეტი ვიდრე წელი 'მდე'!");
      return;
    }

    setIsSending(true);

    const yearRange = selectedYearFrom && selectedYearTo 
      ? `${selectedYearFrom}-${selectedYearTo}`
      : selectedYearFrom 
        ? `From ${selectedYearFrom}`
        : selectedYearTo 
          ? `To ${selectedYearTo}`
          : "";

    send(
      "service_2v5rcbm",
      "template_0c7gopa",
      { 
        name, 
        phone, 
        make: selectedMake || "Not specified", 
        model: selectedModel || "Not specified", 
        year: yearRange || "Not specified"
      },
      "zkuga8Pi8HVdc2H_N"
    )
      .then(() => {
        toast.success("თქვენი მესიჯი გაიგზავნა წარმატებით!");
        form.reset();
        setSelectedMake("");
        setSelectedModel("");
        setSelectedYearFrom("");
        setSelectedYearTo("");
        setMakeSearch("");
        setModelSearch("");
        setYearFromSearch("");
        setYearToSearch("");
        setIsMakeOpen(false);
        setIsModelOpen(false);
        setIsYearFromOpen(false);
        setIsYearToOpen(false);
        setIsOpen(false);
      })
      .catch((err) => {
        toast.error("მესიჯი არ გაიგზავნა. ხარვეზი: " + err.text);
      })
      .finally(() => setIsSending(false));
  }, [selectedMake, selectedModel, selectedYearFrom, selectedYearTo]);

  // Dropdown Component
  const CustomDropdown = ({ 
    value, 
    placeholder, 
    options, 
    onSelect,
    search,
    onSearchChange,
    isOpen,
    setIsOpen,
    disabled = false,
    className = ""
  }: {
    value: string;
    placeholder: string;
    options: (string | number)[];
    onSelect: (value: string | number) => void;
    search: string;
    onSearchChange: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    disabled?: boolean;
    className?: string;
  }) => {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-left flex justify-between items-center transition-colors ${
            disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : 
            "bg-white hover:border-gray-400"
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={value ? "text-black" : "text-gray-400 truncate"}>
            {value || placeholder}
          </span>
          <span className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
        
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
            <input
              type="text"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
            />
            
            <div className="overflow-y-auto max-h-48">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-center text-gray-500">
                  {search ? `No ${placeholder.toLowerCase()} found` : `No ${placeholder.toLowerCase()} available`}
                </div>
              ) : (
                options.map((option, index) => (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors text-sm"
                    onClick={() => {
                      onSelect(option);
                      setIsOpen(false);
                      onSearchChange("");
                    }}
                  >
                    {option}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="home" className="relative w-full h-screen">
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      <div className="absolute inset-0 w-full h-full">
        <video
          src="/tiktok.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <Image 
          src="/carlinkfooter.webp" 
          width={300} 
          height={200} 
          alt="Carlink Logo" 
          className="mt-10 relative pointer-events-none" 
        />
        <p className="text-white mt-[-118px] pointer-events-none">ავტომობილების იმპორტი ამერიკიდან და ჩინეთიდან</p>
        <Link href="/auctions">
          <button className="w-60 h-14 rounded-full bg-red-800 text-white mt-4 hover:bg-red-400 hover:w-64 transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            აუქციონები
          </button>
        </Link>
      </div>

      <div className="fixed right-5 bottom-20 z-50">
        <button 
          onClick={() => setIsOpen(true)} 
          className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition duration-300 group" 
          title="Contact us"
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50 animate-ping"></span>
          <img 
            src="/carlinkpng2.png" 
            alt="Contact" 
            className="relative w-20 h-20 rounded-full transition-transform duration-300 hover:scale-125 cursor-pointer" 
          />
        </button>
      </div>

      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className={`bg-white rounded-2xl w-full max-w-md p-6 relative transform transition-all duration-300 ease-out ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
        }`}>
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>

          <h2 className="text-red-900 text-2xl font-bold mb-4 text-center">🚘 მანქანის შერჩევა</h2>
          <p className="mb-6 text-gray-700 text-center">
            დაგვიტოვე საკონტაქტო, ჩვენი პროფესიონალი მენეჯერები მალე დაგიკავშირდებიან.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="სახელი"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
            />
            <input
              type="tel"
              name="phone"
              placeholder="+995 XXX XXX XXX"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
            />

            <div className="grid grid-cols-2 gap-2">
              <div className="make-dropdown">
                <CustomDropdown
                  value={selectedMake}
                  placeholder="Make"
                  options={filteredMakes}
                  onSelect={(value) => {
                    setSelectedMake(value as string);
                    setSelectedModel("");
                    setSelectedYearFrom("");
                    setSelectedYearTo("");
                  }}
                  search={makeSearch}
                  onSearchChange={setMakeSearch}
                  isOpen={isMakeOpen}
                  setIsOpen={setIsMakeOpen}
                />
              </div>
              
              <div className="model-dropdown">
                <CustomDropdown
                  value={selectedModel}
                  placeholder="Model"
                  options={filteredModels}
                  onSelect={(value) => {
                    setSelectedModel(value as string);
                    setSelectedYearFrom("");
                    setSelectedYearTo("");
                  }}
                  search={modelSearch}
                  onSearchChange={setModelSearch}
                  isOpen={isModelOpen}
                  setIsOpen={setIsModelOpen}
                  disabled={!selectedMake}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="year-from-dropdown">
                <CustomDropdown
                  value={selectedYearFrom ? selectedYearFrom.toString() : ""}
                  placeholder="From Year"
                  options={filteredYearsFrom}
                  onSelect={(value) => setSelectedYearFrom(value as number)}
                  search={yearFromSearch}
                  onSearchChange={setYearFromSearch}
                  isOpen={isYearFromOpen}
                  setIsOpen={setIsYearFromOpen}
                  disabled={!selectedModel}
                />
              </div>
              
              <div className="year-to-dropdown">
                <CustomDropdown
                  value={selectedYearTo ? selectedYearTo.toString() : ""}
                  placeholder="To Year"
                  options={filteredYearsTo}
                  onSelect={(value) => setSelectedYearTo(value as number)}
                  search={yearToSearch}
                  onSearchChange={setYearToSearch}
                  isOpen={isYearToOpen}
                  setIsOpen={setIsYearToOpen}
                  disabled={!selectedModel}
                />
              </div>
            </div>

            {(selectedYearFrom || selectedYearTo) && (
              <div className="text-center text-sm text-gray-600">
                Selected year range: 
                <span className="font-semibold ml-1">
                  {selectedYearFrom && selectedYearTo 
                    ? `${selectedYearFrom} - ${selectedYearTo}`
                    : selectedYearFrom 
                      ? `From ${selectedYearFrom}`
                      : `To ${selectedYearTo}`
                  }
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-2xl font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSending}
            >
              {isSending && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              )}
              {isSending ? "Sending..." : "გაგზავნა"}
            </button>
          </form>

          <div className="mt-6 text-black space-y-2">
            <p className="font-bold">რატომ Carlink-ი?</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>მრავალ-წლიანი გამოცდილება</li>
              <li>პროფესიონალი ქარდილერები</li>
              <li>დაზღვეული ტრანსპორტირება</li>
            </ul>
          </div>

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