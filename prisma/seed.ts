import { PrismaClient } from "@prisma/client";
import { artefacts } from "./artefacts";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Delete existing records (optional, but helps prevent duplicates)
  await prisma.artefact.deleteMany();

  for (const artefact of artefacts) {
    const result = await prisma.artefact.create({
      data: {
        id: artefact.id,
        title: artefact.title,
        region: artefact.region,
        approx_date: artefact.approx_date,
        citation: artefact.citation,
        text: artefact.text,
      },
    });
    console.log(`Created artefact with id: ${result.id}`);
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
