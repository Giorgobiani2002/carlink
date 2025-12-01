"use client"
import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
// Removed unused globe imports and the motion import
// import { div } from "motion/react-client";
// import arcsData from '../data/arcs.json';
// import { globeConfig } from "../config/globeConfig";
// import dynamic from "next/dynamic";

export default function HomeS3() {
  return (
    // Added responsive vertical and horizontal padding (py-12 px-4)
    <div className="bg-[#1F1F1F] py-12 px-4 md:px-6 pt-[300px] md:pt-[0px]">
      
      {/* Title Section */}
      <div className="w-24 h-1 bg-green-900 mx-auto mb-6 md:mb-8 rounded-full"></div>
      
      {/* Title: Adjusted text size for responsiveness */}
      <h2 className="text-center text-white text-[28px] md:text-[35px] leading-snug md:leading-10 mb-10 md:mb-16">
        <span className="text-green-900 font-extrabold">ჩვენი სერვისები</span>{" "}
        და სარგებელი
      </h2>
      
      {/* Key Change: Responsive Grid Layout and Gap Adjustment */}
      {/* Stacks on mobile (1 column), 2 columns on medium screens, 3 columns on large screens. 
          Uses gap-5 (20px) on mobile and gap-10 (40px) on desktop. */}
      <div className="max-w-[1220px] w-full m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10">
        
        {/* Card 1: უსაფრთხო ტრანსპორტირება (Safe Transportation) */}
        <div className="flex justify-center">
          <CardContainer className="inter-var cursor-pointer w-full">
            {/* w-full ensures card uses full column width, removed fixed sm:w-[25rem] */}
            <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black w-full h-auto rounded-xl p-6">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-white dark:text-white mb-2"
              >
                უსაფრთხო ტრანსპორტირება
              </CardItem>
              <CardItem
                translateZ="100"
                rotateX={20}
                rotateZ={-10}
                className="w-full mt-4"
              >
                <img
                  src="./1.jpg"
                  height="1000"
                  width="1000"
                  className="w-full h-60 object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="Safe Transportation thumbnail"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        {/* Card 2: მარტივი ლოგისტიკა (Easy Logistics) */}
        <div className="flex justify-center">
          <CardContainer className="inter-var cursor-pointer w-full">
            <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black w-full h-auto rounded-xl p-6">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-white dark:text-white mb-2"
              >
                მარტივი ლოგისტიკა
              </CardItem>
              <CardItem
                translateZ="100"
                rotateX={20}
                rotateZ={-10}
                className="w-full mt-4"
              >
                <img
                  src="./logistic.webp"
                  height="1000"
                  width="1000"
                  className="w-full h-60 object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="Easy Logistics thumbnail"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
        
        {/* Card 3: დაზღვევა აუქციონის ფოტოებით (Insurance with Auction Photos) */}
        <div className="flex justify-center">
          <CardContainer className="inter-var cursor-pointer w-full">
            <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black w-full h-auto rounded-xl p-6">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-white dark:text-white mb-2"
              >
                დაზღვევა აუქციონის ფოტოებით
              </CardItem>
              <CardItem
                translateZ="100"
                rotateX={20}
                rotateZ={-10}
                className="w-full mt-4"
              >
                <img
                  src="./logistic2.webp"
                  height="1000"
                  width="1000"
                  className="w-full h-60 object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="Insurance thumbnail"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </div>
  );
}