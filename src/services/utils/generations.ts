import { Generation } from "@/types/generation";
import { Scene } from "@/types/scene";

export const getGenerationForScene = (
  scene: Scene,
  generations: Generation[]
) => {
  const generation = generations.find(
    (g) => g.id === "generation_" + scene.artefact
  );
  return generation;
};

export const getImageUrlForGeneration = (generation: Generation) => {
  return `/api/images/${generation.image_url.split("/").pop()}`;
};
