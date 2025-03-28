// Enhanced script that can either output path or run a command
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

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

// If arguments are passed, execute the command with the schema path
if (process.argv.length > 2) {
  const command = process.argv.slice(2).join(" ");
  try {
    execSync(`npx prisma ${command} --schema=${schemaPath}`, {
      stdio: "inherit",
    });
  } catch (error) {
    console.error(error);
    process.exit(1); // Exit with error code if command fails
  }
} else {
  // Just output the path if no arguments
  console.log(schemaPath);
}
