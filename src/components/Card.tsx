import React from "react";
import Image from "next/image";

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
  text,
  imageUrl,
  width,
  height,
  component,
}) => {
  return (
    <div
      className={`relative ${width || "w-64"} ${
        height || "h-80"
      } overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col`}
      style={{ background: "var(none)" }}
    >
      {imageUrl && (
        <div className="w-full aspect-square relative">
          <Image
            src={imageUrl}
            alt={title}
            width={1024}
            height={1024}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        {component && <div className="mt-2">{component}</div>}
        {text && <p className="text-gray-600 text-sm mt-auto">{text}</p>}
      </div>
    </div>
  );
};

export default Card;
