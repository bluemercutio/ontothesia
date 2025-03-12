import { ArtefactId } from "@ontothesia/types/artefact";
import { EmbeddingId } from "@ontothesia/types/embedding";

export interface GraphNode {
  id: EmbeddingId;
  label: EmbeddingId;
  artefact: ArtefactId;
  // Optional: You can store extra fields, e.g. group, color, etc.
}

export interface GraphEdge {
  source: EmbeddingId;
  target: EmbeddingId;
  similarity: number;
  // Optional: directed edges, styling info, etc.
}

export interface EmbeddingNetwork {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
