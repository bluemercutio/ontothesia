// src/services/dbService.ts

import { PrismaClient } from "@prisma/client";
import { DBService } from "./interface"; // or the same file if you prefer
import { Artefact, ArtefactId } from "../../app/types/artefact";
import { Scene, SceneId } from "../../app/types/scene";
import { Experience, ExperienceId } from "../../app/types/experience";

const prisma = new PrismaClient();

export const dbService: DBService = {
  // ───────────────────────────────────────────────────────────────────
  // ARTEFACT
  // ───────────────────────────────────────────────────────────────────
  createArtefact: async (data: Omit<Artefact, "id">): Promise<Artefact> => {
    return prisma.artefact.create({ data });
  },
  getArtefactById: async (id: ArtefactId): Promise<Artefact | null> => {
    return prisma.artefact.findUnique({ where: { id } });
  },
  getAllArtefacts: async (): Promise<Artefact[]> => {
    return prisma.artefact.findMany();
  },
  updateArtefact: async (
    id: ArtefactId,
    data: Partial<Artefact>
  ): Promise<Artefact> => {
    return prisma.artefact.update({ where: { id }, data });
  },
  deleteArtefact: async (id: ArtefactId): Promise<Artefact> => {
    return prisma.artefact.delete({ where: { id } });
  },

  // ───────────────────────────────────────────────────────────────────
  // SCENE
  // ───────────────────────────────────────────────────────────────────
  createScene: async (data: Omit<Scene, "id">): Promise<Scene> => {
    return prisma.scene.create({ data });
  },
  getSceneById: async (id: SceneId): Promise<Scene | null> => {
    return prisma.scene.findUnique({ where: { id } });
  },
  getAllScenes: async (): Promise<Scene[]> => {
    return prisma.scene.findMany();
  },
  updateScene: async (id: SceneId, data: Partial<Scene>): Promise<Scene> => {
    return prisma.scene.update({ where: { id }, data });
  },
  deleteScene: async (id: SceneId): Promise<Scene> => {
    return prisma.scene.delete({ where: { id } });
  },

  // ───────────────────────────────────────────────────────────────────
  // EXPERIENCE
  // ───────────────────────────────────────────────────────────────────
  createExperience: async (
    data: Omit<Experience, "id">
  ): Promise<Experience> => {
    return prisma.experience.create({ data });
  },
  getExperienceById: async (id: ExperienceId): Promise<Experience | null> => {
    return prisma.experience.findUnique({ where: { id } });
  },
  getAllExperiences: async (): Promise<Experience[]> => {
    return prisma.experience.findMany();
  },
  updateExperience: async (
    id: ExperienceId,
    data: Partial<Experience>
  ): Promise<Experience> => {
    return prisma.experience.update({ where: { id }, data });
  },
  deleteExperience: async (id: ExperienceId): Promise<Experience> => {
    return prisma.experience.delete({ where: { id } });
  },
};
