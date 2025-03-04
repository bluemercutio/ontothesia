"use client";

import React from "react";
import Gallery from "@/components/Gallery";
import {
  useGetEmbeddingsQuery,
  useGetGenerationsQuery,
  useGetScenesQuery,
} from "@/store/api";
import { EmbeddingNetwork } from "@/services/graph/interface";
import dynamic from "next/dynamic";
import { buildDirectedNetwork } from "@/services/graph/similarity-graph";

// Dynamically import MapButton with no SSR
const MapButton = dynamic(() => import("@/components/MapButton"), {
  ssr: false,
});

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
  const [currentNetwork, setCurrentNetwork] =
    React.useState<EmbeddingNetwork | null>(null);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastMouseMove, setLastMouseMove] = React.useState(Date.now());

  // Initialize network when data is available
  React.useEffect(() => {
    if (embeddings?.length && scenes?.length) {
      const randomIndex = Math.floor(Math.random() * embeddings.length);
      const network = buildDirectedNetwork(
        embeddings[randomIndex],
        embeddings,
        scenes,
        3,
        0.5
      );
      setCurrentNetwork(network);
    }
  }, [embeddings, scenes]);

  // Handle auto-hide behavior
  React.useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);
      setLastMouseMove(Date.now());
    };

    const checkMouseIdle = () => {
      if (Date.now() - lastMouseMove > 2000) {
        setIsVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    const interval = setInterval(checkMouseIdle, 500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [lastMouseMove]);

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
          onNetworkChange={setCurrentNetwork}
        />
        {currentNetwork && (
          <MapButton
            isVisible={isVisible}
            onClick={() => {
              console.log("Map button clicked, network data:", {
                nodes: currentNetwork.nodes?.length,
                edges: currentNetwork.edges?.length,
              });
            }}
            data={currentNetwork}
          />
        )}
      </main>
    </div>
  );
}
