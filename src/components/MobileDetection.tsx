"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

type MobileDetectionProps = {
  children: ReactNode;
  navbar: ReactNode;
  navigationButton: ReactNode;
};

export function MobileDetection({
  children,
  navbar,
  navigationButton,
}: MobileDetectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Redirect to home if on mobile and not already there
      if (mobile && pathname !== "/" && pathname !== "") {
        router.push("/");
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [pathname, router]);

  return (
    <>
      {!isMobile && navbar}
      {children}
      {!isMobile && navigationButton}
    </>
  );
}
