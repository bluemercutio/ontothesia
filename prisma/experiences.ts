import { Experience } from "../src/types/experience";
import { scenes } from "./scenes";
export const experiences: Experience[] = [
  {
    id: "1",
    title: "Experience 1",
    description: "Description 1",
    scenes: scenes.map((scene) => scene.id),
    image_url: "/images/default_experience.png",
  },
];
