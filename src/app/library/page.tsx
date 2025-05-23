"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { useGetArtefactsQuery } from "@/store/api";
import PageInstruction from "@/components/PageInstruction";
import Artefact from "@/components/Artefact";
import { LoadingState } from "@/components/LoadingSpinner";

export default function Library() {
  const router = useRouter();

  const { data: artefacts, isLoading, error } = useGetArtefactsQuery();

  if (isLoading) return <LoadingState />;
  if (error) return <div>Error loading artefacts</div>;
  if (!artefacts) return <div>No artefacts found</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header title="Library" /> */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <PageInstruction text="Select an Artefact to view" />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artefacts.map((artefact) => (
            <div
              key={artefact.id}
              onClick={() => router.push(`/library/${artefact.id}`)}
              className="cursor-pointer"
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

        {artefacts.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 mt-8">No artefacts found.</p>
        )}
      </main>
    </div>
  );
}
