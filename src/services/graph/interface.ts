import { ArtefactId } from "@/types/artefact";

export interface GraphNode {
  id: string;
  label: string;
  artefact: ArtefactId;
  // Optional: You can store extra fields, e.g. group, color, etc.
}

export interface GraphEdge {
  source: string;
  target: string;
  similarity: number;
  // Optional: directed edges, styling info, etc.
}

export interface EmbeddingNetwork {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
