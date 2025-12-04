// "use client";

// import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";

// // Lazy load BackgroundBeams, only when visible
// const BackgroundBeams = dynamic(
//   () => import("@/components/ui/background-beams").then(mod => mod.BackgroundBeams),
//   { ssr: false, loading: () => null }
// );

// export default function ClientWrapper({ children }: { children: React.ReactNode }) {
//   const [showBeams, setShowBeams] = useState(false);

//   useEffect(() => {
//     // Lazy-load beams after first render
//     const timer = setTimeout(() => setShowBeams(true), 500); // shorter delay
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       {children}
//       {showBeams && <BackgroundBeams />}
//     </>
//   );
// }
