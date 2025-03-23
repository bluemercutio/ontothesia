"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import NavigationModal from "@/components/NavigationModal";

const NavigationButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  // Only show on these specific routes or library/<number> routes
  const visibleRoutes = ["/", "/project", "/gallery", "/library"];

  // Function to check if the current path should show the navigation button
  const shouldShowButton = () => {
    if (!pathname) return false;

    // Check for exact matches
    if (visibleRoutes.includes(pathname)) return true;

    // Check for library/<number> pattern
    if (
      pathname.startsWith("/library/") &&
      /^\/library\/[^\/]+$/.test(pathname)
    )
      return true;
    // check for the gallery/<uuid> pattern, allowing query parameters
    if (
      pathname.startsWith("/gallery/") &&
      /^\/gallery\/[^\/]+$/.test(pathname)
    )
      return true;

    return false;
  };

  if (!pathname) {
    throw new Error("Pathname is null");
  }

  if (!shouldShowButton()) {
    return null;
  }

  return (
    <div className="">
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-primary text-primary-foreground rounded-sm p-3 shadow-lg hover:bg-primary/90 transition-colors border bg-black "
        aria-label="Navigation help"
      >
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>Navigation Guide</span>
        </div>
      </button>

      <NavigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default NavigationButton;
