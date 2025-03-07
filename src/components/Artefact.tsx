import React from "react";
import { Artefact as ArtefactType } from "@/types/artefact";

const Artefact: React.FC<ArtefactType> = ({ text, region, approx_date }) => {
  return (
    <div
      className={`
        w-72
        h-72
        bg-[var(--primary-bg)]
        rounded-xl 
        shadow-lg 
        overflow-hidden 
        transform 
        transition-all 
        duration-300 
        hover:scale-[1.02] 
        hover:shadow-xl
        border border-gray-200 dark:border-gray-700
      `}
    >
      <div className="p-5 space-y-3">
        {approx_date && (
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {approx_date}
          </p>
        )}
        {region && (
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
            {region}
          </div>
        )}
        {text && (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">
            {text.length > 250 ? `${text.substring(0, 247)}...` : text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Artefact;
