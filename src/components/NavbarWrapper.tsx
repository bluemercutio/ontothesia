"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = useMemo(() => {
    const path = pathname?.split("/")[1] || "home";
    return path;
  }, [pathname]);

  const handleSetActiveTab = (tab: string) => {
    const path = tab === "home" ? "/" : `/${tab}`;
    router.push(path);
  };

  return <Navbar activeTab={activeTab} onTabChange={handleSetActiveTab} />;
}
