// lib/domeEnvironment.ts
import * as THREE from "three";

/**
 * Creates a single screen mesh (Plane) at the given position.
 * By default, it faces the center (0, 0, 0).
 */
export const createScreen = (
  position: THREE.Vector3,
  width = 2,
  height = 1
): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
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
export const createPrimaryScreens = (radius: number): THREE.Mesh[] => {
  const screens: THREE.Mesh[] = [];

  // 6 screens around the horizontal circle.
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const position = new THREE.Vector3(x, 0, z);
    screens.push(createScreen(position));
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
    screens.push(createScreen(position));
  }

  // 1 screen overhead
  const topPosition = new THREE.Vector3(0, radius, 0);
  screens.push(createScreen(topPosition));

  return screens;
};

/**
 * Creates a secondary layer of smaller screens in between each primary screen,
 * slightly behind the first layer to add depth.
 */
export const createSecondaryScreens = (
  primaryScreens: THREE.Mesh[],
  offset = 1.5
): THREE.Mesh[] => {
  const screens: THREE.Mesh[] = [];
  const count = primaryScreens.length;

  for (let i = 0; i < count; i++) {
    const nextIndex = (i + 1) % count;
    const currentPos = primaryScreens[i].position;
    const nextPos = primaryScreens[nextIndex].position;

    // Midpoint between two primary screens
    const midpoint = new THREE.Vector3()
      .addVectors(currentPos, nextPos)
      .multiplyScalar(0.5);

    // Push it further out by 'offset' to create a background layer
    const direction = midpoint.clone().normalize(); // from origin to midpoint
    midpoint.add(direction.multiplyScalar(offset));

    // Create a smaller screen at this midpoint
    screens.push(createScreen(midpoint, 1.5, 0.75));
  }
  return screens;
};

/**
 * Main function to build the dome environment: primary + secondary screens
 */
export const createDomeEnvironment = (radius: number = 5): THREE.Group => {
  const group = new THREE.Group();

  // Primary screens
  const primaryScreens = createPrimaryScreens(radius);
  primaryScreens.forEach((screen) => group.add(screen));

  // Secondary screens
  const secondaryScreens = createSecondaryScreens(primaryScreens, radius * 0.3);
  secondaryScreens.forEach((screen) => group.add(screen));

  return group;
};
