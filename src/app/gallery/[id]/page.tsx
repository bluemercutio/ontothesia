"use client";

import React from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import TextBox from "@/components/TextBox";
import Link from "next/link";
import { useGetExperiencesQuery } from "@/store/api";
import { useParams } from "next/navigation";
import CinemaViewer from "@/components/CinemaViewer";
export default function ExperiencePage() {
  const params = useParams();
  const { data: experiences, isLoading, error } = useGetExperiencesQuery();

  if (!experiences && !isLoading && !error) {
    return <div>No experiences found</div>;
  }

  console.log("PARAMS", params);
  console.log("EXPERIENCES", experiences);

  if (!params) {
    return <div>No params found</div>;
  }

  const experience = experiences?.find((exp) => exp.id === params?.id);
  console.log("EXPERIENCE", experience);
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
          <Card
            title={experience.title}
            imageUrl={experience.image_url}
            width="w-full"
            height="h-96"
          />
          <CinemaViewer imageUrl={experience.image_url} />
          <TextBox
            title="About this Experience"
            content={experience.description}
          />
          {experience.scenes && experience.scenes.length > 0 && (
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4">Scenes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {experience.scenes.map((sceneId: string) => (
                  <Link
                    key={sceneId}
                    href={`/scene/${sceneId}`}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Card
                      title={`Scene ${sceneId}`}
                      width="w-full"
                      height="h-48"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
