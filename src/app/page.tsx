"use client";

// import { IntroTitle } from "../components/IntroTitle";
import { IntroTitleAdvanced } from "../components/IntroTitleAdvanced";
import { useEffect, useState } from "react";

export default function Home() {
  const [showMobileMessage, setShowMobileMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Show message after 4 seconds
    const timer = setTimeout(() => {
      setShowMobileMessage(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <IntroTitleAdvanced />

        {isMobile && (
          <div
            className={`text-center text-sm mt-8 max-w-xs px-4 transition-opacity duration-1000 ease-in-out ${
              showMobileMessage ? "opacity-100" : "opacity-0"
            }`}
          >
            This experience is optimized for desktop viewing. Mobile support is
            coming soon.
          </div>
        )}
      </main>
    </div>
  );
}
