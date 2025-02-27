import { Experience } from "@/types/experience";
import { Scene } from "@/types/scene";
import { Artefact } from "@/types/artefact";
import { Embedding } from "@/types/embedding";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "/api"; // Adjust this according to your backend setup

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Experience", "Scene", "Artefact", "Embedding"],
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
} = api;
