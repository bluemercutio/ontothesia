"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Gallery from "@/components/Gallery";
import {
  useGetEmbeddingsQuery,
  useGetScenesQuery,
  useGetArtefactsQuery,
  useGetExperienceByIdQuery,
} from "@/store/api";
import { useParams } from "next/navigation";
import { EmbeddingNetwork, GraphNode } from "@/services/graph/interface";
import dynamic from "next/dynamic";
import { buildDirectedNetwork } from "@/services/graph/similarity-graph";
import { EmbeddingId } from "@arkology-studio/ontothesia-types/embedding";
import { Scene } from "@arkology-studio/ontothesia-types/scene";
import { LoadingState } from "@/components/LoadingSpinner";
const MapButton = dynamic(() => import("@/components/MapButton"), {
  ssr: false,
});

export default function GalleryRoom(): React.ReactElement {
  const { id } = useParams() as { id: string };
  const { data: experience } = useGetExperienceByIdQuery(id);
  const { data: embeddings, isLoading: embeddingsLoading } =
    useGetEmbeddingsQuery();
  const { data: artefacts, isLoading: artefactsLoading } =
    useGetArtefactsQuery();
  const { data: scenes, isLoading: scenesLoading } = useGetScenesQuery();

  const [fullNetwork, setFullNetwork] = useState<EmbeddingNetwork | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<EmbeddingId | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [experienceScenes, setExperienceScenes] = useState<Scene[]>([]);
  const [firstNodeSelected, setFirstNodeSelected] = useState(false);

  const timeoutRef = useRef<number | undefined>(undefined);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsMapVisible(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsMapVisible(false);
    }, 2000);
  }, []);

  useEffect(() => {
    resetTimer();
    const handleMouseMove = () => {
      resetTimer();
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [resetTimer]);

  useEffect(() => {
    if (embeddings && artefacts && experience && scenes && !firstNodeSelected) {
      const filteredScenes = scenes.filter((scene) =>
        experience.scenes.includes(scene.id)
      );

      const relevantArtefacts = artefacts.filter((artefact) =>
        filteredScenes.some((scene) => scene.artefact === artefact.id)
      );

      const relevantEmbeddings = embeddings.filter((embedding) =>
        relevantArtefacts.some(
          (artefact) => artefact.embedding === embedding.id
        )
      );

      // Find a candidate node that has at least 3 outgoing edges
      const candidates = relevantEmbeddings.filter((embedding) => {
        const testNetwork = buildDirectedNetwork(
          embedding,
          relevantEmbeddings,
          3,
          0.8
        );

        // Count outgoing edges
        const outgoingEdges = testNetwork.edges.filter(
          (edge) => edge.source === embedding.id
        ).length;

        return outgoingEdges >= 3;
      });

      let chosenEmbedding;
      if (candidates.length > 0) {
        chosenEmbedding =
          candidates[Math.floor(Math.random() * candidates.length)];
      } else {
        chosenEmbedding =
          relevantEmbeddings[
            Math.floor(Math.random() * relevantEmbeddings.length)
          ];
      }

      setCurrentNodeId(chosenEmbedding.id);
      const network = buildDirectedNetwork(
        chosenEmbedding,
        relevantEmbeddings,
        3,
        0.8
      );
      setFullNetwork(network);

      setFirstNodeSelected(true);
      setExperienceScenes(filteredScenes);
    }
  }, [embeddings, artefacts, experience, scenes, firstNodeSelected]);

  const handleNodeChange = useCallback((node: GraphNode): void => {
    setCurrentNodeId(node.id);
  }, []);

  if (
    embeddingsLoading ||
    scenesLoading ||
    artefactsLoading ||
    !fullNetwork ||
    !currentNodeId ||
    !embeddings ||
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
