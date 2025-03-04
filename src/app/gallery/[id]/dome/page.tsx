"use client";

import React from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { useGetExperiencesQuery, useGetGenerationsQuery } from "@/store/api";
import { useParams } from "next/navigation";
import DomeScene from "@/components/Dome";
import { useGetScenesQuery } from "@/store/api";
import path from "path";
import { Generation } from "@/types/generation";
export default function ExperiencePage() {
  const params = useParams();
  const { data: experiences, isLoading, error } = useGetExperiencesQuery();
  const allScenes = useGetScenesQuery();
  const allGenerations = useGetGenerationsQuery();

  if (!allGenerations.data || allGenerations.isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Loading..." />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse space-y-8 w-full max-w-2xl">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  let processedGenerations: Generation[] = [];
  if (!process.env.NEXT_PUBLIC_GENERATIONS_DIR) {
    throw new Error("NEXT_PUBLIC_GENERATIONS_DIR is not set");
  } else {
    processedGenerations = allGenerations.data.map((generation) => ({
      ...generation,
      image_url: path.join(
        process.env.NEXT_PUBLIC_GENERATIONS_DIR || "",
        generation.image_url
      ),
    }));
  }

  console.log("All scenes", allScenes.data);
  console.log("All generations", processedGenerations);

  if (!allScenes.data) {
    return <div>No scenes or experiences found</div>;
  }

  if (!experiences) {
    return <div>No experiences found</div>;
  }

  const scenes = allScenes.data?.filter((scene) => {
    return experiences.some((experience) =>
      experience.scenes.includes(scene.id)
    );
  });

  if (!experiences && !isLoading && !error) {
    return <div>No experiences found</div>;
  }

  if (!params) {
    return <div>No params found</div>;
  }

  const experience = experiences?.find((exp) => exp.id === params?.id);
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Loading..." />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse space-y-8 w-full max-w-2xl">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Experience Not Found" />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl text-red-500 mb-4">Experience not found</p>
            <Link
              href="/gallery"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Return to Gallery
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={experience.title} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <DomeScene scenes={scenes} generations={processedGenerations} />
        </div>
      </main>
    </div>
  );
}
