"use client";

import React from "react";

import TextBox from "@/components/TextBox";
import { projectInfo } from "./copyWrite";

export default function Project() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto flex flex-col items-center bg-[var(--background)] border border-white-500 w-1/2">
        <section className="w-full text-center">
          <h1 className="text-4xl bg-black text-white mx-auto flex items-center justify-center h-32">
            ONTOTHESIA
          </h1>
          <div className="flex justify-center items-center text-xl text-white-300 py-16">
            <div className="w-1/2 text-center">
              <i>Ontology</i>
            </div>
            <div className="w-8 text-center">
              <span>+</span>
            </div>
            <div className="w-1/2 text-center">
              <i>Synesthesia</i>
            </div>
          </div>
        </section>
        <div className="w-full flex flex-col md:flex-row mb-0  justify-center">
          <div className="w-full  py-6 bg-black text-white  flex justify-center items-center">
            <p className="text-white-300 text-center px-4 ">
              The philosophical study of the nature of being, existence, and
              reality. It explores fundamental questions about what exists and
              how entities are organized and related to one another.
            </p>
          </div>
          <div className="w-full  py-6 bg-white text-black  flex justify-center items-center">
            <p className="text-black-300 text-center px-4 ">
              A perceptual phenomenon where stimulation of one sensory or
              cognitive pathway leads to involuntary experiences in another
              sensory or cognitive pathway.
            </p>
          </div>
        </div>

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
