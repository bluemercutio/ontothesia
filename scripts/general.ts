import { createCompletion } from "@/services/open_ai/client";
import { Artefact } from "@/types/artefact";
import { Scene } from "@/types/scene";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { artefacts } from "../prisma/artefacts";
import { createGenerations } from "./generation";
import { Generation } from "@/types/generation";
import { Experience } from "@/types/experience";

dotenv.config();

const getNextSceneFileName = (directory: string): string => {
  const files = fs.readdirSync(directory);
  const sceneFiles = files.filter((file) => file.match(/^scenes_\d+\.json$/));
  const nextNumber = sceneFiles.length;
  return path.join(directory, `scenes_${nextNumber}.json`);
};

const createSceneFile = async (scenes: Scene[]) => {
  if (!process.env.NEXT_PUBLIC_PRISMA_DIR) {
    throw new Error("NEXT_PUBLIC_PRISMA_DIR is not set");
  }
  const outputFilePath = getNextSceneFileName(
    path.join(process.env.NEXT_PUBLIC_PRISMA_DIR, "/data/scenes")
  );
  const fileContent = JSON.stringify(scenes, null, 2);
  fs.writeFileSync(outputFilePath, fileContent, "utf-8");
  console.log(`Scenes have been generated and saved to ${outputFilePath}`);
};

const createExperienceFile = async (experience: Experience) => {
  if (!process.env.NEXT_PUBLIC_PRISMA_DIR) {
    throw new Error("NEXT_PUBLIC_PRISMA_DIR is not set");
  }
  const outputFilePath = getNextExperienceFileName(
    path.join(process.env.NEXT_PUBLIC_PRISMA_DIR, "/data/experiences")
  );
  const fileContent = JSON.stringify(experience, null, 2);
  fs.writeFileSync(outputFilePath, fileContent, "utf-8");
  console.log(`Experience has been generated and saved to ${outputFilePath}`);
};

const getNextExperienceFileName = (directory: string): string => {
  const files = fs.readdirSync(directory);
  const sceneFiles = files.filter((file) =>
    file.match(/^experiences_\d+\.json$/)
  );
  const nextNumber = sceneFiles.length;
  return path.join(directory, `experiences_${nextNumber}.json`);
};

const createScene = async (
  artefact: Artefact,
  prompt_index: number
): Promise<Scene> => {
  try {
    if (!process.env.NEXT_PUBLIC_PRISMA_DIR) {
      throw new Error("NEXT_PUBLIC_PRISMA_DIR is not set");
    }
    const prompts = JSON.parse(
      fs.readFileSync(
        path.join(process.env.NEXT_PUBLIC_PRISMA_DIR, "../prisma/prompts.json"),
        "utf-8"
      )
    );

    const context =
      "You are an assistant designed to ingest an artefact and then generate about 50 words of context for the artefact. Return only the context, no other text.";

    const visualisation = `You are an assistant designed to produce a visualisation guide for a stable diffusion text to image model so that it can create an image. The guide should be a maximum of 50 words. Return only the visualisation, no other text. USe the following prompt to guide your visualisation: ${prompts[prompt_index].prompt}`;

    const contextCompletion = await createCompletion(artefact.text, context);
    const visualisationCompletion = await createCompletion(
      artefact.text,
      visualisation
    );

    console.log(
      "Generated context and visualisation for artefact: ",
      artefact.id
    );

    const scene: Scene = {
      id: uuidv4(),
      title: artefact.title,
      context: contextCompletion,
      image_url: "",
      video_url: "",
      artefact: artefact.id,
      visualisation: visualisationCompletion,
      experience: "",
      generation: "",
    };

    return scene;
  } catch (error) {
    console.error("Error creating scene: ", error);
    throw error;
  }
};

const createScenes = async (artefacts: Artefact[], prompt_index: number) => {
  try {
    if (!process.env.NEXT_PUBLIC_PRISMA_DIR) {
      throw new Error("NEXT_PUBLIC_PRISMA_DIR is not set");
    }
    const scenes: Scene[] = [];

    for (const artefact of artefacts) {
      const scene = await createScene(artefact, prompt_index);
      console.log("Created scene for artefact with ID: ", scene.id);
      scenes.push(scene);
    }
    return scenes;
  } catch (error) {
    console.error("Error creating scenes: ", error);
    throw error;
  }
};

const createScenesWithGenerations = (
  scenes: Scene[],
  generations: Generation[]
): Scene[] => {
  const scenesWithGenerations = scenes.map((scene) => {
    const generation = generations.find(
      (generation) => generation.scene === scene.id
    );
    if (!generation) {
      throw new Error("Generation is not set");
    }
    return {
      ...scene,
      image_url: generation.image_url,
      generation: generation.id,
    };
  });
  return scenesWithGenerations;
};

export const createExperience = async () => {
  const title = "Experience Title";
  const description = "Experience Description";

  const experience: Experience = {
    id: uuidv4(),
    visible: true,
    title: title,
    description: description,
    image_url: "",
    scenes: [],
  };

  return experience;
};

const createExperienceWithScenes = (
  experience: Experience,
  scenes: Scene[]
) => {
  const experienceWithScenes: Experience = {
    ...experience,
    scenes: scenes.map((scene) => scene.id),
  };
  return experienceWithScenes;
};

const main = async () => {
  const PROMPT_INDEX: number = 6;
  if (!process.env.NEXT_PUBLIC_PRISMA_DIR) {
    throw new Error("NEXT_PUBLIC_PRISMA_DIR is not set");
  }
  console.log("Creating experience");
  const experience = await createExperience();

  console.log("Creating scenes");
  const scenes = await createScenes(artefacts, PROMPT_INDEX);

  console.log("Creating generations");
  const generations = await createGenerations(scenes, PROMPT_INDEX);

  const experienceWithScenes = createExperienceWithScenes(experience, scenes);

  console.log("Creating scenes with generations");
  if (!generations) {
    throw new Error("Generations are not set");
  }

  const scenesWithGenerations = createScenesWithGenerations(
    scenes,
    generations
  );

  console.log("Creating scene file");
  await createSceneFile(scenesWithGenerations);

  console.log("Creating experience file");
  await createExperienceFile(experienceWithScenes);

  console.log(scenes);
};

main();
