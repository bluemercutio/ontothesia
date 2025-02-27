import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { createCinemaScreens } from "./cinemaScreens";

const main = () => {
  // 1. Scene
  const scene = new THREE.Scene();

  // 2. Camera at (0,0,0) so you’re inside the screen formation
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 0);

  // 3. Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 4. PointerLockControls for first-person look-around
  const controls = new PointerLockControls(camera, renderer.domElement);

  // Click to lock pointer
  document.addEventListener("click", () => {
    controls.lock();
  });

  // 5. (Optional) Video element.
  //    For debugging, skip or pass `undefined` to `createCinemaScreens`.
  //    If you want to test video, re-enable the code in cinemaScreens.ts
  const videoElement = document.createElement("video");
  videoElement.src = "path/to/your-video.mp4";
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.play().catch(console.error);

  // 6. Create the multi-layer “cinema screens”
  // If you pass `undefined`, you get plain white.
  // If you pass `videoElement`, it tries to create a VideoTexture.
  createCinemaScreens(scene /*, videoElement */);

  // 7. Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();

  // 8. Resize handling
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

main();
