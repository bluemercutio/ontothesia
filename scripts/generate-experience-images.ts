import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createSlicedImage } from "./experience.js";
import { Scene } from "@arkology-studio/ontothesia-types/scene";
import { v4 as uuidv4 } from "uuid";

// ES Modules replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const EXPERIENCES_DIR = path.join(__dirname, "../prisma/data/experiences");
const SCENES_DIR = path.join(__dirname, "../prisma/data/scenes");
const IMAGES_DIR = path.join(__dirname, "../prisma/data/experiences/images");
const SOURCE_IMAGES_DIR = path.join(
  __dirname,
  "../prisma/data/generations/images"
); // Assuming scene images are here

// Ensure output directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Read all scene data
const loadAllScenes = () => {
  const sceneFiles = fs
    .readdirSync(SCENES_DIR)
    .filter((file) => file.startsWith("scenes_") && file.endsWith(".json"));
  let allScenes: Scene[] = [];

  sceneFiles.forEach((file) => {
    const scenesData = JSON.parse(
      fs.readFileSync(path.join(SCENES_DIR, file), "utf8")
    );
    allScenes = [...allScenes, ...scenesData];
  });

  return allScenes;
};

// Find scene by ID
const findSceneById = (scenes: Scene[], id: string) => {
  return scenes.find((scene) => scene.id === id);
};

// Create a safer version of the createSlicedImage function that handles errors better
const createSafeSlicedImage = async (
  imagePaths: string[],
  outputPath: string,
  outputSize = 1024
) => {
  try {
    // Verify all image paths exist
    for (const imagePath of imagePaths) {
      if (!fs.existsSync(imagePath)) {
        console.error(`Image not found: ${imagePath}`);
        return false;
      }
    }

    await createSlicedImage(imagePaths, outputPath, outputSize);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error creating sliced image: ${error.message}`);
    } else {
      console.error(`Error creating sliced image: ${String(error)}`);
    }
    return false;
  }
};

// Create composite image for an experience
const createExperienceImage = async (
  experienceId: string,
  experienceTitle: string,
  sceneIds: string[],
  allScenes: Scene[],
  experienceFilePath: string // Add file path parameter
) => {
  // If fewer than 8 scenes, skip or handle appropriately
  if (sceneIds.length < 8) {
    console.log(
      `Experience ${experienceId} has fewer than 8 scenes. Skipping.`
    );
    return;
  }

  // Randomly select 8 scenes
  const randomSceneIds = [...sceneIds]
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  // Get image paths for selected scenes
  const imagePaths = [];
  for (const sceneId of randomSceneIds) {
    const scene = findSceneById(allScenes, sceneId);
    if (scene && scene.image_url) {
      const imagePath = path.join(SOURCE_IMAGES_DIR, scene.image_url);
      imagePaths.push(imagePath);
      console.log(`Selected image: ${scene.image_url}`);
    }
  }

  // If we don't have exactly 8 images, skip or handle appropriately
  if (imagePaths.length !== 8) {
    console.log(
      `Could not find 8 valid images for experience ${experienceId}. Found ${imagePaths.length}.`
    );
    return;
  }

  // Generate a UUID for the image
  const imageUuid = uuidv4();

  // Create image filenames with UUID
  const fullSizeOutputPath = path.join(IMAGES_DIR, `${imageUuid}.png`);
  const thumbnailOutputPath = path.join(IMAGES_DIR, `${imageUuid}_thumb.png`);

  // Create full-size image
  const fullSizeSuccess = await createSafeSlicedImage(
    imagePaths,
    fullSizeOutputPath,
    1024
  );

  if (fullSizeSuccess) {
    // Create thumbnail
    await createSafeSlicedImage(imagePaths, thumbnailOutputPath, 256);
    console.log(
      `Created images for "${experienceTitle}" with UUID: ${imageUuid}`
    );

    // Update the experience JSON file with the image UUID
    try {
      const experienceData = JSON.parse(
        fs.readFileSync(experienceFilePath, "utf8")
      );
      experienceData.image_url = imageUuid;
      fs.writeFileSync(
        experienceFilePath,
        JSON.stringify(experienceData, null, 2)
      );
      console.log(`Updated experience file with image UUID: ${imageUuid}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error updating experience file: ${error.message}`);
      } else {
        console.error(`Error updating experience file: ${String(error)}`);
      }
    }
  }
};

const main = async () => {
  // Load all scenes
  const allScenes = loadAllScenes();
  console.log(`Loaded ${allScenes.length} scenes`);

  // Process each experience
  const experienceFiles = fs
    .readdirSync(EXPERIENCES_DIR)
    .filter(
      (file) => file.startsWith("experiences_") && file.endsWith(".json")
    );

  for (const file of experienceFiles) {
    const filePath = path.join(EXPERIENCES_DIR, file);
    const experienceData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const sceneIds = experienceData.scenes;

    console.log(
      `Processing "${experienceData.title}" with ${sceneIds.length} scenes`
    );

    await createExperienceImage(
      experienceData.id,
      experienceData.title,
      sceneIds,
      allScenes,
      filePath // Pass the file path to the function
    );
  }

  console.log("All experience images generated successfully!");
};

main().catch((error) => {
  console.error("Error generating experience images:", error);
  process.exit(1);
});
