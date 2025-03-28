"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { useGetExperienceByIdQuery } from "@/store/api";
import { useParams } from "next/navigation";
import DomeScene from "@/components/Dome";
import { useGetScenesQuery } from "@/store/api";
import { LoadingState } from "@/components/LoadingSpinner";
import { Scene } from "@arkology-studio/ontothesia-types/scene";
import { ExperienceId } from "@arkology-studio/ontothesia-types/experience";

interface EnhancedScene extends Scene {
  processedImageUrl: string;
}

export default function ExperiencePage() {
  const { id } = useParams() as { id: ExperienceId };
  const {
    data: experience,
    isLoading: isLoadingExperience,
    error: errorExperience,
  } = useGetExperienceByIdQuery(id);
  const allScenes = useGetScenesQuery();

  const [experienceScenes, setExperienceScenes] = useState<Scene[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [processedScenes, setProcessedScenes] = useState<EnhancedScene[]>([]);
  const scenesToCleanupRef = useRef<EnhancedScene[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [instructionsOpacity, setInstructionsOpacity] = useState(1);

  useEffect(() => {
    const handleClick = () => {
      setInstructionsOpacity(0);
      setTimeout(() => {
        setShowInstructions(false);
      }, 1500);
    };

    if (showInstructions) {
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showInstructions]);

  useEffect(() => {
    if (experience?.scenes && allScenes.data) {
      const filteredScenes = allScenes.data.filter((scene) =>
        experience.scenes.some((expSceneId) => expSceneId === scene.id)
      );
      setExperienceScenes(filteredScenes);
    }
  }, [experience?.scenes, allScenes.data]);

  useEffect(() => {
    const processSceneImages = async () => {
      setIsProcessing(true);
      try {
        const processed = await Promise.all(
          experienceScenes.map(async (scene) => {
            const filename = scene.image_url.split("/").pop();
            const apiUrl = `/api/images/${filename}?folder=${process.env.NEXT_PUBLIC_SCENE_IMAGES_KEY}`;

            try {
              const response = await fetch(apiUrl);
              if (!response.ok) {
                console.error(`Failed to fetch image for scene ${scene.id}`);
                return {
                  ...scene,
                  processedImageUrl: apiUrl,
                };
              }

              const blob = await response.blob();
              const objectUrl = URL.createObjectURL(blob);

              return {
                ...scene,
                processedImageUrl: objectUrl,
              };
            } catch (error) {
              console.error(`Error processing scene ${scene.id}:`, error);
              return {
                ...scene,
                processedImageUrl: apiUrl,
              };
            }
          })
        );
        scenesToCleanupRef.current = processed;
        setProcessedScenes(processed);
      } finally {
        setIsProcessing(false);
      }
    };

    if (experienceScenes.length > 0) {
      processSceneImages();
    }

    return () => {
      scenesToCleanupRef.current.forEach((scene) => {
        if (scene.processedImageUrl.startsWith("blob:")) {
          URL.revokeObjectURL(scene.processedImageUrl);
        }
      });
    };
  }, [experienceScenes]);

  console.log("All scenes", allScenes.data);

  if (!allScenes.data) {
    return <div>No scenes or experiences found</div>;
  }

  if (!experience && !isLoadingExperience && !errorExperience) {
    return <div>No experience found</div>;
  }

  if (!id) {
    return <div>No params found</div>;
  }

  if (isLoadingExperience) {
    return <LoadingState />;
  }

  if (errorExperience || !experience) {
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
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        <div className="flex flex-col items-center gap-8">
          {showInstructions && (
            <div
              className="absolute top-8 left-0 right-0 z-10 text-center transition-opacity duration-1500"
              style={{ pointerEvents: "none", opacity: instructionsOpacity }}
            >
              <p className="text-lg md:text-xl text-white drop-shadow-md">
                Click to Active Camera Controls
              </p>
            </div>
          )}
          {isProcessing ? (
            <LoadingState />
          ) : (
            <DomeScene scenes={processedScenes} />
          )}
        </div>
      </main>
    </div>
  );
}
