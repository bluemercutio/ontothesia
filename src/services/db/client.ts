// src/services/dbService.ts

import { prisma } from "@ontothesia/prisma";
import { DBService } from "./interface";
import { Artefact, ArtefactId } from "@ontothesia/types/artefact";
import { Scene, SceneId } from "@ontothesia/types/scene";
import { Experience, ExperienceId } from "@ontothesia/types/experience";
import { Embedding, EmbeddingId } from "@ontothesia/types/embedding";
import { Generation } from "@ontothesia/types/generation";
import { v4 as uuidv4 } from "uuid";

// Import Prisma types
import type {
  Artefact as PrismaArtefact,
  Scene as PrismaScene,
  Experience as PrismaExperience,
  Embedding as PrismaEmbedding,
  Generation as PrismaGeneration,
} from "@prisma/client";

// Define types for Prisma records with included relations
type ArtefactWithEmbedding = PrismaArtefact & {
  embedding: PrismaEmbedding | null;
};
type SceneWithGeneration = PrismaScene & {
  generation: PrismaGeneration | null;
};
type ExperienceWithScenes = PrismaExperience & { scenes: PrismaScene[] };

// ───────────────────────────────────────────────────────────────────
// HELPERS: Mapping functions
// ───────────────────────────────────────────────────────────────────

const mapArtefact = (a: ArtefactWithEmbedding): Artefact => ({
  id: a.id,
  title: a.title,
  text: a.text,
  region: a.region,
  approx_date: a.approx_date,
  citation: a.citation,
  embedding: a.embedding?.id ?? "",
});

const mapScene = (s: SceneWithGeneration): Scene => ({
  id: s.id,
  title: s.title,
  context: s.context,
  artefact: s.artefactId,
  image_url: s.image_url,
  video_url: s.video_url ?? "",
  visualisation: s.visualisation,
  experience: s.experienceId ?? "",
  generation: s.generation?.id ?? "",
});

const mapExperience = (e: ExperienceWithScenes): Experience => ({
  id: e.id,
  title: e.title,
  description: e.description,
  visible: e.visible,
  image_url: e.image_url,
  scenes: e.scenes.map((scene) => scene.id),
});

const mapEmbedding = (e: PrismaEmbedding): Embedding => ({
  id: e.id,
  vector: e.vector,
  artefactId: e.artefactId,
});

const mapGeneration = (g: PrismaGeneration): Generation => ({
  id: g.id,
  prompt: g.prompt,
  image_url: g.image_url,
  artefact: g.artefactId,
  scene: g.sceneId,
});

// ───────────────────────────────────────────────────────────────────
// DB SERVICE IMPLEMENTATION
// ───────────────────────────────────────────────────────────────────

export const dbService: DBService = {
  // ───────── ARTEFACT ─────────
  createArtefact: async (data: Omit<Artefact, "id">): Promise<Artefact> => {
    const created: ArtefactWithEmbedding = await prisma.artefact.create({
      data: {
        id: uuidv4(),
        title: data.title,
        text: data.text,
        region: data.region,
        approx_date: data.approx_date,
        citation: data.citation,
      },
      include: {
        embedding: true,
      },
    });
    return mapArtefact(created);
  },

  getArtefactById: async (id: ArtefactId): Promise<Artefact | null> => {
    const artefact: ArtefactWithEmbedding | null =
      await prisma.artefact.findUnique({
        where: { id },
        include: { embedding: true },
      });
    return artefact ? mapArtefact(artefact) : null;
  },

  getAllArtefacts: async (): Promise<Artefact[]> => {
    const artefacts: ArtefactWithEmbedding[] = await prisma.artefact.findMany({
      include: { embedding: true },
    });
    return artefacts.map(mapArtefact);
  },

  updateArtefact: async (
    id: ArtefactId,
    data: Partial<Artefact>
  ): Promise<Artefact> => {
    const updated: ArtefactWithEmbedding = await prisma.artefact.update({
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
    const deleted: ArtefactWithEmbedding = await prisma.artefact.delete({
      where: { id },
      include: { embedding: true },
    });
    return mapArtefact(deleted);
  },

  // ───────── SCENE ─────────
  createScene: async (data: Scene): Promise<Scene> => {
    const {
      artefact: artefactId,
      experience: experienceId,
      generation,
      ...rest
    } = data;
    const created: SceneWithGeneration = await prisma.scene.create({
      data: {
        id: uuidv4(),
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
    const scene: SceneWithGeneration | null = await prisma.scene.findUnique({
      where: { id },
      include: { generation: true },
    });
    return scene ? mapScene(scene) : null;
  },

  getAllScenes: async (): Promise<Scene[]> => {
    const scenes: SceneWithGeneration[] = await prisma.scene.findMany({
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
    const updated: SceneWithGeneration = await prisma.scene.update({
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
    const deleted: SceneWithGeneration = await prisma.scene.delete({
      where: { id },
      include: { generation: true },
    });
    return mapScene(deleted);
  },

  // ───────── EXPERIENCE ─────────
  createExperience: async (
    data: Omit<Experience, "id" | "scenes">
  ): Promise<Experience> => {
    const created: ExperienceWithScenes = await prisma.experience.create({
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
    const experience: ExperienceWithScenes | null =
      await prisma.experience.findUnique({
        where: { id },
        include: { scenes: true },
      });
    return experience ? mapExperience(experience) : null;
  },

  getAllExperiences: async (): Promise<Experience[]> => {
    const experiences: ExperienceWithScenes[] =
      await prisma.experience.findMany({
        include: { scenes: true },
      });
    return experiences.map(mapExperience);
  },

  updateExperience: async (
    id: ExperienceId,
    data: Partial<Omit<Experience, "id" | "scenes">>
  ): Promise<Experience> => {
    const updated: ExperienceWithScenes = await prisma.experience.update({
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
    const deleted: ExperienceWithScenes = await prisma.experience.delete({
      where: { id },
      include: { scenes: true },
    });
    return mapExperience(deleted);
  },

  // ───────── EMBEDDING ─────────
  createEmbedding: async (data: Omit<Embedding, "id">): Promise<Embedding> => {
    const created = await prisma.embedding.create({
      data: {
        id: uuidv4(),
        text: "", // Required by Prisma schema
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

  // ───────── GENERATION ─────────
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
