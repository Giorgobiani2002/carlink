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
    <div id="aboutus" className="h-[630px] bg-[#1F1F1F] py-10 font-sans">
      <div className="w-24 h-1 bg-red-800 mx-auto mb-6 md:mb-8 rounded-full"></div>

      <h2 className="text-center text-white text-[28px] md:text-[35px] leading-snug md:leading-10 mb-10 md:mb-16">
        <span className="text-red-800 font-extrabold">ჩვენს</span> შესახებ
      </h2>

      <div className="max-w-[1220px] w-full m-auto items-center md:flex md:flex-row flex-col md:justify-between gap-10">
        {/* TEXT SECTION */}

        <div className="flex flex-col h-[350px] max-w-[550px] justify-between m-auto pl-4 pr-4 md:px-0 gap-2.5">
          <h2 className="text-[35px] text-white leading-9">
            <span className="text-red-800 leading-9">შეიძინე ავტომობილი</span>{" "}
            საუკეთესო პირობებით
          </h2>

          <p className="text-white text-[18px]">
            ქარლინკ აუტო იმპორტი და მისი გუნდი 2019 წლიდან აქტიურად ოპერირებს და
            უზრუნველყოფს, ავტომობილების, მოტოციკლეტების, სპეც-ტქენიკის შეძენასა
            და ტრანსპორტირებას როგორც ამერიკის ასევე კანადის და ჩინეთის
            მიმართულებიდან.
          </p>

          <a
            href="tel:+995544440506"
            className="max-w-[200px] h-10 bg-red-800 text-white rounded-full text-center py-2  
                hover:bg-red-400 hover:w-64 
                transform transition-all duration-300 ease-out 
                hover:-translate-y-2 hover:shadow-xl
                cursor-pointer"
          >
            მოგვწერე
          </a>
        </div>

        {/* GLOBE SECTION */}
        <div
          id="globe-container"
          className="md:w-full md:h-[500px] w-[350px] mt-[41px] md:mt-0 h-[400px] m-auto"
        >
          {showGlobe && <World globeConfig={globeConfig} data={arcsData} />}
        </div>
      </div>
    </div>
  );
}
