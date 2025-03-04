"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { createGalleryEnvironment } from "../services/gallery/createGalleryEnvironment";
import { buildDirectedNetwork } from "@/services/graph/similarity-graph";
import { Embedding } from "@/types/embedding";
import { EmbeddingNetwork } from "@/services/graph/interface";
import { Scene } from "@/types/scene";
import { Generation } from "@/types/generation";

interface GalleryProps {
  embedding: Embedding;
  embeddings: Embedding[];
  generations: Generation[];
  scenes: Scene[];
  THRESHOLD: number;
  onNetworkChange: (network: EmbeddingNetwork) => void;
}

const Gallery: React.FC<GalleryProps> = ({
  embedding,
  embeddings,
  generations,
  scenes,
  THRESHOLD,
  onNetworkChange,
}) => {
  // 1️⃣ Build the FULL network ONCE
  const [fullNetwork] = useState<EmbeddingNetwork>(() =>
    buildDirectedNetwork(embedding, embeddings, scenes, 3, THRESHOLD)
  );

  // 2️⃣ Sub-network: Start with ONLY the first screen
  const [currentNetwork, setCurrentNetwork] = useState<EmbeddingNetwork>(() => {
    const centerNode = fullNetwork.nodes.find((n) => n.id === embedding.id);
    return centerNode
      ? { nodes: [centerNode], edges: [] }
      : { nodes: [], edges: [] };
  });

  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const galleryGroupRef = useRef<THREE.Group>(null);
  const raycaster = React.useMemo(() => new THREE.Raycaster(), []);
  const mouse = React.useMemo(() => new THREE.Vector2(), []);

  // 3️⃣ Get the connected screens (up to 3)
  const getSubNetwork = useCallback(
    (centralNodeId: string, maxNeighbors: number = 2) => {
      const centerNode = fullNetwork.nodes.find((n) => n.id === centralNodeId);
      if (!centerNode) return { nodes: [], edges: [] };

      const outEdges = fullNetwork.edges.filter(
        (e) => e.source === centralNodeId
      );
      outEdges.sort((a, b) => b.similarity - a.similarity);

      const topEdges = outEdges.slice(0, maxNeighbors);
      const neighborIds = new Set(topEdges.map((e) => e.target));

      const subNodes = fullNetwork.nodes.filter(
        (n) => n.id === centralNodeId || neighborIds.has(n.id)
      );

      const subEdges = fullNetwork.edges.filter(
        (e) =>
          subNodes.some((sn) => sn.id === e.source) &&
          subNodes.some((sn) => sn.id === e.target)
      );

      return { nodes: subNodes, edges: subEdges };
    },
    [fullNetwork]
  );

  // 4️⃣ Handle Click: Remove current screen and show the next ones
  const onClick = useCallback(
    (event: MouseEvent) => {
      console.log("onClick");
      if (!cameraRef.current || !galleryGroupRef.current) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(
        galleryGroupRef.current.children,
        true
      );

      if (intersects.length > 0) {
        let clickedObject: THREE.Object3D | null = intersects[0].object;
        console.log("Found intersected object:", clickedObject);

        while (clickedObject && !clickedObject.userData.scene) {
          clickedObject = clickedObject.parent;
        }

        if (clickedObject?.userData.scene) {
          const clickedScene = clickedObject.userData.scene;
          console.log("Clicked scene:", clickedScene);

          // Find the corresponding embedding for this scene
          const clickedEmbedding = embeddings.find(
            (e) => e.artefactId === clickedScene.artefact
          );

          if (clickedEmbedding) {
            console.log("Found corresponding embedding:", clickedEmbedding);
            const nextSubNetwork = getSubNetwork(clickedEmbedding.id, 2);
            console.log("nextSubNetwork", nextSubNetwork);
            setCurrentNetwork(nextSubNetwork);
            onNetworkChange?.(nextSubNetwork);
          } else {
            console.warn("No embedding found for scene:", clickedScene);
          }
        } else {
          console.log("No scene data found on clicked object");
        }
      }
    },
    [getSubNetwork, mouse, raycaster, embeddings, onNetworkChange]
  );

  // 5️⃣ Update Scene: Rebuild whenever `currentNetwork` changes
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    const currentScenes = scenes.filter((scene) =>
      currentNetwork.nodes.some((node) => node.artefact === scene.id)
    );

    console.log("Creating gallery environment with scenes:", currentScenes);
    const galleryGroup = createGalleryEnvironment(currentScenes, generations);
    galleryGroupRef.current = galleryGroup;
    scene.add(galleryGroup);

    renderer.domElement.addEventListener("click", onClick);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      // Cleanup previous screens
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.material instanceof THREE.MeshBasicMaterial) {
            if (object.material.map) {
              object.material.map.dispose();
            }
            object.material.dispose();
          }
          if (object.geometry) {
            object.geometry.dispose();
          }
        }
      });

      scene.clear();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [currentNetwork, , scenes, generations, onClick]);

  return <div ref={mountRef} className="w-full h-screen cursor-pointer" />;
};

export default Gallery;
