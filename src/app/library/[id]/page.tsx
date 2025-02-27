"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Artefact as ArtefactType } from "@/types/artefact";
import NavbarWrapper from "@/components/NavbarWrapper";
import { Network } from "@/components/Network";
import { Embedding } from "@/types/embedding";
import { EmbeddingNetwork } from "@/services/graph/interface";
import { buildDirectedNetwork } from "@/services/graph/similarity-graph";

export default function ArtefactPage() {
  const params = useParams();
  const [artefact, setArtefact] = useState<ArtefactType | null>(null);
  const [embedding, setEmbedding] = useState<Embedding | null>(null);

  const [directedEmbeddingNetwork, setDirectedEmbeddingNetwork] =
    useState<EmbeddingNetwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtefactAndEmbedding = async () => {
      try {
        const artefactResponse = fetch(`/api/artefacts/${params.id}`);
        const embeddingResponse = fetch(
          `/api/embeddings/${params.id}/${params.id}`
        );
        const [artefact, embedding] = await Promise.all([
          await artefactResponse,
          await embeddingResponse,
        ]);
        if (!artefact.ok || !embedding.ok) {
          throw new Error("Artefact or embedding not found");
        }
        const artefactData = await artefact.json();
        const embeddingData = await embedding.json();
        setArtefact(artefactData);
        setEmbedding(embeddingData);
        //fetch all embeddings
        const embeddingsResponse = await fetch(`/api/embeddings`);
        const embeddingsData = await embeddingsResponse.json();
        const THRESHOLD = 0.8;
        const directedEmbeddingNetwork = buildDirectedNetwork(
          embeddingData,
          embeddingsData,
          3,
          THRESHOLD
        );
        setDirectedEmbeddingNetwork(directedEmbeddingNetwork);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch artefact"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtefactAndEmbedding();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading artefact...</p>
      </div>
    );
  }

  if (error || !artefact || !embedding) {
    console.log("error", error);
    console.log("artefact", artefact);
    console.log("embedding", embedding);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          {error || "Artefact or embedding not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div
            style={{ background: "var(--card-bg)" }}
            className="rounded-xl shadow-lg p-6 mb-6"
          >
            <h1 className="text-4xl font-bold mb-4">{artefact.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-medium">Region:</span> {artefact.region}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  <span className="font-medium">Date:</span>{" "}
                  {artefact.approx_date}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Citation</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm italic">
                  {artefact.citation}
                </p>
              </div>
            </div>
          </div>

          <div
            style={{ background: "var(--card-bg)" }}
            className="rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Text</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {artefact.text}
            </p>
          </div>

          {directedEmbeddingNetwork && (
            <div
              style={{ background: "var(--card-bg)" }}
              className="mt-6 shadow-lg p-6 rounded-md relative"
            >
              <div className="z-10">
                <h4 className="text-xl font-semibold mb-4">
                  Relational Network
                </h4>
                <Network
                  data={directedEmbeddingNetwork}
                  startingNode={`${params.id}-embedding`}
                  width={896}
                  height={600}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <NavbarWrapper />
    </div>
  );
}
