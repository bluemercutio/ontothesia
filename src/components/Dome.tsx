// components/DomeScene.tsx
"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createDomeEnvironment } from "../services/dome/environment";

const DomeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount?.clientWidth || window.innerWidth;
    const height = mount?.clientHeight || window.innerHeight;

    // Create scene and renderer.
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount?.appendChild(renderer.domElement);

    // Camera at the center (0, 0, 0)
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);

    // Add OrbitControls so user can look around.
    const controls = new OrbitControls(camera, renderer.domElement);
    // If you want to prevent zoom/pan, uncomment the lines below:
    // controls.enableZoom = false;
    // controls.enablePan = false;
    // Smooth inertia for rotation:
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Optionally, you can keep camera "in place" by setting minDistance & maxDistance to 0
    // but that can lead to odd interactions with OrbitControls. A better approach is to
    // set a small range if you want minimal movement:
    // controls.minDistance = 0;
    // controls.maxDistance = 0;

    // Add some ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Create the dome environment with a given radius
    const domeGroup = createDomeEnvironment(5);
    scene.add(domeGroup);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // needed if enableDamping = true
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resizing
    const handleResize = () => {
      const newWidth = mount?.clientWidth || window.innerWidth;
      const newHeight = mount?.clientHeight || window.innerHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      mount?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default DomeScene;
