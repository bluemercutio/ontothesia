import * as THREE from "three";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants";
import { Scene } from "@/types/scene";
import { Generation } from "@/types/generation";
import {
  findGenerationForScene,
  getImageUrlForGeneration,
} from "../utils/generations";
import { vertexShader } from "./shaders";
import { fragmentShader } from "./shaders";

export const createGalleryScreen = (
  scene: Scene,
  generations: Generation[]
): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT);
  const generation = findGenerationForScene(scene, generations);
  if (!generation) {
    throw new Error("No generation found for scene");
  }
  const imageUrl = getImageUrlForGeneration(generation);
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
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      map: { value: texture },
      minBorder: { value: 0.07 },
      maxBorder: { value: 0.17 },
    },
    side: THREE.DoubleSide,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.scene = scene;
  return mesh;
};
