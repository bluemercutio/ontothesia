"use client";

import React, { useState, useEffect, useCallback, JSX } from "react";
import Gallery from "@/components/Gallery";
import {
  useGetEmbeddingsQuery,
  useGetGenerationsQuery,
  useGetScenesQuery,
  useGetArtefactsQuery,
  useGetExperienceByIdQuery,
} from "@/store/api";
import { useParams } from "next/navigation";
import { EmbeddingNetwork, GraphNode } from "@/services/graph/interface";
import dynamic from "next/dynamic";
import { buildDirectedNetwork } from "@/services/graph/similarity-graph";
import { EmbeddingId } from "@ontothesia/types/embedding";
import { Scene } from "@ontothesia/types/scene";
const MapButton = dynamic(() => import("@/components/MapButton"), {
  ssr: false,
});

function LoadingState(): JSX.Element {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="animate-pulse space-y-8 w-full max-w-2xl">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export default function GalleryRoom(): JSX.Element {
  const { id } = useParams() as { id: string };
  const { data: experience } = useGetExperienceByIdQuery(id);
  const { data: embeddings, isLoading: embeddingsLoading } =
    useGetEmbeddingsQuery();
  const { data: artefacts, isLoading: artefactsLoading } =
    useGetArtefactsQuery();
  const { data: scenes, isLoading: scenesLoading } = useGetScenesQuery();
  const { data: generations, isLoading: generationsLoading } =
    useGetGenerationsQuery();

  const [fullNetwork, setFullNetwork] = useState<EmbeddingNetwork | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<EmbeddingId | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [experienceScenes, setExperienceScenes] = useState<Scene[]>([]);
  const timeoutRef = React.useRef<number>(window.setTimeout(() => {}, 0));

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsMapVisible(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsMapVisible(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => resetTimer();
    window.addEventListener("mousemove", handleMouseMove);
    resetTimer(); // Initial setup

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer, experience]); // Only depend on the memoized resetTimer function

  useEffect(() => {
    if (embeddings && artefacts && experience && scenes) {
      // First, get all scenes for this experience
      const filteredScenes = scenes.filter((scene) =>
        experience.scenes.some((expSceneId) => expSceneId === scene.id)
      );

      // Get artefacts for these filtered scenes
      const relevantArtefacts = artefacts.filter((artefact) =>
        filteredScenes.some((scene) => scene.artefact === artefact.id)
      );
      console.log("Relevant artefacts:", relevantArtefacts);

      // Get embeddings for these artefacts
      const relevantEmbeddings = embeddings.filter((embedding) =>
        relevantArtefacts.some(
          (artefact) => artefact.embedding === embedding.id
        )
      );
      console.log("Relevant embeddings:", relevantEmbeddings);

      // Update state
      setExperienceScenes(filteredScenes);

      if (relevantEmbeddings.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * relevantEmbeddings.length
        );
        const chosenEmbedding = relevantEmbeddings[randomIndex];
        setCurrentNodeId(chosenEmbedding.id);
        const network = buildDirectedNetwork(
          chosenEmbedding,
          relevantEmbeddings,
          3,
          0.8
        );
        setFullNetwork(network);
      }
    }
  }, [embeddings, artefacts, experience, scenes]); // Remove experienceScenes from dependencies

  const handleNodeChange = useCallback((node: GraphNode): void => {
    setCurrentNodeId(node.id);
  }, []);

  if (
    embeddingsLoading ||
    scenesLoading ||
    generationsLoading ||
    artefactsLoading ||
    !fullNetwork ||
    !currentNodeId ||
    !embeddings ||
    !generations ||
    !scenes ||
    !artefacts ||
    !experience
  ) {
    return <LoadingState />;
  }
  const artefact = artefacts.find((a) => a.embedding === currentNodeId);
  if (!artefact) {
    console.error("No artefact found for current node id", currentNodeId);
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Gallery
          fullNetwork={fullNetwork}
          currentNodeId={currentNodeId}
          embeddings={embeddings}
          generations={generations}
          artefacts={artefacts}
          scenes={experienceScenes}
          onNodeChange={handleNodeChange}
        />
        <MapButton
          isVisible={isMapVisible}
          data={fullNetwork}
          currentNodeId={currentNodeId}
          setSelectedNode={handleNodeChange}
          artefact={artefact}
        />
      </main>
    </div>
  );
}
