import { ArtefactId } from "./artefact";

export type EmbeddingId = string;

export interface Embedding {
  id: EmbeddingId;
  vector: number[];
  artefactId: ArtefactId;
}
