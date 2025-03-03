import { ArtefactId } from "./artefact";
import { SceneId } from "./scene";
export type GenerationId = string;

export interface Generation {
  id: GenerationId;
  prompt: string;
  image_url: string;
  artefact: ArtefactId;
  scene: SceneId;
}

export interface StableDiffusionRequest {
  key: string;
  prompt: string;
  negative_prompt: string | null;
  width: string;
  height: string;
  samples: string;
  num_inference_steps: string;
  seed: number | null;
  guidance_scale: number;
  safety_checker: string;
  multi_lingual: string;
  panorama: string;
  self_attention: string;
  upscale: string;
  embeddings_model: string | null;
  webhook: string | null;
  track_id: string | null;
}

export interface StableDiffusionMeta {
  H: number;
  W: number;
  enable_attention_slicing: string;
  file_prefix: string;
  guidance_scale: number;
  model: string;
  n_samples: number;
  negative_prompt: string;
  outdir: string;
  prompt: string;
  revision: string;
  safetychecker: string;
  seed: number;
  steps: number;
  vae: string;
}

export interface StableDiffusionResponse {
  status: string;
  generationTime: number;
  id: number;
  output: string[];
  meta: StableDiffusionMeta;
}
