"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import { useGetExperienceByIdQuery, useGetGenerationsQuery } from "@/store/api";

export default function GalleryOptions() {
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  if (!searchParams) {
    throw new Error("No search params found");
  }
  const imageUrl = searchParams.get("imageUrl");
  if (!imageUrl) {
    throw new Error("No image URL found");
  }
  const router = useRouter();

  const {
    data: experience,
    isLoading: isLoadingExperience,
    error: errorExperience,
  } = useGetExperienceByIdQuery(id);
  const {
    data: generations,
    isLoading: isLoadingGenerations,
    error: errorGenerations,
  } = useGetGenerationsQuery();

  if (
    isLoadingExperience ||
    errorExperience ||
    !experience ||
    !generations ||
    isLoadingGenerations ||
    errorGenerations
  )
    return null;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-row gap-12 justify-center pt-20">
          {/* Left side description */}
          <div className="flex-1 max-w-md">
            <h1 className="text-2xl font-bold mb-4">{experience.title}</h1>
            <p className="text-lg pb-10">{experience.description}</p>
            <Card imageUrl={imageUrl} width="w-96" height="h-96" />
          </div>

          {/* Right side stacked cards */}
          <div className="flex flex-col gap-8">
            <Card
              title="Dome View"
              text="Explore cultural maps in a 3D Dome Environment, watching ideas and concepts emerge out of curated 'seed' coordinates and paint themselves around the viewer, entering the field like fleeting thoughts, and finding context in their shared relationality."
              width="w-[300px]"
              component={
                <div className="flex flex-col gap-4">
                  <button
                    className="bg-[var(--primary-bg)] text-onSecondary px-4 py-2 rounded-md w-full"
                    onClick={() => router.push(`/gallery/${id}/dome`)}
                  >
                    Enter
                  </button>
                </div>
              }
            />

            <Card
              title="Gallery View"
              text="Explore the gallery of images, traversable according to a network map, a relational graph situating the artefacts the images represent in a relational context."
              width="w-[300px]"
              component={
                <div className="flex flex-col gap-4">
                  <button
                    className="bg-[var(--primary-bg)] text-onSecondary px-4 py-2 rounded-md w-full"
                    onClick={() => router.push(`/gallery/${id}/network`)}
                  >
                    Enter
                  </button>
                </div>
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}
