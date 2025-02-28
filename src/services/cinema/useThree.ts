// "use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface UseThreeSceneProps {
  onSceneReady?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void;
}

export function useThreeScene({ onSceneReady }: UseThreeSceneProps) {
  const refContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let controls: OrbitControls | null = null;
    let animationId: number;

    if (refContainer.current) {
      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(
        refContainer.current.clientWidth,
        refContainer.current.clientHeight
      );
      refContainer.current.appendChild(renderer.domElement);

      // Create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000); // black background

      // Create camera
      const fov = 60;
      const aspect =
        refContainer.current.clientWidth / refContainer.current.clientHeight;
      const near = 0.1;
      const far = 1000;
      camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.set(0, 2, 5); // Put camera a bit away from center
      scene.add(camera);

      // Add OrbitControls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.target.set(0, 1, 0); // look at center-ish

      // Let parent callback modify or add to the scene
      if (onSceneReady && scene && camera) {
        onSceneReady(scene, camera);
      }

      // Handle window resize
      const handleResize = () => {
        if (refContainer.current && renderer && camera) {
          const { clientWidth, clientHeight } = refContainer.current;
          renderer.setSize(clientWidth, clientHeight);
          camera.aspect = clientWidth / clientHeight;
          camera.updateProjectionMatrix();
        }
      };
      window.addEventListener("resize", handleResize);

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        controls?.update();
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };
      animate();

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationId);
        if (renderer) {
          renderer.dispose();
          renderer = null;
        }
        scene = null;
        camera = null;
        controls?.dispose();
        controls = null;
        if (refContainer.current) {
          while (refContainer.current.firstChild) {
            refContainer.current.removeChild(refContainer.current.firstChild);
          }
        }
      };
    }
  }, [onSceneReady]);

  return refContainer;
}
