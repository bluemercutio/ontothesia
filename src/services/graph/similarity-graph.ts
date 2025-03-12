import { Embedding } from "@ontothesia/types/embedding";
import { findTopMatches } from "@/services/similarity/similarity";
import { GraphNode, GraphEdge, EmbeddingNetwork } from "./interface";

export const buildDirectedNetwork = (
  startingEmbedding: Embedding,
  embeddings: Embedding[],
  topN: number,
  minSimilarity: number = 0.5
): EmbeddingNetwork => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const processedIds: Set<string> = new Set<string>();

  const processNode = (currentEmbedding: Embedding): void => {
    if (!processedIds.has(currentEmbedding.id)) {
      nodes.push({
        id: currentEmbedding.id,
        label: currentEmbedding.id,
        artefact: currentEmbedding.artefactId,
      });
      processedIds.add(currentEmbedding.id);

      const matches = findTopMatches(currentEmbedding, embeddings, topN + 1);
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
          const matchedEmbedding = embeddings.find((e) => e.id === match.id);
          if (matchedEmbedding && !processedIds.has(match.id)) {
            processNode(matchedEmbedding);
          }
        }
      }
    }
  };

  processNode(startingEmbedding);

  return { nodes, edges };
};
