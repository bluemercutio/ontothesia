import { ArtefactId } from "./artefact";

export type SceneId = string;

export interface Scene {
  id: SceneId;
  title: string;
  description: string;
  artefacts: ArtefactId[];
  image_url: string;
  video_url: string;
}
