"use client";

import { useState } from "react";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const [activeTab, setActiveTab] = useState("home");

  const handleSetActiveTab = (tab: string) => {
    switch (tab) {
      case "home":
        window.location.href = "/";
        break;
      case "gallery":
        window.location.href = "/gallery";
        break;
      case "cinema":
        window.location.href = "/cinema";
        break;
      case "project":
        window.location.href = "/project";
        break;
      case "library":
        window.location.href = "/library";
        break;
      default:
        window.location.href = "/";
        break;
    }
    setActiveTab(tab);
  };

  return <Navbar activeTab={activeTab} onTabChange={handleSetActiveTab} />;
}
