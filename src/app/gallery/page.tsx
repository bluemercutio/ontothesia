"use client";

import React from "react";
import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import Header from "@/components/Header";
import { useGetExperiencesQuery, useGetGenerationsQuery } from "@/store/api";
import { useRouter } from "next/navigation";
import { Generation } from "@/types/generation";
import { getImageUrlForGeneration } from "@/services/utils/generations";
import { SceneId } from "@/types/scene";
export default function Gallery() {
  const router = useRouter();
  const { data: experiences, isLoading, error } = useGetExperiencesQuery();
  const {
    data: generations,
    isLoading: isLoadingGenerations,
    error: errorGenerations,
  } = useGetGenerationsQuery();

  if (!experiences) return null;
  const sceneIds: SceneId[] = experiences.flatMap(
    (experience) => experience.scenes
  );
  console.log("sceneIds", sceneIds);

  if (isLoadingGenerations || errorGenerations || !generations) return null;

  const filteredGenerations = generations.filter((generation: Generation) =>
    sceneIds.includes(generation.scene)
  );

  const imageUrls = filteredGenerations.map((generation) =>
    getImageUrlForGeneration(generation)
  );

  const getRandomImageUrls = (urls: string[], count: number) => {
    const shuffled = urls.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Always maintain the same base layout structure
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Gallery" />
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          // Loading state that matches the layout
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col justify-center items-center min-h-screen">
              <div
                className="animate-pulse w-64 h-80 rounded-lg"
                style={{ backgroundColor: "var(--primary-bg)" }}
              ></div>
            </div>
            <div className="min-h-screen pt-24">
              <div
                className="w-48 h-8 rounded mx-auto mb-8"
                style={{ backgroundColor: "var(--colour)" }}
              ></div>
              <div className="flex flex-wrap justify-center gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse w-64 h-80 rounded-lg"
                    style={{ backgroundColor: "var(--primary-bg)" }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          // Error state that matches the layout
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-xl text-red-500">
              Unable to load experiences. Please try again later.
            </div>
          </div>
        ) : (
          // Content when data is available
          <>
            <div className="flex-1 flex flex-col justify-center items-center min-h-screen">
              <Carousel>
                {(experiences || []).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/gallery/${item.id}`)}
                  >
                    <Card
                      title={item.title}
                      description={item.description}
                      imageUrls={getRandomImageUrls(imageUrls, 8)}
                      width="w-96"
                      height="h-96"
                    />
                  </div>
                ))}
              </Carousel>
            </div>

            <div className="min-h-screen pt-24">
              <h2 className="text-3xl font-bold text-center mb-8">
                Ontothesia Catalogue
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {(experiences || []).map((item, index) => (
                  <Card
                    key={`flex-${index}`}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.image_url}
                    width="w-32"
                    height="h-48"
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
