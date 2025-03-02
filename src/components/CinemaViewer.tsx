// "use client";

// import React, { useState, useCallback } from "react";
// // import * as THREE from "three";
// // import { useThreeScene } from "../services/cinema/useThree";
// // import { createScreenRing } from "../services/cinema/createScreenRing";
// // import { createScreen } from "../services/cinema/createScreen";

// interface CinemaViewerProps {
//   /** URL of the image to display on each screen. */
//   imageUrl?: string;
// }

// const CinemaViewer: React.FC<CinemaViewerProps> = ({ imageUrl }) => {
//   const [texture] = useState(() =>
//     new THREE.TextureLoader().load(imageUrl ?? "")
//   );

//   /**
//    * This callback is passed to our custom useThreeScene hook.
//    * It provides access to the scene/camera so we can add objects as soon
//    * as the Three.js environment is ready.
//    */
//   const onSceneReady = useCallback(
//     (scene: THREE.Scene) => {
//       // === RING #1 (around user) ===
//       const ring1 = createScreenRing(8, 5, 0, 0, texture);
//       scene.add(ring1);

//       // === RING #2 (above user, slightly tilted downward) ===
//       const ring2 = createScreenRing(8, 5, 3, -Math.PI / 8, texture);
//       scene.add(ring2);

//       // === SINGLE SCREEN AT TOP (like a "ceiling" screen) ===
//       // Let's place one screen above y=6, angled downward
//       const topScreen = createScreen(texture, 3, 1.6875); // bigger screen (16:9 ratio)
//       topScreen.position.set(0, 6, 0);
//       topScreen.rotation.x = -Math.PI / 2; // tilt 90 degrees downward
//       scene.add(topScreen);

//       // Optionally add some lighting (only necessary if using non-Basic materials)
//       const ambient = new THREE.AmbientLight(0xffffff, 0.3);
//       scene.add(ambient);

//       const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
//       dirLight.position.set(10, 10, 10);
//       scene.add(dirLight);
//     },
//     [texture]
//   );

//   // Use our custom hook to create a three-scene container
//   const refContainer = useThreeScene({ onSceneReady });

//   return (
//     <div
//       ref={refContainer}
//       style={{
//         width: "100%",
//         height: "100vh",
//         overflow: "hidden",
//       }}
//     />
//   );
// };

// export default CinemaViewer;
