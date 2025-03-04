// services/gallery/createGalleryScreen.ts
import * as THREE from "three";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants";
import { Scene } from "@/types/scene";
import {
  getGenerationForScene,
  getImageUrlForGeneration,
} from "../utils/generations";
import { Generation } from "@/types/generation";

// Import your shaders
import { vertexShader } from "./shaders"; // or wherever you keep them
import { fragmentShader } from "./shaders"; // ...

export const createGalleryScreen = (
  scene: Scene,
  generations: Generation[]
) => {
  console.log("Creating gallery screen for scene: ", scene);
  const geometry = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT);

  const generation = getGenerationForScene(scene, generations);
  if (!generation) {
    throw new Error("No generation found for scene");
  }
  const imageUrl = getImageUrlForGeneration(generation);
  console.log("Image URL: ", imageUrl);

  // Load the texture
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(
    imageUrl,
    (loadedTexture) => {
      loadedTexture.minFilter = THREE.LinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.format = THREE.RGBAFormat;
      loadedTexture.needsUpdate = true;
    },
    undefined,
    (error) => {
      console.error("Error loading texture:", error);
    }
  );

  // Create a custom ShaderMaterial for the noise border
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      map: { value: texture },
      minBorder: { value: 0.07 }, // <--- tweak to taste
      maxBorder: { value: 0.17 }, // <--- tweak to taste
    },
    side: THREE.DoubleSide,
    transparent: true, // allow edges to be transparent
  });

  const mesh = new THREE.Mesh(geometry, material);
  // Save scene data for click detection
  mesh.userData.scene = scene;
  // Optionally also store the embedding if you want it in the raycast
  // mesh.userData.embedding = ...
  return mesh;
};
