"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import NavbarWrapper from "@/components/NavbarWrapper";
import { Artefact as ArtefactType } from "../../types/artefact";
import Artefact from "@/components/Artefact";

export default function Library() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [artefacts, setArtefacts] = useState<ArtefactType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtefacts = async () => {
      try {
        const response = await fetch("/api/artefacts");
        const data = await response.json();
        setArtefacts(data);
      } catch (error) {
        console.error("Failed to fetch artefacts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtefacts();
  }, []);

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
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--card-bg)]"
          />
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <p className="text-center text-gray-500 mt-8">Loading artefacts...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtefacts.map((artefact) => (
              <div
                key={artefact.id}
                onClick={() => router.push(`/library/${artefact.id}`)}
              >
                <Card
                  key={artefact.id}
                  title={artefact.title}
                  description={undefined}
                  width="w-full"
                  height="h-96"
                  component={<Artefact {...artefact} />}
                />
              </div>
            ))}
          </div>
        )}

        {filteredArtefacts.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 mt-8">
            No artefacts found matching your search.
          </p>
        )}
      </div>
      <NavbarWrapper />
    </div>
  );
}
