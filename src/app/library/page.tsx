"use client";

import React, { useState } from "react";
import Card from "@/components/Card";
import NavbarWrapper from "@/components/NavbarWrapper";
import { Artefact } from "../types/artefact";

// Temporary data - replace with actual data fetching
const artefacts: Artefact[] = [
  {
    id: "1",
    title: "Ancient Vase",
    region: "Greece",
    approx_date: "500 BCE",
    text: "A beautiful ceramic vase from ancient Greece",
    citation: "Athens Museum Collection",
  },
  {
    id: "2",
    title: "Medieval Manuscript",
    region: "France",
    approx_date: "1200 CE",
    text: "An illuminated manuscript from medieval France",
    citation: "National Library of France",
  },
];

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArtefacts = artefacts.filter((artefact) =>
    Object.values(artefact).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Library</h1>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search artefacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtefacts.map((artefact) => (
            <Card
              key={artefact.id}
              title={artefact.title}
              description={`${artefact.region} - ${artefact.approx_date}\n${artefact.text}`}
              width="w-full"
              height="h-96"
            />
          ))}
        </div>

        {filteredArtefacts.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No artefacts found matching your search.
          </p>
        )}
      </div>
      <NavbarWrapper />
    </div>
  );
}
