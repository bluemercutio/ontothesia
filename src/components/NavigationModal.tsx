"use client";

import React, { useRef, useEffect } from "react";

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationModal: React.FC<NavigationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal with escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-background border border-border rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">How to Use This Tool</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <p>
            Ontothesia is an experiment in infinite cinema to experience
            cultural artefacts as imagined hyperobjects.
          </p>

          <h3 className="text-lg font-medium">The Library</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              View a collection of artefacts across space and time originating
              from the African continent.
            </li>
            <li>
              Each artefact can be clicked and viewed within a network of
              artefacts from the library, linked by their semantic similarities
              in an embedding vector map.
            </li>
          </ul>

          <h3 className="text-lg font-medium">The Gallery</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              The gallery is a set of experiences made up of scenes generated
              from the artefacts in the library
            </li>
            <li>
              Each scene is generated as a representation of one of the
              artefacts in the collection.
            </li>
            <li>
              After clicking an experience, you can choose to view it in within
              a dome or as a network of scenes.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavigationModal;
