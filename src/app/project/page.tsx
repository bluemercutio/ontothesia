"use client";

import React from "react";
import Header from "@/components/Header";
import TextBox from "@/components/TextBox";
import { projectInfo } from "./copyWrite";

export default function Project() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Project" />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center bg-var(--primary-bg)">
        {projectInfo.map((info) => (
          <TextBox
            key={info.title}
            title={info.title}
            content={info.paragraph}
          />
        ))}
      </main>
    </div>
  );
}
