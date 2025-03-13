// src/services/dbService.ts

import {
  ArtefactId,
  Artefact,
} from "@arkology-studio/ontothesia-types/artefact";
import { Scene, SceneId } from "@arkology-studio/ontothesia-types/scene";
import {
  Experience,
  ExperienceId,
} from "@arkology-studio/ontothesia-types/experience";
import {
  Embedding,
  EmbeddingId,
} from "@arkology-studio/ontothesia-types/embedding";
import { Generation } from "@arkology-studio/ontothesia-types/generation";

// Because Prisma autogenerates an ID by default, we can use Omit<*, "id"> when creating new records.
// For update methods, we accept a Partial of the entity so you can update any subset of fields.

export interface DBService {
  // ───────────────────────────────────────────────────────────────────
  // ARTEFACT
  // ───────────────────────────────────────────────────────────────────
  createArtefact(data: Omit<Artefact, "id">): Promise<Artefact>;
  getArtefactById(id: ArtefactId): Promise<Artefact | null>;
  getAllArtefacts(): Promise<Artefact[]>;
  updateArtefact(id: ArtefactId, data: Partial<Artefact>): Promise<Artefact>;
  deleteArtefact(id: ArtefactId): Promise<Artefact>;

  // ───────────────────────────────────────────────────────────────────
  // SCENE
  // ───────────────────────────────────────────────────────────────────
  createScene(data: Omit<Scene, "id">): Promise<Scene>;
  getSceneById(id: SceneId): Promise<Scene | null>;
  getAllScenes(): Promise<Scene[]>;
  updateScene(id: SceneId, data: Partial<Scene>): Promise<Scene>;
  deleteScene(id: SceneId): Promise<Scene>;

  // ───────────────────────────────────────────────────────────────────
  // EXPERIENCE
  // ───────────────────────────────────────────────────────────────────
  createExperience(data: Omit<Experience, "id">): Promise<Experience>;
  getExperienceById(id: ExperienceId): Promise<Experience | null>;
  getAllExperiences(): Promise<Experience[]>;
  updateExperience(
    id: ExperienceId,
    data: Partial<Experience>
  ): Promise<Experience>;
  deleteExperience(id: ExperienceId): Promise<Experience>;

  // ───────────────────────────────────────────────────────────────────
  // EMBEDDING
  // ───────────────────────────────────────────────────────────────────
  createEmbedding(data: Omit<Embedding, "id">): Promise<Embedding>;
  getEmbeddingById(id: EmbeddingId): Promise<Embedding | null>;
  getAllEmbeddings(): Promise<Embedding[]>;
  getEmbeddingByArtefactId(artefactId: ArtefactId): Promise<Embedding | null>;

  // ───────────────────────────────────────────────────────────────────
  // GENERATION
  // ───────────────────────────────────────────────────────────────────
  createGeneration(data: Omit<Generation, "id">): Promise<Generation>;
  getAllGenerations(): Promise<Generation[]>;
}
