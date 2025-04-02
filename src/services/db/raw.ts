export type RawArtefactWithEmbedding = {
  id: string;
  title: string;
  text: string;
  region: string;
  approx_date: string;
  citation: string;
  embedding: {
    id: string;
    text: string;
    vector: number[];
    artefactId: string;
  } | null;
};

export type RawScene = {
  id: string;
  title: string;
  context: string;
  artefactId: string;
  image_url: string;
  video_url: string | null;
  visualisation: string;
  experienceId: string | null;
};

export type RawExperienceWithScenes = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  visible: boolean;
  display_index: number;
  complete: boolean;
  scenes: Array<{
    id: string;
    title: string;
    context: string;
    // etc. or just 'id'
  }>;
};

export type RawEmbedding = {
  id: string;
  text: string;
  vector: number[];
  artefactId: string;
};
