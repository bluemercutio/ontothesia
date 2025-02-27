import * as THREE from "three";
import { DomeLayerConfig, SphericalCoords } from "./types";
import { domeLayers } from "./constants";

const sphericalToCartesian = ({
  r,
  theta,
  phi,
}: SphericalCoords): THREE.Vector3 => {
  // Using a common physics/graphics convention:
  // x = r * sin(phi) * cos(theta)
  // y = r * cos(phi)
  // z = r * sin(phi) * sin(theta)

  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

const createVideoTexture = (video: HTMLVideoElement): THREE.VideoTexture => {
  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;
  return texture;
};

const createScreenMesh = (
  width: number,
  height: number,
  material: THREE.Material
): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(width, height);
  const screen = new THREE.Mesh(geometry, material);
  return screen;
};

export const createDomeScreens = (
  scene: THREE.Scene,
  videoElement: HTMLVideoElement
): void => {
  // If you just want to see the planes as white:
  const screenMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  domeLayers.forEach(({ angleDeg, radius, screenCount }) => {
    const phi = THREE.MathUtils.degToRad(angleDeg);
    for (let i = 0; i < screenCount; i++) {
      const theta = (2 * Math.PI * i) / screenCount;
      const position = sphericalToCartesian({ r: radius, theta, phi });
      const screen = createScreenMesh(2, 1.5, screenMaterial);

      screen.position.copy(position);
      screen.lookAt(new THREE.Vector3(0, 0, 0));
      scene.add(screen);
    }
  });
};
