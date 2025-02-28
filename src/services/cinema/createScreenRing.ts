// "use client";
import * as THREE from "three";
import { createScreen } from "./createScreen";

/**
 * Creates a ring of screens around a center point at a given radius, y-position, and tilt.
 *
 * @param count        - Number of screens to place in the ring.
 * @param radius       - Radius of the ring (distance from center).
 * @param y            - The y-position for the entire ring.
 * @param tiltRadians  - The angle (in radians) to tilt each screen.
 * @param texture      - A THREE.Texture to use for all screens in this ring.
 */
export function createScreenRing(
  count: number,
  radius: number,
  y: number,
  tiltRadians: number,
  texture: THREE.Texture
) {
  const ringGroup = new THREE.Group();
  ringGroup.position.y = y;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const screen = createScreen(texture);

    // Position the screen in a circle
    screen.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));

    // Face inward toward the center
    screen.lookAt(0, 0, 0);

    // Tilt the screen by `tiltRadians` around the X-axis (for an upward/downward tilt).
    screen.rotation.x += tiltRadians;

    ringGroup.add(screen);
  }

  return ringGroup;
}
