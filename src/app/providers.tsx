"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";

// Log when the store is initially imported
console.log("Redux store initialized with initial state:", store.getState());

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log(
      "Providers component mounted with current state:",
      store.getState()
    );

    // Subscribe to store changes
    const unsubscribe = store.subscribe(() => {
      console.log("Store state updated:", store.getState());
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
