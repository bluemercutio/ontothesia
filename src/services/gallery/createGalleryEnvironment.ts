// services/gallery/createGalleryEnvironment.ts
import * as THREE from "three";
import {
  SCREEN_DISTANCE,
  ONE_SCREEN_ANGLES,
  TWO_SCREEN_ANGLES,
  THREE_SCREEN_ANGLES,
} from "./constants";
import { createGalleryScreen } from "./createGalleryScreen";
import { Scene } from "@/types/scene";
import { Generation } from "@/types/generation";

export const createGalleryEnvironment = (
  scenes: Scene[],
  generations: Generation[]
) => {
  const group = new THREE.Group();

  // Decide which angle array to use based on how many scenes we have:
  let angles: number[] = [];
  if (scenes.length === 1) {
    angles = ONE_SCREEN_ANGLES; // [0]
  } else if (scenes.length === 2) {
    angles = TWO_SCREEN_ANGLES; // [-22.5, 22.5] (or whatever you want)
  } else if (scenes.length === 3) {
    angles = THREE_SCREEN_ANGLES; // [-60, 0, 60]
  } else {
    // If you ever do have more than 3,
    // pick some default or just slice the first 3 scenes, etc.
    angles = THREE_SCREEN_ANGLES;
  }

  // Create a screen (plane mesh) for each scene
  const screens = scenes.map((scene) =>
    createGalleryScreen(scene, generations)
  );

  // Position each screen according to the angles array
  screens.forEach((screen, i) => {
    // If we have more screens than angles, do an extra check or slice
    if (i < angles.length) {
      const angleDeg = angles[i];
      const angleRad = THREE.MathUtils.degToRad(angleDeg);

      // Position on a circle of radius SCREEN_DISTANCE
      const x = SCREEN_DISTANCE * Math.sin(angleRad);
      // negative z means "in front" of camera
      const z = -SCREEN_DISTANCE * Math.cos(angleRad);
      screen.position.set(x, 0, z);

      // Make the plane face the camera at (0, 0, 0)
      screen.lookAt(0, 0, 0);
    }
    group.add(screen);
  });

  return group;
};
