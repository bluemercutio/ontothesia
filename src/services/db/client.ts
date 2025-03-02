// src/services/dbService.ts

import { PrismaClient } from "@prisma/client";
import { DBService } from "./interface"; // or the same file if you prefer
import { Artefact, ArtefactId } from "../../types/artefact";
import { Scene, SceneId } from "../../types/scene";
import { Experience, ExperienceId } from "../../types/experience";
import { Embedding, EmbeddingId } from "@/types/embedding";
import crypto from "crypto";

const prisma = new PrismaClient();

export const dbService: DBService = {
  // ───────────────────────────────────────────────────────────────────
  // ARTEFACT
  // ───────────────────────────────────────────────────────────────────
  createArtefact: async (data: Omit<Artefact, "id">): Promise<Artefact> => {
    const created = await prisma.artefact.create({
      data: {
        id: crypto.randomUUID(),
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
    return {
      ...created,
      embedding: created.embedding?.id || "",
    };
  },
  getArtefactById: async (id: ArtefactId): Promise<Artefact | null> => {
    const artefact = await prisma.artefact.findUnique({
      where: { id },
      include: {
        embedding: true,
      },
    });
    if (!artefact) return null;
    return {
      ...artefact,
      embedding: artefact.embedding?.id || "",
    };
  },
  getAllArtefacts: async (): Promise<Artefact[]> => {
    const artefacts = await prisma.artefact.findMany({
      include: {
        embedding: true,
      },
    });
    return artefacts.map((artefact) => ({
      ...artefact,
      embedding: artefact.embedding?.id || "",
    }));
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
      include: {
        embedding: true,
      },
    });
    return {
      ...updated,
      embedding: updated.embedding?.id || "",
    };
  },
  deleteArtefact: async (id: ArtefactId): Promise<Artefact> => {
    const deleted = await prisma.artefact.delete({
      where: { id },
      include: {
        embedding: true,
      },
    });
    return {
      ...deleted,
      embedding: deleted.embedding?.id || "",
    };
  },

  // ───────────────────────────────────────────────────────────────────
  // SCENE
  // ───────────────────────────────────────────────────────────────────
  createScene: async (data: Omit<Scene, "id">): Promise<Scene> => {
    const { artefact: artefactId, ...rest } = data;
    const created = await prisma.scene.create({
      data: {
        ...rest,
        artefactId,
      },
      include: {
        artefact: true,
      },
    });
    return {
      ...created,
      artefact: created.artefactId,
    };
  },
  getSceneById: async (id: SceneId): Promise<Scene | null> => {
    const scene = await prisma.scene.findUnique({
      where: { id },
      include: {
        artefact: true,
      },
    });
    if (!scene) return null;
    return {
      ...scene,
      artefact: scene.artefactId,
    };
  },
  getAllScenes: async (): Promise<Scene[]> => {
    const scenes = await prisma.scene.findMany({
      include: {
        artefact: true,
      },
    });
    return scenes.map((scene) => ({
      ...scene,
      artefact: scene.artefactId,
    }));
  },
  updateScene: async (id: SceneId, data: Partial<Scene>): Promise<Scene> => {
    const { artefact: artefactId, ...rest } = data;
    const updated = await prisma.scene.update({
      where: { id },
      data: {
        ...rest,
        ...(artefactId && { artefactId }),
      },
      include: {
        artefact: true,
      },
    });
    return {
      ...updated,
      artefact: updated.artefactId,
    };
  },
  deleteScene: async (id: SceneId): Promise<Scene> => {
    const deleted = await prisma.scene.delete({
      where: { id },
      include: {
        artefact: true,
      },
    });
    return {
      ...deleted,
      artefact: deleted.artefactId,
    };
  },

  // ───────────────────────────────────────────────────────────────────
  // EXPERIENCE
  // ───────────────────────────────────────────────────────────────────
  createExperience: async (
    data: Omit<Experience, "id">
  ): Promise<Experience> => {
    const created = await prisma.experience.create({
      data: {
        title: data.title,
        description: data.description,
        image_url: data.image_url,
      },
      include: {
        scenes: true,
      },
    });
    return {
      ...created,
      scenes: created.scenes.map((scene) => scene.id),
    };
  },
  getExperienceById: async (id: ExperienceId): Promise<Experience | null> => {
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        scenes: true,
      },
    });
    if (!experience) return null;
    return {
      ...experience,
      scenes: experience.scenes.map((scene) => scene.id),
    };
  },
  getAllExperiences: async (): Promise<Experience[]> => {
    const experiences = await prisma.experience.findMany({
      include: {
        scenes: true,
      },
    });
    return experiences.map((exp) => ({
      ...exp,
      scenes: exp.scenes.map((scene) => scene.id),
    }));
  },
  updateExperience: async (
    id: ExperienceId,
    data: Partial<Experience>
  ): Promise<Experience> => {
    const updated = await prisma.experience.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image_url: data.image_url,
      },
      include: {
        scenes: true,
      },
    });
    return {
      ...updated,
      scenes: updated.scenes.map((scene) => scene.id),
    };
  },
  deleteExperience: async (id: ExperienceId): Promise<Experience> => {
    const deleted = await prisma.experience.delete({
      where: { id },
      include: {
        scenes: true,
      },
    });
    return {
      ...deleted,
      scenes: deleted.scenes.map((scene) => scene.id),
    };
  },

  // ───────────────────────────────────────────────────────────────────
  // EMBEDDING
  // ───────────────────────────────────────────────────────────────────

  createEmbedding: async (data: Omit<Embedding, "id">): Promise<Embedding> => {
    const { artefactId, vector } = data;
    return prisma.embedding.create({
      data: {
        id: crypto.randomUUID(),
        text: "", // Required by Prisma schema
        vector,
        artefactId,
      },
    });
  },
  getEmbeddingById: async (id: EmbeddingId): Promise<Embedding | null> => {
    return prisma.embedding.findUnique({ where: { id } });
  },
  getAllEmbeddings: async (): Promise<Embedding[]> => {
    return prisma.embedding.findMany();
  },
  getEmbeddingByArtefactId: async (
    artefactId: ArtefactId
  ): Promise<Embedding | null> => {
    return prisma.embedding.findFirst({ where: { artefactId } });
  },
};
