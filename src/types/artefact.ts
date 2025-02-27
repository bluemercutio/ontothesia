import { EmbeddingId } from "./embedding";

export type ArtefactId = string;

export interface Artefact {
  id: ArtefactId;
  title: string;
  text: string;
  region: string;
  approx_date: string;
  citation: string;
  embedding: EmbeddingId;
}
