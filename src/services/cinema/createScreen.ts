// "use client";
import * as THREE from "three";

/**
 * Creates a single screen mesh (a PlaneGeometry) mapped with the provided texture.
 *
 * @param texture - A THREE.Texture to display on the plane.
 * @param width - The width of the plane geometry.
 * @param height - The height of the plane geometry.
 */
export function createScreen(
  texture: THREE.Texture,
  width = 2,
  height = 1.125
) {
  const geometry = new THREE.PlaneGeometry(width, height);
  // (Width=2, Height ~ 1.125 for ~16:9 aspect ratio, adjust to taste)

  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);

  // By default, plane is facing +Z. We'll keep it this way and rotate as needed.
  return mesh;
}
