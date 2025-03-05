"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Network } from "@/components/Network";
import {
  useGetArtefactByIdQuery,
  useGetEmbeddingsQuery,
  useGetScenesQuery,
} from "@/store/api";
import { buildDirectedNetwork } from "@/services/graph/similarity-graph";
import Link from "next/link";

export default function ArtefactPage() {
  const params = useParams();
  const id = params?.id;

  console.log("PARAMS", params);

  // Use RTK Query hooks
  const {
    data: artefact,
    isLoading: artefactLoading,
    error: artefactError,
  } = useGetArtefactByIdQuery(typeof id === "string" ? id : "");

  const { data: scenes, isLoading: scenesLoading } = useGetScenesQuery();

  const { data: embeddings, isLoading: embeddingsLoading } =
    useGetEmbeddingsQuery();

  console.log("ARTEFACT", artefact);
  console.log("EMBEDDINGS", embeddings);

  // Build the network when data is available
  const directedEmbeddingNetwork = React.useMemo(() => {
    if (!artefact || !embeddings) return null;

    if (!scenes) return null;

    // Find the embedding for this artefact
    const embedding = embeddings.find((e) => e.id === `${id}-embedding`);
    if (!embedding) return null;

    const network = buildDirectedNetwork(embedding, embeddings, 3, 0.8);
    console.log("NETWORK", network);
    return network;
  }, [artefact, embeddings, id, scenes]);

  const isLoading = artefactLoading || embeddingsLoading || scenesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading artefact...</p>
      </div>
    );
  }

  if (artefactError || !artefact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          {artefactError ? "Error loading artefact" : "Artefact not found"}
        </p>
        <Link
          href="/library"
          className="text-blue-500 hover:text-blue-700 underline ml-2"
        >
          Return to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div
            style={{ background: "var(--primary-bg)" }}
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
            style={{ background: "var(--primary-bg)" }}
            className="rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Text</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {artefact.text}
            </p>
          </div>

          {directedEmbeddingNetwork && (
            <div
              style={{ background: "var(--primary-bg)" }}
              className="mt-6 shadow-lg p-6 rounded-md relative"
            >
              <div className="z-10">
                <h4 className="text-xl font-semibold mb-4">
                  Relational Network
                </h4>
                <Network
                  data={directedEmbeddingNetwork}
                  width={896}
                  height={600}
                  currentNodeId={`${id}-embedding`}
                  setSelectedNode={() => {}}
                  artefact={artefact}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
