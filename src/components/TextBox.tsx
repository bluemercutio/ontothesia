import React from "react";

interface TextBoxProps {
  title?: string;
  content: string;
}

const TextBox: React.FC<TextBoxProps> = ({ title, content }) => {
  return (
    <div className="bg-[var(--primary-bg)] rounded-lg shadow-md px-12 py-6 mb-6 w-1/2 ">
      {title && (
        <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
      )}
      <div className="prose prose-slate max-w-none">
        <p className="text-white leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default TextBox;
