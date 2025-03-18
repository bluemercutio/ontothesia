import React from "react";

interface TextBoxProps {
  title?: string;
  content: string;
}

const TextBox: React.FC<TextBoxProps> = ({ title, content }) => {
  return (
    <div className="bg-black shadow-md px-16 py-10 mb-6 justify-left">
      {title && (
        <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
      )}
      <div className="prose prose-slate max-w-none">
        <p className="text-white leading-relaxed text-justify">{content}</p>
      </div>
    </div>
  );
};

export default TextBox;
