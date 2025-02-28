import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="px-4 py-2 bg-[var(--primary-bg)] text-white rounded hover:bg-[var(--primary-bg-hover)] transition-colors duration-300"
    >
      {label}
    </button>
  );
};

export default Button;
