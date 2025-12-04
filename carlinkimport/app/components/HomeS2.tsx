"use client";
import React, { useEffect, useState } from "react";
import arcsData from "../data/arcs.json";
import { globeConfig } from "../config/globeConfig";
import dynamic from "next/dynamic";

export default function HomeS2() {
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowGlobe(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const el = document.getElementById("globe-container");
    if (el) observer.observe(el);
  }, []);

  const World = dynamic(
    () => import("../components/ui/globe").then((m) => m.World),
    { ssr: false }
  );

  return (
    <div className="h-[630px] bg-[#1F1F1F] flex py-10 font-sans">
      <div className="max-w-[1220px] w-full m-auto items-center md:flex md:flex-row flex-col md:justify-between gap-10">
        
        {/* TEXT SECTION */}
        <div className="flex flex-col h-[400px] max-w-[550px] justify-between m-auto px-4 md:px-0">
          <h2 className="text-[35px] text-white leading-9">
            <span className="text-green-900 leading-9">
              შეიძინე ავტომობილი
            </span>{" "}
            საუკეთესო პირობებით
          </h2>

          <p className="text-white text-[18px]">
            სანდო პარტნიორები და პროფესიონალი გუნდი – სწორედ ეს ქმნის იმ
            სტაბილურობას, რომელსაც ჩვენი კლიენტები აფასებენ...
          </p>

          <button className="max-w-[177px] w-full h-[57px] rounded-4xl bg-green-900 text-white mt-4">
            მოგვწერე
          </button>
        </div>

        {/* GLOBE SECTION */}
        <div id="globe-container" className="w-full h-[500px]">
          {showGlobe && <World globeConfig={globeConfig} data={arcsData} />}
        </div>
      </div>
    </div>
  );
}
