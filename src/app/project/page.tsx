"use client";

import React from "react";

import TextBox from "@/components/TextBox";
import { projectInfo } from "./copyWrite";

export default function Project() {
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-1 container mx-auto flex flex-col items-center bg-[var(--background)] border-white border-[0.5px] w-1/2 pb-32">
        <section className="w-full text-center">
          <h1 className="text-4xl bg-black text-white mx-auto flex items-center justify-center h-64">
            ONTOTHESIA
          </h1>
          <div className="relative">
            <div className="flex justify-center items-center text-xl text-white-300 pb-2 pt-8 bg-[var(--primary-bg)]">
              <div className="w-1/2 text-center">
                <i>Ontology</i>
              </div>
              <div className="w-8 text-center opacity-0">
                <span>+</span>
              </div>
              <div className="w-1/2 text-center">
                <i>Synesthesia</i>
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row mb-0 justify-center">
              <div className="w-full pt-6 pb-8 bg-[var(--primary-bg)] text-white flex">
                <p
                  className="text-white-300 text-justify px-16"
                  style={{ textAlignLast: "center" }}
                >
                  The philosophical study of the nature of being, existence, and
                  reality. It explores fundamental questions about what exists
                  and how entities are organized and related to one another.
                </p>
              </div>
              <div className="w-full pt-6 pb-8 bg-[var(--primary-bg)] text-white flex">
                <p
                  className="text-black-300 text-justify px-16"
                  style={{ textAlignLast: "center" }}
                >
                  A perceptual phenomenon where stimulation of one sensory or
                  cognitive pathway leads to involuntary experiences in another
                  sensory or cognitive pathway.
                </p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--primary-bg)] rounded-full w-12 h-12 flex items-center justify-center text-xl z-10">
              <span>+</span>
            </div>
          </div>
        </section>

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
