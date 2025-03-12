// src/services/dbService.ts

import { prisma } from "../prisma/index";
import { DBService } from "./interface"; // or the same file if you prefer
import { Artefact, ArtefactId } from "@ontothesia/types/artefact";
import { Scene, SceneId } from "@ontothesia/types/scene";
import { Experience, ExperienceId } from "@ontothesia/types/experience";
import { Embedding, EmbeddingId } from "@ontothesia/types/embedding";
import { v4 as uuidv4 } from "uuid";
import { Generation } from "@ontothesia/types/generation";

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

    return artefacts.map((artefact: Artefact) => {
      if (!artefact.embedding) {
        throw new Error(`Embedding missing for artefact ${artefact.id}`);
      }
      return {
        ...artefact,
        embedding: artefact.embedding,
      };
    });
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
        generation: {
          connect: { id: generation },
        },
      },
      include: {
        artefact: true,
      },
    });
    return {
      ...created,
      artefact: created.artefactId || "",
      experience: created.experienceId || "",
      generation: generation || "",
      video_url: created.video_url || "",
    };
  },
  getSceneById: async (id: SceneId): Promise<Scene | null> => {
    const scene = await prisma.scene.findUnique({
      where: { id },
      include: {
        generation: true,
      },
    });
    if (!scene) return null;
    return {
      ...scene,
      artefact: scene.artefactId,
      experience: scene.experienceId || "",
      video_url: scene.video_url || "",
      generation: scene.generation?.id || "",
    };
  },
  getAllScenes: async (): Promise<Scene[]> => {
    const scenes = await prisma.scene.findMany({
      include: {
        artefact: true,
        generation: true,
      },
    });
    return scenes.map((scene: Scene) => ({
      ...scene,
      artefact: scene.artefact,
      experience: scene.experience,
      video_url: scene.video_url || "",
      generation: scene.generation,
    }));
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
      include: {
        artefact: true,
        generation: true,
      },
    });
    return {
      ...updated,
      artefact: updated.artefactId || "",
      experience: updated.experienceId || "",
      generation: updated.generation?.id || "",
      video_url: updated.video_url || "",
    };
  },
  deleteScene: async (id: SceneId): Promise<Scene> => {
    const deleted = await prisma.scene.delete({
      where: { id },
      include: {
        artefact: true,
        generation: true,
      },
    });
    return {
      ...deleted,
      artefact: deleted.artefactId || "",
      experience: deleted.experienceId || "",
      video_url: deleted.video_url || "",
      generation: deleted.generation?.id || "",
    };
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
      include: {
        scenes: true,
      },
    });
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      visible: created.visible as boolean,
      image_url: created.image_url,
      scenes: created.scenes,
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
      id: experience.id,
      title: experience.title,
      description: experience.description,
      visible: experience.visible as boolean,
      image_url: experience.image_url,
      scenes: experience.scenes,
    };
  },
  getAllExperiences: async (): Promise<Experience[]> => {
    const experiences = await prisma.experience.findMany({
      include: {
        scenes: true,
      },
    });
    return experiences.map((exp: Experience) => {
      return {
        id: exp.id,
        title: exp.title,
        description: exp.description,
        visible: exp.visible,
        image_url: exp.image_url,
        scenes: exp.scenes,
      };
    });
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
      include: {
        scenes: true,
      },
    });
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      visible: updated.visible as boolean,
      image_url: updated.image_url,
      scenes: updated.scenes,
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
      id: deleted.id,
      title: deleted.title,
      description: deleted.description,
      visible: deleted.visible as boolean,
      image_url: deleted.image_url,
      scenes: deleted.scenes,
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

  // ───────────────────────────────────────────────────────────────────
  // GENERATION
  // ───────────────────────────────────────────────────────────────────
  createGeneration: async (
    data: Omit<Generation, "id">
  ): Promise<Generation> => {
    const created = await prisma.generation.create({
      data: {
        id: crypto.randomUUID(),
        image_url: data.image_url,
        prompt: data.prompt,
        artefactId: data.artefact,
        sceneId: data.scene,
      },
      include: {
        artefact: true,
        scene: true,
      },
    });
    return {
      ...created,
      artefact: created.artefactId,
      scene: created.sceneId,
    };
  },
  getAllGenerations: async (): Promise<Generation[]> => {
    const generations = await prisma.generation.findMany({
      include: {
        artefact: true,
        scene: true,
      },
    });
    return generations.map((gen: Generation) => ({
      ...gen,
      artefact: gen.artefact,
      scene: gen.scene,
    }));
  },
};
