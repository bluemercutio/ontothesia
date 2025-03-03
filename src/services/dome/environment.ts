// lib/domeEnvironment.ts
import * as THREE from "three";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants";
import { Scene } from "@/types/scene";
import { Generation } from "@/types/generation";

/**
 * Creates a single screen mesh (Plane) at the given position.
 * If an image URL is provided, it is used as a texture.
 */
export const createScreen = (
  position: THREE.Vector3,
  width = SCREEN_WIDTH,
  height = SCREEN_HEIGHT,
  scene: Scene,
  generations: Generation[]
): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(width, height);
  let material: THREE.MeshBasicMaterial;

  if (scene) {
    const generation = generations.find(
      (generation) => generation.id === "generation_" + scene.artefact
    );

    if (generation) {
      try {
        // Convert local filesystem path to server URL path
        const imageUrl = `/api/images/${generation.image_url.split("/").pop()}`;
        // or if you have a different API endpoint structure:
        // const imageUrl = `/api/generations/${generation.id}/image`;

        const texture = new THREE.TextureLoader().load(
          imageUrl,
          undefined,
          undefined,
          (error) => {
            console.warn("Error loading texture:", error);
            material.color.set(0xffffff);
          }
        );
        material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
      } catch (error) {
        console.warn("Error creating texture:", error);
        material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
        });
      }
    } else {
      material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
    }
  } else {
    material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
  }

  const screen = new THREE.Mesh(geometry, material);
  // Place the screen and orient it to face the center.
  screen.position.copy(position);
  screen.lookAt(new THREE.Vector3(0, 0, 0));

  return screen;
};

/**
 * Creates the primary layer of screens:
 *  - 6 around the horizontal circle,
 *  - 4 angled above,
 *  - 1 overhead.
 */
export const createPrimaryScreens = (
  radius: number,
  scenes: Scene[],
  generations: Generation[]
): THREE.Mesh[] => {
  const screens: THREE.Mesh[] = [];
  // const TOTAL_PRIMARY_SCREENS = 11; // 6 horizontal + 4 angled + 1 overhead

  // 6 screens around the horizontal circle.
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const position = new THREE.Vector3(x, 0, z);
    // Pick an image from the list, repeating if needed
    const scene = scenes[i % scenes.length];
    screens.push(
      createScreen(position, SCREEN_WIDTH, SCREEN_HEIGHT, scene, generations)
    );
  }

  // 4 screens placed above the horizontal circle (slightly angled).
  const tiltAngle = Math.PI / 4; // 45° above the horizon
  const y = radius * Math.sin(tiltAngle);
  const horizontalRadius = radius * Math.cos(tiltAngle);

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const x = horizontalRadius * Math.cos(angle);
    const z = horizontalRadius * Math.sin(angle);
    const position = new THREE.Vector3(x, y, z);
    // Offset the index by 6 so that each screen can have a different image if provided.
    const scene = scenes[(6 + i) % scenes.length];
    screens.push(
      createScreen(position, SCREEN_WIDTH, SCREEN_HEIGHT, scene, generations)
    );
  }

  // 1 screen overhead
  const topPosition = new THREE.Vector3(0, radius, 0);
  const scene = scenes[(6 + 4) % scenes.length];
  screens.push(
    createScreen(topPosition, SCREEN_WIDTH, SCREEN_HEIGHT, scene, generations)
  );

  return screens;
};

/**
 * Creates a secondary layer of smaller screens in between each primary screen,
 * slightly behind the first layer to add depth.
 */
export const createSecondaryScreens = (
  primaryScreens: THREE.Mesh[],
  offset = 1.5,
  scenes: Scene[],
  generations: Generation[]
): THREE.Mesh[] => {
  const screens: THREE.Mesh[] = [];
  const count = primaryScreens.length;
  const startIndex = primaryScreens.length; // Start after primary screens

  for (let i = 0; i < count; i++) {
    const nextIndex = (i + 1) % count;
    const currentPos = primaryScreens[i].position;
    const nextPos = primaryScreens[nextIndex].position;

    const midpoint = new THREE.Vector3()
      .addVectors(currentPos, nextPos)
      .multiplyScalar(0.5);

    const direction = midpoint.clone().normalize();
    midpoint.add(direction.multiplyScalar(offset));

    // Use a different index for scenes to avoid reusing the same ones as primary screens
    const sceneIndex = (startIndex + i) % scenes.length;
    const scene = scenes[sceneIndex];
    screens.push(
      createScreen(midpoint, SCREEN_WIDTH, SCREEN_HEIGHT, scene, generations)
    );
  }
  return screens;
};

/**
 * Main function to build the dome environment: primary + secondary screens.
 */
export const createDomeEnvironment = (
  radius: number = 5,
  scenes: Scene[],
  generations: Generation[]
): THREE.Group => {
  const group = new THREE.Group();

  // Primary screens.
  const primaryScreens = createPrimaryScreens(radius, scenes, generations);
  primaryScreens.forEach((screen) => group.add(screen));

  // Secondary screens.
  const secondaryScreens = createSecondaryScreens(
    primaryScreens,
    radius * 0.3,
    scenes,
    generations
  );
  secondaryScreens.forEach((screen) => group.add(screen));

  return group;
};
