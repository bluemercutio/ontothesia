// import "dotenv/config";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import fs from "fs/promises";
// import { artefacts } from "../prisma/artefacts";
// import { createEmbedding } from "../src/services/open_ai/client";
// import { PrismaClient } from "@prisma/client";

// import { generations } from "../prisma/generations";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const prisma = new PrismaClient();
// // Save the embeddings as JSON for reference
// const getNextFileName = async () => {
//   let counter = 0;
//   while (true) {
//     const fileName = join(__dirname, `embeddings_${counter}.json`);
//     if (
//       !(await fs
//         .access(fileName)
//         .then(() => true)
//         .catch(() => false))
//     ) {
//       return fileName;
//     }
//     counter++;
//   }
// };
// const main = async () => {
//   try {
//     const results = [];

//     for (const item of artefacts) {
//       if (!item.text) {
//         console.log(`Skipping artefact ${item.id} because it has no text`);
//         continue;
//       }
//       const embeddingResult = await createEmbedding(item.text);
//       const result = {
//         id: `${item.id}-embedding`,
//         text: item.text,
//         artefactId: item.id,
//         vector: embeddingResult[0].embedding,
//       };
//       results.push(result);

//       // Seed the embedding into the database
//       await prisma.embedding.upsert({
//         where: { id: result.id },
//         update: {
//           text: result.text,
//           vector: result.vector,
//           artefactId: result.artefactId,
//         },
//         create: {
//           id: result.id,
//           text: result.text,
//           vector: result.vector,
//           artefactId: result.artefactId,
//         },
//       });
//     }

//     const outputFile = await getNextFileName();
//     const fileContent = JSON.stringify(results, null, 2);
//     await fs.writeFile(outputFile, fileContent, "utf-8");

//     console.log(
//       `Embeddings have been generated, saved to ${outputFile}, and seeded to database`
//     );
//   } catch (err) {
//     console.error("Failed to create or seed embeddings:", err);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// // const createJsonFile = async () => {
// //   const generationItems = generations;
// //   const fileContent = JSON.stringify(generationItems, null, 2);
// //   await fs.writeFile(
// //     join(__dirname, "generations_0.json"),
// //     fileContent,
// //     "utf-8"
// //   );
// // };

// // createJsonFile();

// main();
