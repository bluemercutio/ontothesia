// DomeScene.tsx
"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { createDomeEnvironment } from "../services/dome/environment";
import { Scene } from "@/types/scene";
import { Generation } from "@/types/generation";

const DomeScene: React.FC<{ scenes: Scene[]; generations: Generation[] }> = ({
  scenes,
  generations,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Dome Generations", generations);
    const mount = mountRef.current;
    const width = mount?.clientWidth || window.innerWidth;
    const height = mount?.clientHeight || window.innerHeight;

    // Create scene and renderer.
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount?.appendChild(renderer.domElement);

    // Position the camera at the center.
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);

    // Add PointerLockControls for first-person look-around.
    const controls = new PointerLockControls(camera, renderer.domElement);
    // Request pointer lock on click.
    const handleClick = () => {
      controls.lock();
    };
    document.addEventListener("click", handleClick);

    // Add some ambient light.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Create and add the dome environment with the list of scene images
    const domeGroup = createDomeEnvironment(5, scenes, generations);
    scene.add(domeGroup);

    // Animation loop.
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resizing.
    const handleResize = () => {
      const newWidth = mount?.clientWidth || window.innerWidth;
      const newHeight = mount?.clientHeight || window.innerHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount.
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      mount?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [scenes, generations]);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default DomeScene;
