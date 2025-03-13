"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import Header from "@/components/Header";
import { useGetExperiencesQuery } from "@/store/api";
import { useRouter } from "next/navigation";
import { Experience } from "@ontothesia/types/experience";

interface EnhancedExperience extends Experience {
  processedImageUrl: string;
}

export default function Gallery() {
  const [visibleExperiences, setVisibleExperiences] = useState<
    EnhancedExperience[]
  >([]);
  const router = useRouter();

  const {
    data: experiences,
    isLoading: isLoadingExperiences,
    error: experiencesError,
  } = useGetExperiencesQuery();

  const isLoading = isLoadingExperiences;
  const error = experiencesError;

  // Update visible experiences and process image URLs whenever the experiences data changes
  useEffect(() => {
    const processExperiences = async (exps: Experience[]) => {
      const filtered = exps.filter((experience) => experience.visible);
      const processed = await Promise.all(
        filtered.map(async (exp) => {
          // Get just the filename from the image_url
          const filename = exp.image_url.split("/").pop();

          console.log("Processing experience:", {
            id: exp.id,
            imageUrl: exp.image_url,
            extractedFilename: filename,
          });

          // Construct the API route URL with folder parameter
          const apiUrl = `/api/images/${filename}?folder=${process.env.NEXT_PUBLIC_EXPERIENCE_IMAGES_KEY}`;
          return {
            ...exp,
            processedImageUrl: apiUrl,
          };
        })
      );
      setVisibleExperiences(processed);
    };

    if (experiences) {
      processExperiences(experiences);
    }
  }, [experiences]);

  // Always maintain the same base layout structure
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Gallery" />
      <main className="flex-1 container mx-auto px-4">
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
        ) : visibleExperiences.length > 0 ? (
          // Content when data is available
          <>
            <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col items-center justify-center">
              <Carousel>
                {visibleExperiences.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      router.push(
                        `/gallery/${item.id}?imageUrl=${encodeURIComponent(
                          item.processedImageUrl
                        )}`
                      )
                    }
                    className="cursor-pointer"
                  >
                    <Card
                      title={item.title}
                      description={item.description}
                      imageUrl={item.processedImageUrl}
                      width="w-96"
                      height="h-96"
                    />
                  </div>
                ))}
              </Carousel>
              <button
                onClick={() => {
                  document.getElementById("catalogue")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="mt-8 pt-10 text-lg hover:underline cursor-pointer flex items-center gap-2"
              >
                View Catalogue
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>

            <div id="catalogue" className="min-h-screen pt-24">
              <h2 className="text-3xl text-center mb-8">Catalogue</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {visibleExperiences.map((item) => (
                  <div
                    key={`flex-${item.id}`}
                    className="px-5 cursor-pointer"
                    onClick={() => router.push(`/gallery/${item.id}`)}
                  >
                    <Card
                      title={item.title}
                      description={item.description}
                      imageUrl={item.processedImageUrl}
                      width="w-32"
                      height="h-48"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // No experiences available
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-xl">
              No experiences available at the moment.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
