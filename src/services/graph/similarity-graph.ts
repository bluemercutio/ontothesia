import { Embedding } from "@/types/embedding";
import {
  cosineSimilarity,
  findTopMatches,
} from "@/services/similarity/similarity";
import { GraphNode, GraphEdge, EmbeddingNetwork } from "./interface";

export const buildSimilarityNetwork = (
  embeddings: Embedding[],
  threshold: number
): EmbeddingNetwork => {
  const nodes: GraphNode[] = embeddings.map((item) => ({
    id: item.id,
    label: item.id, // or any other display label
    artefact: item.artefactId,
  }));

  const edges: GraphEdge[] = [];

  // Only compare each pair once
  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      const e1 = embeddings[i];
      const e2 = embeddings[j];

      // Calculate similarity
      const sim = cosineSimilarity(e1.vector, e2.vector);

      // If it's above threshold, create an undirected edge
      if (sim >= threshold) {
        edges.push({
          source: e1.id,
          target: e2.id,
          similarity: sim,
        });
      }
    }
  }

  return { nodes, edges };
};

export const buildTopNNetwork = (
  embeddings: Embedding[],
  topN: number
): EmbeddingNetwork => {
  const nodes: GraphNode[] = embeddings.map((item) => ({
    id: item.id,
    label: item.id,
    artefact: item.artefactId,
  }));

  const edges: GraphEdge[] = [];

  // For each node, find top N matches, then add edges
  for (const currentEmbedding of embeddings) {
    // findTopMatches returns an array of items with { ...item, similarity }
    const matches = findTopMatches(currentEmbedding, embeddings, topN);

    // Create edges from current node to each match
    for (const match of matches) {
      // Avoid self-loop
      if (match.id !== currentEmbedding.id) {
        edges.push({
          source: currentEmbedding.id,
          target: match.id,
          similarity: match.similarity,
        });
      }
    }
  }

  // If you want an undirected graph:
  // remove duplicates (A->B, B->A). One approach: sort node IDs and keep only the sorted pair.
  // Or just keep them if your rendering library can handle duplicates gracefully.

  return { nodes, edges };
};

export const buildDirectedNetwork = (
  startingEmbedding: Embedding,
  embeddings: Embedding[],
  topN: number,
  minSimilarity: number = 0.5
): EmbeddingNetwork => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const processedIds = new Set<string>();

  // Helper function to process an embedding and its connections
  const processNode = (currentEmbedding: Embedding) => {
    // Add current node if not already added
    if (!processedIds.has(currentEmbedding.id)) {
      nodes.push({
        id: currentEmbedding.id,
        label: currentEmbedding.id,
        artefact: currentEmbedding.artefactId,
      });
      processedIds.add(currentEmbedding.id);

      // Find top N matches for the current embedding
      const matches = findTopMatches(currentEmbedding, embeddings, topN + 1); // +1 to account for self-match

      // Create directed edges to matches that meet the similarity threshold
      for (const match of matches) {
        if (
          match.id !== currentEmbedding.id &&
          match.similarity >= minSimilarity
        ) {
          edges.push({
            source: currentEmbedding.id,
            target: match.id,
            similarity: match.similarity,
          });

          // Recursively process the matched node if not processed
          const matchedEmbedding = embeddings.find((e) => e.id === match.id);
          if (matchedEmbedding && !processedIds.has(match.id)) {
            processNode(matchedEmbedding);
          }
        }
      }
    }
  };

  // Start processing from the initial embedding
  processNode(startingEmbedding);

  return { nodes, edges };
};
