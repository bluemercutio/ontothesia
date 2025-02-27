"use client";

import React from "react";
import NavbarWrapper from "@/components/NavbarWrapper";

export default function Cinema() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <NavbarWrapper />
      <h1 className="text-4xl font-bold mb-4">Cinema</h1>
      <p className="text-gray-500">Coming Soon</p>
    </div>
  );
}
