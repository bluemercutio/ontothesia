import React from "react";
import { Artefact as ArtefactType } from "@arkology-studio/ontothesia-types/artefact";

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
        border border-[var(--border-light)]
      `}
    >
      <div className="p-5 space-y-3">
        {approx_date && (
          <p className="text-[var(--text-light)] text-sm leading-relaxed">
            {approx_date}
          </p>
        )}
        {region && (
          <div className="mt-4 border-t border-[var(--border-medium)] pt-4 text-[var(--text-on-primary)]">
            {region}
          </div>
        )}
        {text && (
          <p className="text-[var(--text-medium)] text-sm italic">
            {text.length > 250 ? `${text.substring(0, 247)}...` : text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Artefact;
