import { PrismaClient } from "@prisma/client";
import { artefacts } from "./artefacts";
import { embeddings } from "./embeddings";
import { scenes } from "./scenes";
import { experiences } from "./experiences";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Delete existing records in correct order (respecting foreign key constraints)
  await prisma.scene.deleteMany();
  await prisma.embedding.deleteMany();
  await prisma.artefact.deleteMany();

  for (const artefact of artefacts) {
    const embedding = embeddings.find((e) => e.artefactId === artefact.id);
    if (!embedding) {
      console.log(
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
      console.log(
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

  for (const scene of scenes) {
    const createdScene = await prisma.scene.create({
      data: {
        id: scene.id,
        title: scene.title,
        context: scene.context,
        artefactId: scene.artefact,
        image_url:
          "https://img.freepik.com/free-psd/cosmic-nebula-celestial-tapestry-stars-gas_632498-24057.jpg?semt=ais_hybrid",
        video_url: scene.video_url || "",
        visualisation: scene.visualisation,
        experienceId: null,
      },
    });

    console.log(`Created scene with id: ${createdScene.id}`);
  }

  for (const experience of experiences) {
    const createdExperience = await prisma.experience.create({
      data: {
        id: experience.id,
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
