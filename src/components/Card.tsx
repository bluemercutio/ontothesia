import React from "react";

interface CardProps {
  title: string;
  description?: string;
  text?: string;
  imageUrl?: string;
  width?: string;
  height?: string;
  component?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  text,
  imageUrl,
  width,
  height,
  component,
}) => {
  console.log("width:", width);
  return (
    <div
      className={`relative ${width || "w-64"} ${
        height || "h-80"
      } overflow-hidden transition-transform duration-300 hover:scale-105 `}
      style={{ background: "var(none)" }}
    >
      {imageUrl && (
        <div className="w-full h-1/3">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4 h-2/3">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
        {component && <div className="mt-2">{component}</div>}
      </div>
      {text && <p className="text-gray-600 text-sm p-4 ">{text}</p>}
    </div>
  );
};

export default Card;
