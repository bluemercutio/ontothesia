"use client";

import React from "react";
import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import NavbarWrapper from "@/components/NavbarWrapper";
import { Experience } from "../types/experience";

const experiences: Experience[] = [
  {
    id: "1",
    title: "Experience 1",
    description: "Description for experience 1",
    scenes: ["1", "2", "3"],
    image_url: "https://via.placeholder.com/150",
  },
];

export default function Gallery() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center min-h-screen">
          <h1 className="text-4xl font-bold text-center mb-8">Gallery</h1>
          <Carousel>
            {experiences.map((item, index) => (
              <Card
                key={index}
                title={item.title}
                description={item.description}
                imageUrl={item.image_url}
                width="w-1/2"
              />
            ))}
          </Carousel>
        </div>

        <div className="min-h-screen pt-24">
          <h2 className="text-3xl font-bold text-center mb-8">
            Ontothesia Catalogue
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {experiences.map((item, index) => (
              <Card
                key={`flex-${index}`}
                title={item.title}
                description={item.description}
                imageUrl={item.image_url}
                width="w-[calc(1/4-1rem)]"
                height="h-[calc(1/4-1rem)]"
              />
            ))}
          </div>
        </div>

        <NavbarWrapper />
      </div>
    </div>
  );
}
