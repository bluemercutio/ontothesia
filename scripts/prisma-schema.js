// Determine if we're in monorepo mode or NPM package mode
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const monorepoPath = path.resolve(
  __dirname,
  "..",
  "..",
  "packages",
  "prisma",
  "prisma",
  "schema.prisma"
);
const npmPackagePath = path.resolve(
  __dirname,
  "..",
  "node_modules",
  "@arkology-studio",
  "ontothesia-prisma",
  "prisma",
  "schema.prisma"
);

// Check if monorepo path exists
const schemaPath = fs.existsSync(monorepoPath) ? monorepoPath : npmPackagePath;

// Output the path to use
console.log(schemaPath);
