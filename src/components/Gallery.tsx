"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";
import { createGalleryEnvironment } from "../services/gallery/createGalleryEnvironment";
import {
  EmbeddingNetwork,
  GraphEdge,
  GraphNode,
} from "@/services/graph/interface";
import {
  Scene,
  SceneId,
  EnhancedScene,
} from "@arkology-studio/ontothesia-types/scene";
import {
  Embedding,
  EmbeddingId,
} from "@arkology-studio/ontothesia-types/embedding";
import { Artefact } from "@arkology-studio/ontothesia-types/artefact";

interface GalleryProps {
  fullNetwork: EmbeddingNetwork;
  currentNodeId: string;
  embeddings: Embedding[];
  artefacts: Artefact[];
  scenes: Scene[];
  onNodeChange: (node: GraphNode) => void;
}

const Gallery: React.FC<GalleryProps> = ({
  fullNetwork,
  currentNodeId,
  embeddings,
  artefacts,
  scenes,
  onNodeChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const galleryGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const raycaster = useRef(new THREE.Raycaster()).current;
  const mouse = useRef(new THREE.Vector2()).current;
  const creationCount = useRef(0);
  const [processedScenes, setProcessedScenes] = useState<EnhancedScene[]>([]);

  const onClick = useCallback(
    (event: MouseEvent): void => {
      console.log("clicked", currentNodeId, fullNetwork);

      if (!cameraRef.current || !galleryGroupRef.current) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(
        galleryGroupRef.current.children,
        true
      );

      // Early return if no intersection
      if (!intersects.length) return;

      // Find the first object with scene data
      const findSceneObject = (
        obj: THREE.Object3D | null
      ): THREE.Object3D | null => {
        if (!obj) return null;
        if (obj.userData.scene) return obj;
        return findSceneObject(obj.parent);
      };

      const sceneObject = findSceneObject(intersects[0].object);
      if (!sceneObject) return;

      // Use optional chaining and find operations
      const clickedNode = fullNetwork.nodes.find(
        (node) =>
          node.id ===
          embeddings.find(
            (e) => e.artefactId === sceneObject.userData.scene.artefact
          )?.id
      );

      // If we have a node, trigger the change
      if (clickedNode) {
        onNodeChange(clickedNode);
      }
    },
    [mouse, raycaster, embeddings, onNodeChange, fullNetwork, currentNodeId]
  );

  // Update the useEffect that processes images
  useEffect(() => {
    const processSceneImages = async () => {
      // setIsLoading(true);
      try {
        const processed = await Promise.all(
          scenes.map(async (scene) => {
            const filename = scene.image_url.split("/").pop();
            const apiUrl = `/api/images/${filename}?folder=${process.env.NEXT_PUBLIC_SCENE_IMAGES_KEY}`;

            try {
              const response = await fetch(apiUrl);
              if (!response.ok) {
                console.error(`Failed to fetch image for scene ${scene.id}`);
                return {
                  ...scene,
                  processedImageUrl: apiUrl,
                };
              }

              const blob = await response.blob();
              const objectUrl = URL.createObjectURL(blob);

              return {
                ...scene,
                processedImageUrl: objectUrl,
              };
            } catch (error) {
              console.error(`Error processing scene ${scene.id}:`, error);
              return {
                ...scene,
                processedImageUrl: apiUrl,
              };
            }
          })
        );
        setProcessedScenes(processed);
      } catch (error) {
        console.error(`Error processing scenes:`, error);
      }
    };

    if (scenes.length > 0) {
      processSceneImages();
    }

    return () => {
      processedScenes.forEach((scene) => {
        if (scene.processedImageUrl.startsWith("blob:")) {
          URL.revokeObjectURL(scene.processedImageUrl);
        }
      });
    };
  }, [scenes]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Log when this effect runs
    console.log("Gallery environment effect running", {
      currentNodeId,
      sceneCount: scenes?.length,
      mapButtonClicked: document.querySelector(".network-container") !== null,
      creationCount: ++creationCount.current,
    });

    // **🔹 Clear old renderer if it exists**
    if (rendererRef.current) {
      console.log("Disposing previous renderer");
      rendererRef.current.dispose();
      rendererRef.current.domElement.remove();
    }

    // **🔹 Set up Three.js**
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    rendererRef.current = renderer;

    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    console.log("fullNetwork", fullNetwork);
    console.log("currentNodeId", currentNodeId);
    console.log(
      "current node",
      fullNetwork.nodes.find((n) => n.id === currentNodeId)
    );

    // Add detailed logging before filtering
    console.log("fullNetwork", fullNetwork);
    console.log("currentNodeId", currentNodeId);
    console.log(
      "current node",
      fullNetwork.nodes.find((n) => n.id === currentNodeId)
    );

    // The key fix - modify your filtering to handle both string and object references
    const embeddingIds: EmbeddingId[] = fullNetwork.edges
      .filter((edge: GraphEdge) => {
        // Convert both to string to handle potential object/string mismatch
        const sourceId =
          typeof edge.source === "object"
            ? (edge.source as GraphNode).id
            : edge.source.toString();

        console.log(
          `Comparing edge source ${sourceId} with currentNodeId ${currentNodeId}`
        );
        return sourceId === currentNodeId;
      })
      .map((edge: GraphEdge) => {
        // Also handle target in the same way
        return typeof edge.target === "object"
          ? (edge.target as GraphNode).id
          : (edge.target as EmbeddingId);
      });

    console.log("embeddingIds", embeddingIds);
    const filteredEmbeddings = embeddings.filter((e) =>
      embeddingIds.includes(e.id)
    );
    console.log("filteredEmbeddings", filteredEmbeddings);
    const filteredArtefacts = artefacts.filter((a) =>
      filteredEmbeddings.some((e) => e.artefactId === a.id)
    );
    console.log("filteredArtefacts", filteredArtefacts);
    const sceneIds: SceneId[] = [];
    filteredArtefacts.forEach((a) => {
      const scene = scenes.find((s) => s.artefact === a.id);
      if (scene) {
        sceneIds.push(scene.id);
      }
    });
    console.log("sceneIds", sceneIds);
    const currentScenes = processedScenes.filter((sc) =>
      sceneIds.includes(sc.id)
    );

    // Log before gallery creation
    console.log("Creating gallery environment", {
      currentScenes: currentScenes?.length,
      nodeId: currentNodeId,
    });

    const galleryGroup = createGalleryEnvironment(currentScenes);
    galleryGroupRef.current = galleryGroup;
    scene.add(galleryGroup);

    // Log after gallery creation
    console.log("Gallery environment created", {
      objectCount: galleryGroup.children.length,
    });

    renderer.domElement.addEventListener("click", onClick);

    // **🔹 Animation Loop**
    const animate = (): void => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      console.log("Gallery environment cleanup");
      // **🔹 Cleanup on component unmount**
      if (renderer) {
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }

      if (scene) {
        scene.clear();
      }

      renderer.domElement.removeEventListener("click", onClick);
    };
  }, [
    scenes,
    processedScenes,
    onClick,
    artefacts,
    embeddings,
    currentNodeId,
    fullNetwork,
  ]);

  return <div ref={mountRef} className="w-full h-screen cursor-pointer" />;
};

export default Gallery;
