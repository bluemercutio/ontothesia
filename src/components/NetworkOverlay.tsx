import React, { useState, useEffect } from "react";
import { GraphNode } from "../services/graph/interface";
import { Artefact } from "../types/artefact";

interface NetworkOverlayProps {
  selectedNode: GraphNode | null;
  artefact: Artefact | null;
  isLoading?: boolean;
  onNodeSelect?: (nodeId: string | null) => void;
}

export const NetworkOverlay: React.FC<NetworkOverlayProps> = ({
  selectedNode,
  artefact,
  isLoading = false,
  onNodeSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset expansion state when selected node changes
  useEffect(() => {
    setIsExpanded(false);
  }, [selectedNode?.id]);

  if (!selectedNode) {
    return (
      <div
        className="py-2 px-4 rounded-md shadow-md w-96 backdrop-blur-sm"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <p className="italic opacity-70">Select a node to view details</p>
      </div>
    );
  }

  // Show loading state while artefact is being fetched
  if (isLoading || !artefact) {
    return (
      <div
        className="py-2 px-4 rounded-md shadow-md w-96 backdrop-blur-sm"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <p className="opacity-70">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="px-4 py-2 rounded-md shadow-md w-96 backdrop-blur-sm transition-all duration-300 ease-in-out"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        maxHeight: isExpanded ? "80vh" : "auto", // Limit maximum height when expanded
      }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-md truncate flex-1 pr-2">{artefact.title}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:opacity-80 flex-shrink-0"
          style={{ color: "var(--foreground)" }}
        >
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2 text-sm overflow-auto max-h-60">
          <p className="break-words">{artefact.text}</p>

          <div className="mt-3 text-xs opacity-70">
            <p>Region: {artefact.region}</p>
            <p>Date: {artefact.approx_date}</p>
            <p>Citation: {artefact.citation}</p>
          </div>

          <button
            onClick={() => onNodeSelect && onNodeSelect(null)}
            className="mt-3 text-xs hover:underline"
            style={{ color: "#3b82f6" }}
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
};
