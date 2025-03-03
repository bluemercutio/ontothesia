import { Scene } from "@/types/scene";
import { createStableDiffusionGeneration } from "@/services/stable_diffusion/client";
import { scenes } from "../prisma/scenes";
import fs from "node:fs";
import { writeFile } from "node:fs/promises";
import { artefacts } from "../prisma/artefacts";
import dotenv from "dotenv";

import { Generation } from "@/types/generation";
import path from "path";
import axios from "axios";
import { Artefact } from "@/types/artefact";

// Add this near the top of the file, before any code that uses process.env
dotenv.config();

/**
 * Downloads an image from the given URL and returns a Buffer.
 */
export const downloadImage = async (url: string): Promise<Buffer> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download image with status ${res.status}`);
  }
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer);
};

export const createGenerationsForScenes = async (scenes: Scene[]) => {
  try {
    const generations = scenes.map(async (scene) => {
      const prompt = createPrompt(scene);
      const generation = await createStableDiffusionGeneration(prompt);
      return generation;
    });
    return Promise.all(generations);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

const createPrompt = (scene: Scene) => {
  const artefact = artefacts.find(
    (artefact: Artefact) => artefact.id === scene.artefact
  );
  if (!artefact) {
    throw new Error(`No artefact found for id: ${scene.artefact}`);
  }

  return `
        Create an image of a scene that depicts in some way the ARTEFACT_TEXT. 
        The CONTEXT should inform the depiction of the scene and the VISUALISATION GUIDE will inform how to depict the ARTEFACT_TEXT:

        General Instructions:
        The image should fade into a black background in a smokey way. No part of the representation should touch the borders.

        You can be abstract but should only do so if the text gestures towards abstraction

        Your goal is focus on a centeral subject with a clear forground and a background that disappears into black #000000

        Do not create any text in the image.

        TITLE: "${scene.title}",
        ARTEFACT_TEXT: "${artefact.text}",
        CONTEXT: "${scene.context}",
        VISUALISATION_GUIDE: "${scene.visualisation}"`;
};

const createGenerationForScene = async (prompt: string) => {
  try {
    const generation = await createStableDiffusionGeneration(prompt);

    return generation;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

// Function to download the image and save it
const downloadAndSaveImage = async (imageUrl: string) => {
  try {
    if (process.env.NEXT_PUBLIC_GENERATIONS_DIR) {
      if (!fs.existsSync(process.env.NEXT_PUBLIC_GENERATIONS_DIR)) {
        fs.mkdirSync(process.env.NEXT_PUBLIC_GENERATIONS_DIR, {
          recursive: true,
        });
      }

      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      const fileName = `${Date.now()}.png`;
      const absolutePath = path.join(
        process.env.NEXT_PUBLIC_GENERATIONS_DIR,
        fileName
      );

      // Save the image using absolute path
      fs.writeFileSync(absolutePath, response.data);

      // Return just the filename - we'll construct the env path when saving to generations.ts
      return fileName;
    } else {
      throw new Error();
    }
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

export const mainSingle = async () => {
  try {
    if (!process.env.NEXT_PUBLIC_GENERATIONS_DIR || !process.env.PRISMA_DIR) {
      throw new Error("NEXT_PUBLIC_GENERATIONS_DIR or PRISMA_DIR is not set");
    }
    const scene = scenes[14];
    const prompt = createPrompt(scene);
    const generationRaw = await createGenerationForScene(prompt);
    const imageUrl = generationRaw.output[0]; // Extract image URL

    const fileName = await downloadAndSaveImage(imageUrl);
    if (!fileName) {
      throw new Error("No image found");
    }
    const generation: Generation = {
      id: `generation_${generationRaw.id}`.toString(),
      prompt: prompt,
      image_url: `process.env.NEXT_PUBLIC_GENERATIONS_DIR + "/${fileName}"`, // Changed to string concatenation
      artefact: scene.artefact,
      scene: scene.id,
    };

    const generationFilePath = path.join(
      process.env.PRISMA_DIR,
      `generations.ts`.toString()
    );

    // Modified to avoid JSON.stringify escaping
    const generationFileContent = `
    import dotenv from "dotenv";
    dotenv.config();
    import { Generation } from "../src/types/generation";
    export const generations: Generation[] = [
      {
        id: "${generation.id}",
        prompt: ${JSON.stringify(generation.prompt)},
        image_url: ${generation.image_url},
        artefact: "${generation.artefact}",
        scene: "${generation.scene}"
      }
    ];`;

    await writeFile(generationFilePath, generationFileContent, "utf8");
  } catch (error) {
    console.error(error);
  }
};

export const mainMultiple = async () => {
  try {
    if (!process.env.NEXT_PUBLIC_GENERATIONS_DIR || !process.env.PRISMA_DIR) {
      throw new Error("NEXT_PUBLIC_GENERATIONS_DIR or PRISMA_DIR is not set");
    }

    const generationPromises = scenes.map(async (scene: Scene) => {
      const prompt = createPrompt(scene);
      const generationRaw = await createGenerationForScene(prompt);
      const imageUrl = generationRaw.output[0]; // Extract image URL

      const fileName = await downloadAndSaveImage(imageUrl);
      if (!fileName) {
        throw new Error("No image found");
      }

      const generation: Generation = {
        id: `generation_${scene.artefact}`.toString(),
        prompt: prompt,
        image_url: fileName,
        artefact: scene.artefact,
        scene: scene.id,
      };
      return generation;
    });

    const generations = await Promise.all(generationPromises);

    const generationFilePath = path.join(
      process.env.PRISMA_DIR,
      `generations.ts`.toString()
    );

    // Modified to avoid JSON.stringify escaping
    const generationFileContent = `
    import dotenv from "dotenv";
    dotenv.config();
    import { Generation } from "../src/types/generation";
    export const generations: Generation[] = ${JSON.stringify(
      generations,
      null,
      2
    ).replace(/"image_url": "([^"]+)"/g, (_, p1) => `"image_url": ${p1}`)};`;

    await writeFile(generationFilePath, generationFileContent, "utf8");
  } catch (error) {
    console.error(error);
  }
};

mainMultiple();
