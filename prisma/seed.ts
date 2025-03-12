import { PrismaClient } from "@prisma/client";
import { artefacts } from "./artefacts";
import { embeddings } from "./embeddings";
import fs from "node:fs";

import path from "path";
import { Experience } from "@ontothesia/types/experience";
import { Scene } from "@ontothesia/types/scene";
import { Generation } from "@ontothesia/types/generation";
const prisma = new PrismaClient();
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log(
    "process.env.NEXT_PUBLIC_PRISMA_DIR",
    process.env.NEXT_PUBLIC_PRISMA_DIR
  );
  if (!process.env.NEXT_PUBLIC_PRISMA_DIR) {
    throw new Error("NEXT_PUBLIC_PRISMA_DIR is not set");
  }
  console.log("Start seeding...");

  // Delete existing records in correct order (respecting foreign key constraints)
  try {
    await prisma.generation.deleteMany();
    console.log("Deleted all generations");
  } catch {
    console.log("Generation table might not exist yet, continuing...");
  }

  try {
    await prisma.scene.deleteMany();
    console.log("Deleted all scenes");
  } catch {
    console.log("Scene table might not exist yet, continuing...");
  }

  try {
    await prisma.experience.deleteMany();
    console.log("Deleted all experiences");
  } catch {
    console.log("Experience table might not exist yet, continuing...");
  }

  try {
    await prisma.embedding.deleteMany();
    console.log("Deleted all embeddings");
  } catch {
    console.log("Embedding table might not exist yet, continuing...");
  }

  try {
    await prisma.artefact.deleteMany();
    console.log("Deleted all artefacts");
  } catch {
    console.log("Artefact table might not exist yet, continuing...");
  }

  for (const artefact of artefacts) {
    const embedding = embeddings.find((e) => e.artefactId === artefact.id);
    if (!embedding) {
      console.warn(
        `No embedding found for artefact ${artefact.id}, skipping...`
      );
      continue;
    }

    if (
      !artefact.id ||
      !artefact.title ||
      !artefact.region ||
      !artefact.approx_date ||
      !artefact.citation ||
      !artefact.text
    ) {
      console.warn(
        `Missing required fields for artefact ${artefact.id}, skipping...`
      );
      continue;
    }

    // First create the artefact
    const createdArtefact = await prisma.artefact.create({
      data: {
        id: artefact.id,
        title: artefact.title,
        region: artefact.region,
        approx_date: artefact.approx_date,
        citation: artefact.citation,
        text: artefact.text,
      },
    });

    // Then create the embedding
    const createdEmbedding = await prisma.embedding.create({
      data: {
        id: embedding.id,
        text: artefact.text,
        vector: [...embedding.embedding],
        artefactId: createdArtefact.id,
      },
    });

    console.log(`Created artefact with id: ${createdArtefact.id}`);
    console.log(`Created embedding with id: ${createdEmbedding.id}`);
  }

  const experienceFiles = fs.readdirSync(
    path.join(process.env.NEXT_PUBLIC_PRISMA_DIR!, "/data/experiences")
  );

  let experiences: Experience[] = [];
  for (const file of experienceFiles) {
    const filePath = path.join(
      process.env.NEXT_PUBLIC_PRISMA_DIR!,
      "/data/experiences",
      file
    );
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) continue;

    const fileContent = fs.readFileSync(filePath, "utf-8");
    try {
      const fileExperiences = JSON.parse(fileContent);
      if (Array.isArray(fileExperiences)) {
        experiences = experiences.concat(fileExperiences);
      } else {
        experiences.push(fileExperiences);
      }
    } catch (error) {
      console.error(`Error parsing experience file ${file}:`, error);
      continue;
    }
  }

  for (const experience of experiences) {
    if (!experience.title || !experience.description) {
      console.warn(`Missing required fields for experience, skipping...`);
      continue;
    }

    const createdExperience = await prisma.experience.create({
      data: {
        id: experience.id,
        visible: experience.visible,
        title: experience.title,
        description: experience.description,
        image_url: experience.image_url || "/images/default_experience.png",
      },
    });

    // Update the scenes to point to this experience
    await prisma.scene.updateMany({
      where: {
        id: {
          in: experience.scenes,
        },
      },
      data: {
        experienceId: createdExperience.id,
      },
    });

    console.log(`Created experience with id: ${createdExperience.id}`);
    console.log(`Updated scenes for experience: ${createdExperience.id}`);
  }

  const sceneFiles = fs.readdirSync(
    path.join(process.env.NEXT_PUBLIC_PRISMA_DIR!, "/data/scenes")
  );

  let scenes: Scene[] = [];
  for (const file of sceneFiles) {
    const filePath = path.join(
      process.env.NEXT_PUBLIC_PRISMA_DIR!,
      "/data/scenes",
      file
    );
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) continue;

    const fileContent = fs.readFileSync(filePath, "utf-8");
    try {
      const fileScenes = JSON.parse(fileContent);
      // Handle both array and single object cases
      if (Array.isArray(fileScenes)) {
        scenes = scenes.concat(fileScenes);
      } else {
        scenes.push(fileScenes);
      }
    } catch (error) {
      console.error(`Error parsing scene file ${file}:`, error);
      continue;
    }
  }

  for (const scene of scenes) {
    // Add validation check

    if (
      !scene.title ||
      !scene.context ||
      !scene.artefact ||
      !scene.visualisation
    ) {
      if (!scene.title) {
        console.warn(`Scene ${scene.id} is missing the title.`);
      }
      if (!scene.context) {
        console.warn(`Scene ${scene.id} is missing the context.`);
      }
      if (!scene.artefact) {
        console.warn(`Scene ${scene.id} is missing the artefact.`);
      }
      if (!scene.visualisation) {
        console.warn(`Scene ${scene.id} is missing the visualisation.`);
      }

      console.warn(`Missing required fields for scene, skipping...`);
      continue;
    }

    const experience = experiences.find((e) => {
      return e.scenes.includes(scene.id);
    });

    if (!experience) {
      console.warn(`No experience found for scene ${scene.id}, skipping...`);
      continue;
    }

    const fetchedExperience = await prisma.experience.findUnique({
      where: {
        id: experience.id,
      },
    });

    const createdScene = await prisma.scene.create({
      data: {
        id: scene.id,
        title: scene.title,
        context: scene.context,
        artefact: {
          connect: {
            id: scene.artefact,
          },
        },
        image_url: scene.image_url,
        video_url: scene.video_url || "",
        visualisation: scene.visualisation,
        experience: {
          connect: {
            id: fetchedExperience?.id,
          },
        },
      },
    });

    console.log(`Created scene with id: ${createdScene.id}`);
  }

  const generationFiles = fs.readdirSync(
    path.join(process.env.NEXT_PUBLIC_PRISMA_DIR!, "/data/generations")
  );

  let generations: Generation[] = [];
  for (const file of generationFiles) {
    const filePath = path.join(
      process.env.NEXT_PUBLIC_PRISMA_DIR!,
      "/data/generations",
      file
    );
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) continue;

    const fileContent = fs.readFileSync(filePath, "utf-8");
    try {
      const fileGenerations = JSON.parse(fileContent);
      if (Array.isArray(fileGenerations)) {
        generations = generations.concat(fileGenerations);
      } else {
        generations.push(fileGenerations);
      }
    } catch (error) {
      console.error(`Error parsing generation file ${file}:`, error);
      continue;
    }
  }

  for (const generation of generations) {
    if (!generation.id || !generation.prompt || !generation.image_url) {
      console.warn(`Missing required fields for generation, skipping...`);
      continue;
    }

    const createdGeneration = await prisma.generation.create({
      data: {
        id: generation.id,
        prompt: generation.prompt,
        image_url: generation.image_url,
        artefact: {
          connect: {
            id: generation.artefact,
          },
        },
        scene: {
          connect: {
            id: generation.scene,
          },
        },
      },
    });

    console.log(`Created generation with id: ${createdGeneration.id}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
