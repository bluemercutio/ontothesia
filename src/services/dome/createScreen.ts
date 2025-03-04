import * as THREE from "three";
import { Scene } from "@/types/scene";
import { Generation } from "@/types/generation";
import { vertexShader, fragmentShader } from "./shaders";
import {
  getGenerationForScene,
  getImageUrlForGeneration,
} from "../utils/generations";

export const createScreen = (
  position: THREE.Vector3,
  width: number,
  height: number,
  scene: Scene,
  generations: Generation[],
  schedulingUniforms: {
    offset: number;
    cycleDuration: number;
    fadeDuration: number;
    visibleDuration: number;
  }
): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(width, height);
  let texture: THREE.Texture = new THREE.Texture(); // fallback texture

  if (scene) {
    const generation = getGenerationForScene(scene, generations);
    if (generation) {
      texture = new THREE.TextureLoader().load(
        getImageUrlForGeneration(generation),
        undefined,
        undefined,
        (error) => {
          console.warn("Error loading texture:", error);
        }
      );
    }
  }

  const material = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      minBorder: { value: 0.07 },
      maxBorder: { value: 0.17 },
      u_time: { value: 0.0 },
      u_offset: { value: schedulingUniforms.offset },
      u_cycleDuration: { value: schedulingUniforms.cycleDuration },
      u_fadeDuration: { value: schedulingUniforms.fadeDuration },
      u_visibleDuration: { value: schedulingUniforms.visibleDuration },
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  });

  const screen = new THREE.Mesh(geometry, material);
  screen.position.copy(position);
  screen.lookAt(new THREE.Vector3(0, 0, 0)); // Ensure all screens face the viewer

  return screen;
};
