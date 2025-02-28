import React from "react";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="h-15 w-full flex items-center justify-center py-6">
      <h4 className="text-4xl font-[var(--font-kanit)]">{title}</h4>
    </header>
  );
}
