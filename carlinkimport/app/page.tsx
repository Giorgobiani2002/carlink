import Image from "next/image";
import HomeS1 from "./components/HomeS1";
import HomeS2 from "./components/HomeS2";
import HomeS3 from "./components/HomeS3";
import HomeS4 from "./components/HomeS4";

export default function Home() {
  return (
    <div>
      <HomeS1 />
      <HomeS2 />
      <HomeS3 />
      <HomeS4 />
    </div>
  );
}
