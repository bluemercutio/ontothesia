import { ArtefactId } from "./artefact";

export type SceneId = string;

export interface Scene {
  id: SceneId;
  title: string;
  context: string;
  artefact: ArtefactId;
  image_url: string;
  video_url: string;
  visualisation: string;
}
