// src/services/dbService.ts

import { prisma } from "@ontothesia/prisma";
import { DBService } from "./interface";
import { Artefact, ArtefactId } from "@ontothesia/types/artefact";
import { Scene, SceneId } from "@ontothesia/types/scene";
import { Experience, ExperienceId } from "@ontothesia/types/experience";
import { Embedding, EmbeddingId } from "@ontothesia/types/embedding";
import { Generation } from "@ontothesia/types/generation";
import { v4 as uuidv4 } from "uuid";

import {
  RawArtefactWithEmbedding,
  RawSceneWithGeneration,
  RawExperienceWithScenes,
  RawEmbedding,
  RawGeneration,
} from "./raw"; // <-- adjust path as needed

// ───────────────────────────────────────────────────────────────────
// MAPPERS: from "raw Prisma" to your domain types
// ───────────────────────────────────────────────────────────────────

function mapArtefact(raw: RawArtefactWithEmbedding): Artefact {
  return {
    id: raw.id,
    title: raw.title,
    text: raw.text,
    region: raw.region,
    approx_date: raw.approx_date,
    citation: raw.citation,
    embedding: raw.embedding?.id ?? "",
  };
}

function mapScene(raw: RawSceneWithGeneration): Scene {
  return {
    id: raw.id,
    title: raw.title,
    context: raw.context,
    artefact: raw.artefactId,
    image_url: raw.image_url,
    video_url: raw.video_url ?? "",
    visualisation: raw.visualisation,
    experience: raw.experienceId ?? "",
    generation: raw.generation?.id ?? "",
  };
}

function mapExperience(raw: RawExperienceWithScenes): Experience {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    visible: raw.visible,
    image_url: raw.image_url,
    scenes: raw.scenes.map((scene) => scene.id),
  };
}

function mapEmbedding(raw: RawEmbedding): Embedding {
  return {
    id: raw.id,
    vector: raw.vector,
    artefactId: raw.artefactId,
  };
}

function mapGeneration(raw: RawGeneration): Generation {
  return {
    id: raw.id,
    prompt: raw.prompt,
    image_url: raw.image_url,
    artefact: raw.artefactId,
    scene: raw.sceneId,
  };
}

// 3. Implement the DB service with strictly typed returns
export const dbService: DBService = {
  // ───────────────────────────────────────────────────────────────────
  // ARTEFACT
  // ───────────────────────────────────────────────────────────────────
  createArtefact: async (data: Omit<Artefact, "id">): Promise<Artefact> => {
    const created = await prisma.artefact.create({
      data: {
        id: uuidv4(),
        title: data.title,
        text: data.text,
        region: data.region,
        approx_date: data.approx_date,
        citation: data.citation,
      },
      include: { embedding: true },
    });
    return mapArtefact(created);
  },

  getArtefactById: async (id: ArtefactId): Promise<Artefact | null> => {
    const artefact = await prisma.artefact.findUnique({
      where: { id },
      include: { embedding: true },
    });
    return artefact ? mapArtefact(artefact) : null;
  },

  getAllArtefacts: async (): Promise<Artefact[]> => {
    const artefacts = await prisma.artefact.findMany({
      include: { embedding: true },
    });
    return artefacts.map(mapArtefact);
  },

  updateArtefact: async (
    id: ArtefactId,
    data: Partial<Artefact>
  ): Promise<Artefact> => {
    const updated = await prisma.artefact.update({
      where: { id },
      data: {
        title: data.title,
        text: data.text,
        region: data.region,
        approx_date: data.approx_date,
        citation: data.citation,
      },
      include: { embedding: true },
    });
    return mapArtefact(updated);
  },

  deleteArtefact: async (id: ArtefactId): Promise<Artefact> => {
    const deleted = await prisma.artefact.delete({
      where: { id },
      include: { embedding: true },
    });
    return mapArtefact(deleted);
  },

  // ───────────────────────────────────────────────────────────────────
  // SCENE
  // ───────────────────────────────────────────────────────────────────
  createScene: async (data: Scene): Promise<Scene> => {
    const {
      artefact: artefactId,
      experience: experienceId,
      generation,
      ...rest
    } = data;
    const created = await prisma.scene.create({
      data: {
        ...rest,
        artefactId,
        experienceId,
        generation: { connect: { id: generation } },
      },
      include: { generation: true },
    });
    return mapScene(created);
  },

  getSceneById: async (id: SceneId): Promise<Scene | null> => {
    const scene = await prisma.scene.findUnique({
      where: { id },
      include: { generation: true },
    });
    return scene ? mapScene(scene) : null;
  },

  getAllScenes: async (): Promise<Scene[]> => {
    const scenes = await prisma.scene.findMany({
      include: { generation: true },
    });
    return scenes.map(mapScene);
  },

  updateScene: async (id: SceneId, data: Partial<Scene>): Promise<Scene> => {
    const {
      artefact: artefactId,
      experience: experienceId,
      generation,
      ...rest
    } = data;
    const updated = await prisma.scene.update({
      where: { id },
      data: {
        ...rest,
        ...(artefactId && { artefactId }),
        ...(experienceId && { experienceId }),
        ...(generation && { generation: { connect: { id: generation } } }),
      },
      include: { generation: true },
    });
    return mapScene(updated);
  },

  deleteScene: async (id: SceneId): Promise<Scene> => {
    const deleted = await prisma.scene.delete({
      where: { id },
      include: { generation: true },
    });
    return mapScene(deleted);
  },

  // ───────────────────────────────────────────────────────────────────
  // EXPERIENCE
  // ───────────────────────────────────────────────────────────────────
  createExperience: async (
    data: Omit<Experience, "id" | "scenes">
  ): Promise<Experience> => {
    const created = await prisma.experience.create({
      data: {
        title: data.title,
        visible: data.visible,
        description: data.description,
        image_url: data.image_url,
      },
      include: { scenes: true },
    });
    return mapExperience(created);
  },

  getExperienceById: async (id: ExperienceId): Promise<Experience | null> => {
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: { scenes: true },
    });
    return experience ? mapExperience(experience) : null;
  },

  getAllExperiences: async (): Promise<Experience[]> => {
    const experiences = await prisma.experience.findMany({
      include: { scenes: true },
    });
    return experiences.map(mapExperience);
  },

  updateExperience: async (
    id: ExperienceId,
    data: Partial<Omit<Experience, "id" | "scenes">>
  ): Promise<Experience> => {
    const updated = await prisma.experience.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.visible !== undefined && { visible: data.visible }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.image_url !== undefined && { image_url: data.image_url }),
      },
      include: { scenes: true },
    });
    return mapExperience(updated);
  },

  deleteExperience: async (id: ExperienceId): Promise<Experience> => {
    const deleted = await prisma.experience.delete({
      where: { id },
      include: { scenes: true },
    });
    return mapExperience(deleted);
  },

  // ───────────────────────────────────────────────────────────────────
  // EMBEDDING
  // ───────────────────────────────────────────────────────────────────
  createEmbedding: async (data: Omit<Embedding, "id">): Promise<Embedding> => {
    const created = await prisma.embedding.create({
      data: {
        id: uuidv4(),
        text: "", // "text" is required by the Prisma schema
        vector: data.vector,
        artefactId: data.artefactId,
      },
    });
    return mapEmbedding(created);
  },

  getEmbeddingById: async (id: EmbeddingId): Promise<Embedding | null> => {
    const embedding = await prisma.embedding.findUnique({ where: { id } });
    return embedding ? mapEmbedding(embedding) : null;
  },

  getAllEmbeddings: async (): Promise<Embedding[]> => {
    const embeddings = await prisma.embedding.findMany();
    return embeddings.map(mapEmbedding);
  },

  getEmbeddingByArtefactId: async (
    artefactId: ArtefactId
  ): Promise<Embedding | null> => {
    const embedding = await prisma.embedding.findFirst({
      where: { artefactId },
    });
    return embedding ? mapEmbedding(embedding) : null;
  },

  // ───────────────────────────────────────────────────────────────────
  // GENERATION
  // ───────────────────────────────────────────────────────────────────
  createGeneration: async (
    data: Omit<Generation, "id">
  ): Promise<Generation> => {
    const created = await prisma.generation.create({
      data: {
        id: uuidv4(),
        image_url: data.image_url,
        prompt: data.prompt,
        artefactId: data.artefact,
        sceneId: data.scene,
      },
    });
    return mapGeneration(created);
  },

  getAllGenerations: async (): Promise<Generation[]> => {
    const generations = await prisma.generation.findMany();
    return generations.map(mapGeneration);
  },
};
