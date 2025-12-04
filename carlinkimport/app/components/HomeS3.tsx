"use client";

import React from "react";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

export default function HomeS3() {
  return (
    <div className="bg-[#1F1F1F] py-12 px-4 md:px-6 pt-[300px] md:pt-0">
      
      <div className="w-24 h-1 bg-green-900 mx-auto mb-6 md:mb-8 rounded-full"></div>
      
      <h2 className="text-center text-white text-[28px] md:text-[35px] leading-snug md:leading-10 mb-10 md:mb-16">
        <span className="text-green-900 font-extrabold">ჩვენი სერვისები</span>{" "}
        და სარგებელი
      </h2>

      <div className="max-w-[1220px] w-full m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10">
        
        {/* Card 1 */}
        <div className="flex justify-center">
          <CardContainer className="inter-var cursor-pointer w-full">
            <CardBody className="relative group/card dark:bg-black rounded-xl p-6">
              <CardItem translateZ="50" className="text-xl font-bold text-white mb-2">
                უსაფრთხო ტრანსპორტირება
              </CardItem>

              <CardItem translateZ="100" rotateX={20} rotateZ={-10} className="w-full mt-4">
                <Image
                  src="/1.jpg"
                  alt="Safe Transportation"
                  width={500}
                  height={400}
                  className="w-full h-60 object-cover rounded-xl"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        {/* Card 2 */}
        <div className="flex justify-center">
          <CardContainer className="inter-var cursor-pointer w-full">
            <CardBody className="relative group/card dark:bg-black rounded-xl p-6">
              <CardItem translateZ="50" className="text-xl font-bold text-white mb-2">
                მარტივი ლოგისტიკა
              </CardItem>

              <CardItem translateZ="100" rotateX={20} rotateZ={-10} className="w-full mt-4">
                <Image
                  src="/logistic.webp"
                  alt="Easy Logistics"
                  width={500}
                  height={400}
                  className="w-full h-60 object-cover rounded-xl"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        {/* Card 3 */}
        <div className="flex justify-center">
          <CardContainer className="inter-var cursor-pointer w-full">
            <CardBody className="relative group/card dark:bg-black rounded-xl p-6">
              <CardItem translateZ="50" className="text-xl font-bold text-white mb-2">
                დაზღვევა აუქციონის ფოტოებით
              </CardItem>

              <CardItem translateZ="100" rotateX={20} rotateZ={-10} className="w-full mt-4">
                <Image
                  src="/logistic2.webp"
                  alt="Insurance"
                  width={500}
                  height={400}
                  className="w-full h-60 object-cover rounded-xl"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

      </div>
    </div>
  );
}
