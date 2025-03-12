import { Scene } from "@/types/scene";
import { createStableDiffusionGeneration } from "@/services/stable_diffusion/client";
// import { scenes } from "../prisma/scenes";
import fs from "node:fs";
import { writeFile } from "node:fs/promises";
import { artefacts } from "../prisma/artefacts";
import dotenv from "dotenv";

import { Generation } from "@/types/generation";
import path from "path";
import axios from "axios";
import { Artefact } from "@/types/artefact";
import { v4 as uuidv4 } from "uuid";

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

export const createGenerationsForScenes = async (
  scenes: Scene[],
  prompt_index: number
) => {
  try {
    const generations = scenes.map(async (scene) => {
      const prompt = createPrompt(scene, prompt_index);
      const generation = await createStableDiffusionGeneration(prompt);
      return generation;
    });
    return Promise.all(generations);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

const createPrompt = (scene: Scene, prompt_index: number) => {
  if (!process.env.NEXT_PUBLIC_PRISMA_DIR) {
    throw Error("No prisma dir env found");
  }
  const artefact = artefacts.find(
    (artefact: Artefact) => artefact.id === scene.artefact
  );
  if (!artefact) {
    throw new Error(`No artefact found for id: ${scene.artefact}`);
  }

  const prompts = JSON.parse(
    fs.readFileSync(
      path.join(process.env.NEXT_PUBLIC_PRISMA_DIR, "../prisma/prompts.json"),
      "utf-8"
    )
  );

  return `

        ${prompts[prompt_index].prompt}
        TITLE: "${scene.title}",
        PRIMARY_TEXT: "${artefact.text}",
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
        "/images",
        fileName
      );

      // Save the image using absolute path
      fs.writeFileSync(absolutePath, response.data as Buffer);

      // Return just the filename - we'll construct the env path when saving to generations.ts
      return fileName;
    } else {
      throw new Error();
    }
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

const getNextGenerationFilePath = (directory: string): string => {
  // Get list of existing generation files
  const files = fs.readdirSync(directory);
  const generationFiles = files.filter((file) =>
    file.match(/^generations_\d+\.json$/)
  );

  // Find the next number to use
  const nextNumber =
    generationFiles.length > 0
      ? Math.max(
          ...generationFiles.map((file) =>
            parseInt(file.match(/^generations_(\d+)\.json$/)?.[1] || "0")
          )
        ) + 1
      : 1;

  return path.join(directory, `generations_${nextNumber}.json`);
};

export const createGeneration = async (
  scenes: Scene[],
  prompt_index: number
) => {
  try {
    if (
      !process.env.NEXT_PUBLIC_GENERATIONS_DIR ||
      !process.env.NEXT_PUBLIC_PRISMA_DIR
    ) {
      throw new Error(
        "NEXT_PUBLIC_GENERATIONS_DIR or NEXT_PUBLIC_PRISMA_DIR is not set"
      );
    }
    const scene = scenes[14];
    const prompt = createPrompt(scene, prompt_index);
    const generationRaw = await createGenerationForScene(prompt);
    const imageUrl = generationRaw.output[0]; // Extract image URL

    const fileName = await downloadAndSaveImage(imageUrl);
    if (!fileName) {
      throw new Error("No image found");
    }
    const generation: Generation = {
      id: uuidv4(),
      prompt: prompt,
      image_url: fileName,
      artefact: scene.artefact,
      scene: scene.id,
    };

    const generationFilePath = getNextGenerationFilePath(
      process.env.NEXT_PUBLIC_GENERATIONS_DIR
    );

    // Write as JSON file
    await writeFile(
      generationFilePath,
      JSON.stringify([generation], null, 2),
      "utf8"
    );
  } catch (error) {
    console.error(error);
  }
};

export const createGenerations = async (
  scenes: Scene[],
  prompt_index: number
) => {
  try {
    if (
      !process.env.NEXT_PUBLIC_GENERATIONS_DIR ||
      !process.env.NEXT_PUBLIC_GENERATIONS_DIR ||
      !process.env.NEXT_PUBLIC_PRISMA_DIR
    ) {
      throw new Error(
        "NEXT_PUBLIC_GENERATIONS_DIR or NEXT_PUBLIC_PRISMA_DIR is not set"
      );
    }

    const generationPromises = scenes.map(async (scene: Scene) => {
      const prompt = createPrompt(scene, prompt_index);
      const generationRaw = await createGenerationForScene(prompt);
      const imageUrl = generationRaw.output[0]; // Extract image URL

      const fileName = await downloadAndSaveImage(imageUrl);
      if (!fileName) {
        throw new Error("No image found");
      }

      const generation: Generation = {
        id: uuidv4(),
        prompt: prompt,
        image_url: fileName,
        artefact: scene.artefact,
        scene: scene.id,
      };
      return generation;
    });

    const generations = await Promise.all(generationPromises);
    const generationFilePath = getNextGenerationFilePath(
      process.env.NEXT_PUBLIC_GENERATIONS_DIR
    );

    // Write as JSON file
    await writeFile(
      generationFilePath,
      JSON.stringify(generations, null, 2),
      "utf8"
    );
    return generations;
  } catch (error) {
    console.error(error);
  }
};
