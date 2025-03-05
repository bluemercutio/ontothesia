"use client";

import React, { useState, useEffect, useCallback, JSX } from "react";
import Gallery from "@/components/Gallery";
import {
  useGetEmbeddingsQuery,
  useGetGenerationsQuery,
  useGetScenesQuery,
  useGetArtefactsQuery,
} from "@/store/api";
import { EmbeddingNetwork, GraphNode } from "@/services/graph/interface";
import dynamic from "next/dynamic";
import { buildDirectedNetwork } from "@/services/graph/similarity-graph";
import { Embedding, EmbeddingId } from "@/types/embedding";

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
  const { data: embeddings, isLoading: embeddingsLoading } =
    useGetEmbeddingsQuery();
  const { data: artefacts, isLoading: artefactsLoading } =
    useGetArtefactsQuery();
  const { data: scenes, isLoading: scenesLoading } = useGetScenesQuery();
  const { data: generations, isLoading: generationsLoading } =
    useGetGenerationsQuery();

  const [fullNetwork, setFullNetwork] = useState<EmbeddingNetwork | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<EmbeddingId | null>(null);

  useEffect(() => {
    if (embeddings && embeddings.length > 0 && scenes && scenes.length > 0) {
      const randomIndex: number = Math.floor(Math.random() * embeddings.length);
      const chosenEmbedding: Embedding = embeddings[randomIndex];
      setCurrentNodeId(chosenEmbedding.id);
      const network: EmbeddingNetwork = buildDirectedNetwork(
        chosenEmbedding,
        embeddings,
        3,
        0.8
      );
      setFullNetwork(network);
    }
  }, [embeddings, scenes]);

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
    !artefacts
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
      <main className="flex-1 container mx-auto px-4 py-8">
        <Gallery
          fullNetwork={fullNetwork}
          currentNodeId={currentNodeId}
          embeddings={embeddings}
          generations={generations}
          artefacts={artefacts}
          scenes={scenes}
          onNodeChange={handleNodeChange}
        />
        <MapButton
          isVisible={true}
          data={fullNetwork}
          currentNodeId={currentNodeId}
          setSelectedNode={handleNodeChange}
          artefact={artefact}
        />
      </main>
    </div>
  );
}
