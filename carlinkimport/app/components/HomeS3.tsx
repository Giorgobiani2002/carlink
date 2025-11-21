import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { div } from "motion/react-client";

export default function HomeS3() {
  return (
    <div className="bg-[#1F1F1F]">
      <div className="w-24 h-1 bg-green-900 mx-auto mb-10 rounded-full"></div>
      <h2 className="text-center text-white text-[35px] leading-2.5">
        <span className="text-green-900 font-extrabold">ჩვენი სერვისები</span>{" "}
        და სარგებელი
      </h2>
      <div className="max-w-[1220px] w-full m-auto grid grid-cols-3">
        <div>
          <CardContainer className="inter-var cursor-pointer">
            <CardBody className=" relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black   w-auto sm:w-[25rem] h-auto rounded-xl p-6   ">
              <CardItem
                translateZ="50"
                className="text-[18px] font-bold  text-white dark:text-white"
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
                  src="./container.jpg"
                  height="1000"
                  width="1000"
                  className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
        <div>
          <CardContainer className="inter-var cursor-pointer">
            <CardBody className=" relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black   w-auto sm:w-[25rem] h-auto rounded-xl p-6   ">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-white dark:text-white"
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
                  src="./logistic.jpg"
                  height="1000"
                  width="1000"
                  className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
        <div>
          <CardContainer className="inter-var cursor-pointer">
            <CardBody className=" relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black   w-auto sm:w-[25rem] h-auto rounded-xl p-6   ">
              <CardItem
                translateZ="50"
                className="text-xl font-bold  text-white dark:text-white"
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
                  src="./logistic2.jpg"
                  height="1000"
                  width="1000"
                  className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </div>
  );
}
