import * as THREE from "three";
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  VISIBLE_DURATION,
  CYCLE_DURATION,
  FADE_DURATION,
  OFFSET_INCREMENT,
} from "./constants";
import { EnhancedScene } from "@ontothesia/types/scene";
import { createScreen } from "./createScreen";

export function createDomeEnvironment(
  radius: number,
  scenes: EnhancedScene[]
): THREE.Group {
  const group = new THREE.Group();

  // Generate dome screens
  let screens = generateDomeScreens(radius, scenes);

  // Ensure first screen is directly in front of the user
  const frontScreen = createFrontScreen(radius, scenes[0]);

  // Remove the front screen from shuffled array to avoid duplication
  screens = screens.filter((s) => s !== frontScreen);

  // Shuffle remaining screens
  shuffleArray(screens);

  // Insert the front screen at index 0
  screens.unshift(frontScreen);

  // Assign unique offsets to screens in random order
  screens.forEach((screen, i) => {
    const offset = i * OFFSET_INCREMENT;
    if (screen.material instanceof THREE.ShaderMaterial) {
      screen.material.uniforms.u_offset.value = offset;
      screen.material.uniforms.u_cycleDuration.value = CYCLE_DURATION;
      screen.material.uniforms.u_fadeDuration.value = FADE_DURATION;
      screen.material.uniforms.u_visibleDuration.value = VISIBLE_DURATION;
    }
  });

  // Add screens to group
  screens.forEach((screen) => group.add(screen));
  return group;
}

export function createFrontScreen(
  radius: number,
  scene: EnhancedScene
): THREE.Mesh {
  const position = new THREE.Vector3(0, 0, -radius);
  const schedulingUniforms = {
    offset: 0,
    cycleDuration: CYCLE_DURATION,
    fadeDuration: FADE_DURATION,
    visibleDuration: VISIBLE_DURATION,
  };
  return createScreen(
    position,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    scene,
    schedulingUniforms
  );
}

export function generateDomeScreens(
  radius: number,
  scenes: EnhancedScene[]
): THREE.Mesh[] {
  const screens: THREE.Mesh[] = [];

  // 5 Remaining Screens Around Viewer (Skipping Front Screen)
  for (let i = 1; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const position = new THREE.Vector3(x, 0, z);

    const sceneItem = scenes[i % scenes.length];
    const schedulingUniforms = {
      offset: 0,
      cycleDuration: 999,
      fadeDuration: 1.0,
      visibleDuration: 1.0,
    };

    const screen = createScreen(
      position,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      sceneItem,
      schedulingUniforms
    );
    screens.push(screen);
  }

  // 3 Angled Screens Above Viewer
  const tiltAngle = Math.PI / 4;
  const y = radius * Math.sin(tiltAngle);
  const horizontalRadius = radius * Math.cos(tiltAngle);

  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const x = horizontalRadius * Math.cos(angle);
    const z = horizontalRadius * Math.sin(angle);
    const position = new THREE.Vector3(x, y, z);

    const sceneItem = scenes[(6 + i) % scenes.length];
    const schedulingUniforms = {
      offset: 0,
      cycleDuration: 999,
      fadeDuration: 1.0,
      visibleDuration: 1.0,
    };

    const screen = createScreen(
      position,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      sceneItem,
      schedulingUniforms
    );
    screens.push(screen);
  }

  // 1 Screen Directly Above Viewer (Zenith)
  const topPosition = new THREE.Vector3(0, radius, 0);
  const sceneItem = scenes[(6 + 3) % scenes.length];
  const schedulingUniforms = {
    offset: 0,
    cycleDuration: 999,
    fadeDuration: 1.0,
    visibleDuration: 1.0,
  };

  const zenithScreen = createScreen(
    topPosition,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    sceneItem,
    schedulingUniforms
  );
  screens.push(zenithScreen);

  return screens;
}

const shuffleArray = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
