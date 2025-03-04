"use client";

import React from "react";
import Gallery from "@/components/Gallery";
import {
  useGetEmbeddingsQuery,
  useGetGenerationsQuery,
  useGetScenesQuery,
} from "@/store/api";

function LoadingState() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="animate-pulse space-y-8 w-full max-w-2xl">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export default function GalleryRoom() {
  const { data: embeddings, isLoading: embeddingsLoading } =
    useGetEmbeddingsQuery();
  const { data: scenes, isLoading: scenesLoading } = useGetScenesQuery();
  const { data: generations, isLoading: generationsLoading } =
    useGetGenerationsQuery();

  // Always show loading state on first render to match SSR
  const [isFirstRender, setIsFirstRender] = React.useState(true);

  React.useEffect(() => {
    setIsFirstRender(false);
  }, []);

  // Show loading state on first render or while data is loading
  if (
    isFirstRender ||
    embeddingsLoading ||
    scenesLoading ||
    generationsLoading
  ) {
    return <LoadingState />;
  }

  // Show not found if data is missing after loading
  if (!embeddings?.length || !scenes?.length || !generations?.length) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div>No content available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <Gallery
          embedding={embeddings[0]}
          embeddings={embeddings}
          generations={generations}
          scenes={scenes}
          THRESHOLD={0.5}
        />
      </main>
    </div>
  );
}
