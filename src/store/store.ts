import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";

// Create the store
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Prefetch the data
store.dispatch(api.endpoints.getExperiences.initiate());
store.dispatch(api.endpoints.getScenes.initiate());
store.dispatch(api.endpoints.getArtefacts.initiate());
store.dispatch(api.endpoints.getEmbeddings.initiate());

// Prefetch individual experiences (we can get the IDs from the experiences list)
store.dispatch(api.endpoints.getExperiences.initiate()).then((result) => {
  if (result.data) {
    result.data.forEach((experience) => {
      store.dispatch(api.endpoints.getExperienceById.initiate(experience.id));
    });
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
