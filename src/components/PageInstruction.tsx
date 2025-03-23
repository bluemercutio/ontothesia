import React from "react";

type PageInstructionProps = {
  text: string;
};

const PageInstruction: React.FC<PageInstructionProps> = ({ text }) => {
  return <div className="text-2xl font-bold py-16 text-center">{text}</div>;
};

export default PageInstruction;
