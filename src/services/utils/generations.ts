import { Experience } from "@ontothesia/types/experience";
import { Generation } from "@ontothesia/types/generation";
import { Scene } from "@ontothesia/types/scene";

export const findGenerationForScene = (
  scene: Scene,
  generations: Generation[]
) => {
  // Fallback to searching in generations array
  const generation = generations.find((g) => g.scene === scene.id);
  console.log("generation", generation);
  return generation;
};

export const getImageUrlForGeneration = (generation: Generation) => {
  return `/api/images/${generation.image_url.split("/").pop()}`;
};

export const getExperienceGenerationsMap = (
  generations: Generation[],
  experiences: Experience[]
) => {
  // Create a map of experience ID to its scene-specific generations
  const experienceGenerations = experiences.reduce((acc, experience) => {
    const experienceScenes = experience.scenes;
    const scenesGenerations =
      generations?.filter((generation: Generation) =>
        experienceScenes.includes(generation.scene)
      ) || [];

    acc[experience.id] = scenesGenerations.map(getImageUrlForGeneration);
    return acc;
  }, {} as Record<string, string[]>);
  return experienceGenerations;
};
