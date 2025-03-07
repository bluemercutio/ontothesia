import React from "react";
import Image from "next/image";

interface CardProps {
  title?: string;
  description?: string;
  text?: string;
  imageUrl?: string;
  imageUrls?: string[];
  width?: string;
  height?: string;
  component?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  text,
  imageUrl,
  imageUrls,
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
      {imageUrls && imageUrls.length > 0 ? (
        <div className="w-full aspect-square relative flex">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="h-full flex-1 relative"
              style={{
                borderRight:
                  index < imageUrls.length - 1
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "none",
              }}
            >
              <Image
                src={url}
                alt={`${title} scene ${index + 1}`}
                width={1024}
                height={1024}
                className="object-cover w-full h-full"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      ) : imageUrl ? (
        <div className="w-full aspect-square relative">
          <Image
            src={imageUrl}
            alt={title || ""}
            width={1024}
            height={1024}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      ) : null}
      <div className=" flex-1 flex flex-col">
        {title && <h3 className="text-lg ">{title}</h3>}
        {text && <p className="text-white text-sm mt-5 ">{text}</p>}

        {component && <div className="mt-2">{component}</div>}
      </div>
    </div>
  );
};

export default Card;
