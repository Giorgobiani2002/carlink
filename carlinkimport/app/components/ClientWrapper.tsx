"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy load BackgroundBeams - loads after content is visible
const BackgroundBeams = dynamic(
  () => import("@/components/ui/background-beams").then(mod => mod.BackgroundBeams),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showBeams, setShowBeams] = useState(false);

  useEffect(() => {
    // Show content fast
    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 200);
      
      const handleLoad = () => {
        clearTimeout(timer);
        setIsLoading(false);
      };
      
      window.addEventListener('load', handleLoad);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  useEffect(() => {
    // Load BackgroundBeams after content is visible
    if (!isLoading) {
      const beamsTimer = setTimeout(() => setShowBeams(true), 800);
      return () => clearTimeout(beamsTimer);
    }
  }, [isLoading]);

  return (
    <>
      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
        {showBeams && <BackgroundBeams />}
      </div>
    </>
  );
}