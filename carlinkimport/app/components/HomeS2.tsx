"use client";
import React from "react";
import arcsData from '../data/arcs.json';
import { globeConfig } from "../config/globeConfig";
import dynamic from "next/dynamic";
const World = dynamic(
  () => import("../components/ui/globe").then(mod => mod.World),
  { ssr: false }
);

export default function HomeS2() {
  return (
    <div className="h-[630px] bg-[#1F1F1F] flex py-10 font-sans">
      <div className="max-w-[1220px] w-full m-auto items-center md:flex md:flex-row flex-col md:justify-between gap-10">
        
        {/* Text Section */}
        <div className="flex flex-col h-[400px] max-w-[550px] justify-between m-auto px-4 md:px-0">
  <div>
    <h2 className="text-[35px] text-white leading-9">
      <span className="text-green-900 leading-9">
        შეიძინე ავტომობილი
      </span>{" "}
      საუკეთესო პირობებით
    </h2>
  </div>
  <p className="text-white text-[18px]">
    სანდო პარტნიორები და პროფესიონალი გუნდი – სწორედ ეს ქმნის იმ
    სტაბილურობას, რომელსაც ჩვენი კლიენტები აფასებენ. ჩვენთან ყოველი
    ნაბიჯი დაგეგმილია : დაწყებული ავტომობილის შერჩევით, დასრულებული მის
    საბაჟოზე გატარებასა და ტრანსპორტირებით საქართველოში ყველა საბუთის
    მოწესრიგებით ამერიკასა თუ საქართველოში.
  </p>
  <button className="max-w-[177px] w-full h-[57px] rounded-4xl bg-green-900 text-white mt-4">
    მოგვწერე
  </button>
</div>

        {/* Globe Section */}
        <div className="w-full h-[500px]">
          <World globeConfig={globeConfig} data={arcsData} />
        </div>
      </div>
    </div>
  );
}
