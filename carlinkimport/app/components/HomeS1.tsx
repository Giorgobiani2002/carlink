"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { send } from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Define types
interface CarOption {
  value: string | number;
  label: string;
}

interface MakeResult {
  Make_Name: string;
}

interface ModelResult {
  Model_Name: string;
}

interface ApiResponse {
  Results: ModelResult[];
}

export default function HomeS1() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Car selection states
  const [makes, setMakes] = useState<CarOption[]>([]);
  const [models, setModels] = useState<CarOption[]>([]);
  const [years, setYears] = useState<CarOption[]>([]);

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYearFrom, setSelectedYearFrom] = useState<number | "">("");
  const [selectedYearTo, setSelectedYearTo] = useState<number | "">("");

  // Search states
  const [makeSearch, setMakeSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [yearFromSearch, setYearFromSearch] = useState("");
  const [yearToSearch, setYearToSearch] = useState("");

  // Dropdown open states
  const [isMakeOpen, setIsMakeOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isYearFromOpen, setIsYearFromOpen] = useState(false);
  const [isYearToOpen, setIsYearToOpen] = useState(false);

  // Loading states
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Fetch popular makes initially
  useEffect(() => {
    // Start with popular makes for instant display
    const popularMakes: CarOption[] = [
      "Toyota", "Honda", "Ford", "Chevrolet", "BMW", 
      "Mercedes-Benz", "Audi", "Nissan", "Hyundai", "Kia",
      "Volkswagen", "Tesla", "Lexus", "Jeep", "Subaru",
      "Mazda", "Volvo", "Porsche", "Land Rover", "Jaguar",
      "Cadillac", "GMC", "Buick", "Chrysler", "Dodge",
      "RAM", "Lincoln", "Acura", "Infiniti", "Mini",
      "Mitsubishi", "Fiat", "Alfa Romeo", "Genesis", "Smart"
    ].map(make => ({ value: make, label: make }));
    
    setMakes(popularMakes);
    
    // Fetch all makes in background
    setLoadingMakes(true);
    fetch("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json")
      .then(res => res.json())
      .then(data => {
        // Combine popular with all makes, remove duplicates
        const allMakes = data.Results.map((item: MakeResult) => item.Make_Name);
        const uniqueMakes = [...new Set([...popularMakes.map(m => m.value as string), ...allMakes])];
        const sortedMakes = uniqueMakes.sort((a: string, b: string) => a.localeCompare(b));
        setMakes(sortedMakes.map(make => ({ value: make, label: make })));
      })
      .catch(err => console.log("Error fetching makes:", err))
      .finally(() => setLoadingMakes(false));
  }, []);

  // Filter makes based on search
  const filteredMakes = makes.filter(make => 
    make.label.toLowerCase().includes(makeSearch.toLowerCase())
  ).slice(0, 100); // Limit to 100 for performance

  // Filter models based on search
  const filteredModels = models.filter(model => 
    model.label.toLowerCase().includes(modelSearch.toLowerCase())
  ).slice(0, 100);

  // Generate years when model changes
  useEffect(() => {
    if (!selectedMake || !selectedModel) {
      setYears([]);
      setSelectedYearFrom("");
      setSelectedYearTo("");
      setYearFromSearch("");
      setYearToSearch("");
      return;
    }
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from({ length: 40 }, (_, i) => currentYear - i); // Last 40 years
    setYears(yearsArray.map(year => ({ value: year, label: year.toString() })));
    setYearFromSearch("");
    setYearToSearch("");
  }, [selectedMake, selectedModel]);

  // Filter years based on search
  const filteredYears = years.filter(year => 
    year.label.includes(yearFromSearch) || year.label.includes(yearToSearch)
  );

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();

    if (!name || !phone) {
      toast.error("გთხოვთ შეავსოთ სახელი და ტელეფონი!");
      return;
    }

    // Validate year range
    if (selectedYearFrom && selectedYearTo && selectedYearFrom > selectedYearTo) {
      toast.error("წელი 'დან' არ უნდა იყოს მეტი ვიდრე წელი 'მდე'!");
      return;
    }

    setIsSending(true);

    // Create year range string
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
        make: selectedMake, 
        model: selectedModel, 
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
  };

  // Fetch models when make changes
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      setSelectedModel("");
      return;
    }
    
    setLoadingModels(true);
    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${selectedMake}?format=json`)
      .then(res => res.json())
      .then((data: ApiResponse) => {
        if (data.Results && data.Results.length > 0) {
          const modelNames = data.Results.map((item: ModelResult) => item.Model_Name);
          const uniqueModels = [...new Set(modelNames)];
          const sortedModels = uniqueModels.sort((a: string, b: string) => a.localeCompare(b));
          setModels(sortedModels.map(model => ({ value: model, label: model })));
        } else {
          setModels([]);
        }
        setSelectedModel("");
        setModelSearch("");
      })
      .catch(err => {
        console.log("Error fetching models:", err);
        toast.error("Failed to load models");
      })
      .finally(() => setLoadingModels(false));
  }, [selectedMake]);

  // Custom Dropdown Component
  const CustomDropdown = ({ 
    value, 
    placeholder, 
    options, 
    onSelect,
    search,
    onSearchChange,
    isOpen,
    setIsOpen,
    loading = false,
    disabled = false,
    className = ""
  }: {
    value: string;
    placeholder: string;
    options: CarOption[];
    onSelect: (value: string | number) => void;
    search: string;
    onSearchChange: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    loading?: boolean;
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
          <span className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}>
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
              {loading ? (
                <div className="px-3 py-2 text-center text-gray-500">
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              ) : options.length === 0 ? (
                <div className="px-3 py-2 text-center text-gray-500">No {placeholder.toLowerCase()} found</div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      onSelect(option.value);
                      setIsOpen(false);
                      onSearchChange("");
                    }}
                  >
                    {option.label}
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

      {/* Background */}
      <Image 
        src="/lambo.png" 
        alt="Car Thumbnail" 
        fill 
        priority 
        className={`object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-0" : "opacity-100"}`} 
      />
      <video
        src="/lambo.mp4"
        autoPlay 
        loop 
        muted 
        playsInline 
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
        className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
      />

      {/* Text Overlay */}
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
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className={`bg-white rounded-2xl w-full max-w-md p-6 relative transform transition-all duration-300 ease-out ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
        }`}>
          {/* Close */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>

          {/* Modal Content */}
          <h2 className="text-red-900 text-2xl font-bold mb-4 text-center">🚘 მანქანის შერჩევა</h2>
          <p className="mb-6 text-gray-700 text-center">
            მე დაგეხმარები შენთვის სასურველი მანქანის შერჩევასა და ჩამოყვანაში. შეავსე ფორმა და ძალიან მალე დაგიკავშირდები
          </p>

          {/* Form */}
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

            {/* Make and Model Dropdowns */}
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
                    setModelSearch("");
                    setYearFromSearch("");
                    setYearToSearch("");
                    setIsModelOpen(false);
                    setIsYearFromOpen(false);
                    setIsYearToOpen(false);
                  }}
                  search={makeSearch}
                  onSearchChange={setMakeSearch}
                  isOpen={isMakeOpen}
                  setIsOpen={setIsMakeOpen}
                  loading={loadingMakes}
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
                    setYearFromSearch("");
                    setYearToSearch("");
                    setIsYearFromOpen(false);
                    setIsYearToOpen(false);
                  }}
                  search={modelSearch}
                  onSearchChange={setModelSearch}
                  isOpen={isModelOpen}
                  setIsOpen={setIsModelOpen}
                  loading={loadingModels}
                  disabled={!selectedMake}
                />
              </div>
            </div>

            {/* Year Range Dropdowns */}
            <div className="grid grid-cols-2 gap-2">
              <div className="year-from-dropdown">
                <CustomDropdown
                  value={selectedYearFrom ? selectedYearFrom.toString() : ""}
                  placeholder="From Year"
                  options={years}
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
                  options={years}
                  onSelect={(value) => setSelectedYearTo(value as number)}
                  search={yearToSearch}
                  onSearchChange={setYearToSearch}
                  isOpen={isYearToOpen}
                  setIsOpen={setIsYearToOpen}
                  disabled={!selectedModel}
                />
              </div>
            </div>

            {/* Show selected year range */}
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

          {/* Optional Info */}
          <div className="mt-6 text-black space-y-2">
            <p className="font-bold">რატომ Carlink-ი?</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
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