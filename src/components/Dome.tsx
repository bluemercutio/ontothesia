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
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);

    const controls = new PointerLockControls(camera, renderer.domElement);
    renderer.domElement.addEventListener("click", () => controls.lock());

    // Restrict Vertical Look (Prevent Looking Below Horizon)
    const maxPitchUp = Math.PI / 3; // Limit looking up (60 degrees)
    const maxPitchDown = -Math.PI / 40; // Limit looking down (just below horizon)

    controls.addEventListener("change", () => {
      const euler = new THREE.Euler();
      euler.setFromQuaternion(camera.quaternion, "YXZ");

      // Clamp vertical rotation
      euler.x = Math.max(maxPitchDown, Math.min(maxPitchUp, euler.x));
      camera.quaternion.setFromEuler(euler);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const domeGroup = createDomeEnvironment(5, scenes, generations);
    scene.add(domeGroup);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      domeGroup.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.ShaderMaterial
        ) {
          if (child.material.uniforms.u_time) {
            child.material.uniforms.u_time.value = elapsed;
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newWidth = mount.clientWidth || window.innerWidth;
      const newHeight = mount.clientHeight || window.innerHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      renderer.domElement.removeEventListener("click", () => controls.lock());
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [scenes, generations]);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default DomeScene;
