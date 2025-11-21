"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Import required modules
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

export default function HomeS2() {
  return (
    <div className="h-[630px] bg-[#1F1F1F] flex py-10 font-sans">
      <div className="max-w-[1220px] w-full m-auto items-center flex justify-between font-sans gap-2.5">
        <div className="flex h-[400px] max-w-[550px] justify-between flex-col ">
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

        <div className=" flex justify-center items-center">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={true} // <- important for autoplay
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000, // 3 seconds
              disableOnInteraction: false,
            }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="max-w-[650px] w-full h-[450px]"
          >
            {["slide11.png", "slide22.png", "slide3.jpg", "slide4.jpg"].map(
              (src, idx) => (
                <SwiperSlide
                  key={idx}
                  className="w-[600px] h-[380px] rounded-2xl"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover rounded-2xl"
                    alt={`Slide ${idx + 1}`}
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
