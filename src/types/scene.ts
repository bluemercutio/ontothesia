import { ArtefactId } from "./artefact";
import { ExperienceId } from "./experience";
import { GenerationId } from "./generation";
export type SceneId = string;

export interface Scene {
  id: SceneId;
  title: string;
  context: string;
  artefact: ArtefactId;
  image_url: string;
  video_url: string;
  visualisation: string;
  experience: ExperienceId;
  generation: GenerationId;
}
