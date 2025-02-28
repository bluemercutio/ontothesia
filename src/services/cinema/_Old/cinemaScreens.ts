import * as THREE from "three";

/**
 * Convert spherical coordinates to a Vector3 (x,y,z).
 * Spherical angles are:
 *   - r: distance from origin
 *   - theta: azimuth angle around Y-axis, in radians [0..2π]
 *   - phi: polar angle from vertical axis, in radians [0..π]
 */
const sphericalToCartesian = (
  r: number,
  theta: number,
  phi: number
): THREE.Vector3 => {
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
};

/**
 * Quick helper to create a plane for a "cinema screen".
 * You can change width/height to taste.
 * Now modified to create an outline instead of a filled mesh.
 */
const createScreenMesh = (
  width: number,
  height: number,
  material: THREE.Material
): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(width, height);
  const screen = new THREE.Mesh(geometry, material);
  return screen;
};

/**
 * Optionally, create a video texture or just a white material for debugging.
 * Now modified to create an outline instead of a filled mesh.
 */
const createScreenMaterial = (texture?: THREE.Texture) => {
  if (!texture) {
    // fallback: plain white material
    return new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
  }

  // Create material with texture
  return new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
};

/**
 * Places a single screen at the given spherical coords,
 * aimed at the origin (0,0,0).
 */
const placeScreen = (
  scene: THREE.Scene,
  radius: number,
  theta: number,
  phi: number,
  material: THREE.Material,
  width: number,
  height: number
) => {
  const screen = createScreenMesh(width, height, material);
  screen.position.copy(sphericalToCartesian(radius, theta, phi));

  // Let the plane face inward (towards the origin)
  screen.lookAt(new THREE.Vector3(0, 0, 0));

  scene.add(screen);
};

/**
 * Create a ring of screens at a given radius & polar angle,
 * with optional offset for the ring.
 */
const placeRing = (
  scene: THREE.Scene,
  ringCount: number,
  radius: number,
  phi: number,
  angleOffset: number,
  material: THREE.Material,
  screenWidth: number,
  screenHeight: number
) => {
  for (let i = 0; i < ringCount; i++) {
    const step = (2 * Math.PI) / ringCount;
    const theta = angleOffset + i * step;

    placeScreen(scene, radius, theta, phi, material, screenWidth, screenHeight);
  }
};

/**
 * Creates 3 layers of screens around the user.
 * Each layer has:
 *  - 6 screens at eye-level (horizon)
 *  - 4 screens above (tilted)
 *  - 1 screen on top
 * The second and third layers offset their ring angles to interleave screens.
 */
export const createCinemaScreens = (
  scene: THREE.Scene,
  texture?: THREE.Texture
) => {
  // 1. Build the shared material (video or plain white)
  const material = createScreenMaterial(texture);

  // We'll treat "eye-level" as phi ~ π/2, "above" as phi ~ π/3, "top" as phi ~ 0
  // Adjust angles & distances to taste
  const EYE_LEVEL = Math.PI / 2; // horizon
  const ABOVE = Math.PI / 3; // ~60 deg from top
  const TOP = 0; // overhead

  // Screen size for a "small cinema" feel
  const SCREEN_WIDTH = 16;
  const SCREEN_HEIGHT = 9;

  // 2. Define each layer's radius and ring offset
  // Example: three layers, bigger radius each time.
  // offset used so that ring #2 screens fall between ring #1 screens.
  const layers = [
    // layer 1: radius= 15, offset=0
    { radius: 15, offset6: 0, offset4: 0 },
    // layer 2: radius= 25, offset half-step for 6-screens = π/6, half-step for 4-screens = π/4
    { radius: 25, offset6: Math.PI / 6, offset4: Math.PI / 4 },
    // layer 3: radius= 35, offset again for variety
    { radius: 35, offset6: 0, offset4: 0 },
  ];

  layers.forEach(({ radius, offset6, offset4 }) => {
    // 6 screens at horizon
    placeRing(
      scene,
      6,
      radius,
      EYE_LEVEL,
      offset6,
      material,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    // 4 screens above horizon (tilted down by default because they lookAt(0,0,0))
    placeRing(
      scene,
      4,
      radius,
      ABOVE,
      offset4,
      material,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    // 1 overhead
    // For a single screen, no ring. Just place it at phi=TOP.
    // We'll pick some angle offset, e.g. offset=0
    placeScreen(
      scene,
      radius,
      0 + offset4,
      TOP,
      material,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );
  });
};
