"use client";

import React from "react";

// import Button from "@/components/Button";
// import ExperienceForm from "@/components/ExperienceForm";
import Header from "@/components/Header";
export default function Cinema() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Cinema" />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center justify-center h-full top-1/2 left-1/2">
            coming soon...
          </div>
        </div>
        {/* <ExperienceForm />
        <Button label="Create Experience" onClick={() => {}} /> */}
      </main>
    </div>
  );
}
