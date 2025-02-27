import { PrismaClient } from "@prisma/client";
import { artefacts } from "./artefacts";
import { embeddings } from "./embeddings";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Delete existing records in reverse order of dependencies
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
        vector: embedding.embedding,
        artefactId: createdArtefact.id,
      },
    });

    console.log(`Created artefact with id: ${createdArtefact.id}`);
    console.log(`Created embedding with id: ${createdEmbedding.id}`);
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
