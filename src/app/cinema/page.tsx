"use client";

import React from "react";

import Button from "@/components/Button";
import ExperienceForm from "@/components/ExperienceForm";
import Header from "@/components/Header";
export default function Cinema() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Cinema" />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ExperienceForm />
        <Button label="Create Experience" onClick={() => {}} />
      </main>
    </div>
  );
}
