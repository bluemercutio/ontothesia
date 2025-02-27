import { SceneId } from "./scene";

export type ExperienceId = string;

export interface Experience {
  id: ExperienceId;
  title: string;
  description: string;
  scenes: SceneId[];
  image_url: string;
}
