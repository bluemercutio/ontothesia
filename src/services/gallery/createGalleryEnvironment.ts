import * as THREE from "three";
import {
  SCREEN_DISTANCE,
  ONE_SCREEN_ANGLES,
  TWO_SCREEN_ANGLES,
  THREE_SCREEN_ANGLES,
} from "./constants";
import { createGalleryScreen } from "./createGalleryScreen";
import { Scene } from "@ontothesia/types/scene";
import { Generation } from "@ontothesia/types/generation";

export const createGalleryEnvironment = (
  scenes: Scene[],
  generations: Generation[]
): THREE.Group => {
  const group = new THREE.Group();

  let angles: number[] = [];
  if (scenes.length === 1) {
    angles = ONE_SCREEN_ANGLES;
  } else if (scenes.length === 2) {
    angles = TWO_SCREEN_ANGLES;
  } else {
    angles = THREE_SCREEN_ANGLES;
  }

  const screens = scenes.map((scene) =>
    createGalleryScreen(scene, generations)
  );
  screens.forEach((screen, i) => {
    if (i < angles.length) {
      const angleDeg = angles[i];
      const angleRad = THREE.MathUtils.degToRad(angleDeg);
      const x = SCREEN_DISTANCE * Math.sin(angleRad);
      const z = -SCREEN_DISTANCE * Math.cos(angleRad);
      screen.position.set(x, 0, z);
      screen.lookAt(0, 0, 0);
    }
    group.add(screen);
  });

  return group;
};
