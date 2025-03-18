import React from "react";

export function LoadingSpinner(): React.ReactElement {
  return (
    <div className="w-10 h-10 relative animate-spin">
      <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-2 border-gray-200 border-t-[var(--primary-bg)]"></div>
    </div>
  );
}

export function LoadingState(): React.ReactElement {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
}
