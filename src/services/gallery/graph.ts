// services/gallery/graph.ts
export const getConnectedScenes = () => {
  // Dummy scenes. In practice, use the currentScene to get connected scenes.
  const dummyScenes = [
    { id: 1, imageUrl: "/images/scene1.jpg" },
    { id: 2, imageUrl: "/images/scene2.jpg" },
    { id: 3, imageUrl: "/images/scene3.jpg" },
    { id: 4, imageUrl: "/images/scene4.jpg" },
    { id: 5, imageUrl: "/images/scene5.jpg" },
  ];
  // Return a random number (1 to 3) of scenes.
  const count = Math.floor(Math.random() * 3) + 1;
  return dummyScenes.slice(0, count);
};
