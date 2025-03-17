import { Experience } from "@arkology-studio/ontothesia-types/experience";
import { Scene } from "@arkology-studio/ontothesia-types/scene";
import { Artefact } from "@arkology-studio/ontothesia-types/artefact";
import { Embedding } from "@arkology-studio/ontothesia-types/embedding";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Generation } from "@arkology-studio/ontothesia-types/generation";

// Update the BASE_URL to include the full URL
const BASE_URL = window.location.origin + "/api"; // Adjust port if different

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // Add some error handling
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Experience", "Scene", "Artefact", "Embedding", "Generation"],
  keepUnusedDataFor: 3600, // Keep unused data in cache for 1 hour
  endpoints: (builder) => ({
    // ───────────────────────────────────────────────────────────────────
    // EXPERIENCES
    // ───────────────────────────────────────────────────────────────────
    getExperiences: builder.query<Experience[], void>({
      query: () => "/experiences",
      providesTags: ["Experience"],
    }),
    getExperienceById: builder.query<Experience, string>({
      query: (id) => `/experiences/${id}`,
      providesTags: (result, error, id) => [{ type: "Experience", id }],
    }),
    createExperience: builder.mutation<Experience, Omit<Experience, "id">>({
      query: (data) => ({
        url: "/experiences",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Experience"],
    }),

    // ───────────────────────────────────────────────────────────────────
    // SCENES
    // ───────────────────────────────────────────────────────────────────
    getScenes: builder.query<Scene[], void>({
      query: () => "/scenes",
      providesTags: ["Scene"],
    }),
    getSceneById: builder.query<Scene, string>({
      query: (id) => `/scenes/${id}`,
      providesTags: (result, error, id) => [{ type: "Scene", id }],
    }),

    // ───────────────────────────────────────────────────────────────────
    // ARTEFACTS
    // ───────────────────────────────────────────────────────────────────
    getArtefacts: builder.query<Artefact[], void>({
      query: () => "/artefacts",
      providesTags: ["Artefact"],
    }),
    getArtefactById: builder.query<Artefact, string>({
      query: (id) => `/artefacts/${id}`,
      providesTags: (result, error, id) => [{ type: "Artefact", id }],
    }),

    // ───────────────────────────────────────────────────────────────────
    // EMBEDDINGS
    // ───────────────────────────────────────────────────────────────────
    getEmbeddings: builder.query<Embedding[], void>({
      query: () => "/embeddings",
      providesTags: ["Embedding"],
    }),

    // ───────────────────────────────────────────────────────────────────
    // GENERATIONS
    // ───────────────────────────────────────────────────────────────────
    getGenerations: builder.query<Generation[], void>({
      query: () => "/generations",
      providesTags: ["Generation"],
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetExperiencesQuery,
  useGetExperienceByIdQuery,
  useCreateExperienceMutation,
  useGetScenesQuery,
  useGetSceneByIdQuery,
  useGetArtefactsQuery,
  useGetArtefactByIdQuery,
  useGetEmbeddingsQuery,
  useGetGenerationsQuery,
} = api;
