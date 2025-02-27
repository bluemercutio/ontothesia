// import "dotenv/config";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import fs from "fs/promises";
// import { artefacts } from "../prisma/artefacts";
// import { createEmbedding } from "../src/services/open_ai/client";
// import { PrismaClient } from "@prisma/client";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const prisma = new PrismaClient();

// const main = async () => {
//   try {
//     const results = [];

//     for (const item of artefacts) {
//       if (!item.text) {
//         console.log(`Skipping artefact ${item.id} because it has no text`);
//         continue;
//       }
//       const embedding = await createEmbedding(item.text);
//       const result = {
//         id: `${item.id}-embedding`,
//         text: item.text,
//         artefactId: item.id,
//         embedding: embedding,
//       };
//       results.push(result);

//       // Seed the embedding into the database
//       await prisma.embedding.upsert({
//         where: { id: result.id },
//         update: {
//           text: result.text,
//           embedding: result.embedding,
//           artefactId: result.artefactId,
//         },
//         create: {
//           id: result.id,
//           text: result.text,
//           embedding: result.embedding,
//           artefactId: result.artefactId,
//         },
//       });
//     }

//     // Still save the embeddings file for reference
//     const fileContent = `export const embeddings = ${JSON.stringify(
//       results,
//       null,
//       2
//     )} as const;\n`;
//     await fs.writeFile(join(__dirname, "embeddings.ts"), fileContent, "utf-8");

//     console.log(
//       "Embeddings have been generated, saved to file, and seeded to database"
//     );
//   } catch (err) {
//     console.error("Failed to create or seed embeddings:", err);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// main();
