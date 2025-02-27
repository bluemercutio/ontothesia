"use client";

import React from "react";
import styled from "styled-components";

interface NavItemProps {
  $isActive?: boolean;
}

const NavContainer = styled.nav`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--background);
  border-radius: 0px;
  border: 1px solid #fff;
  padding: 12px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 24px;
  z-index: 1000;
`;

const NavItem = styled.button<NavItemProps>`
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
  color: ${(props) => (props.$isActive ? "#fff" : "#fff")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #000;
    transform: scaleX(${(props) => (props.$isActive ? 1 : 0)});
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "home", label: "HOME" },
    { id: "gallery", label: "GALLERY" },
    { id: "cinema", label: "CINEMA" },
    { id: "library", label: "LIBRARY" },
    { id: "project", label: "PROJECT" },
  ];

  return (
    <NavContainer>
      {tabs.map((tab) => (
        <NavItem
          key={tab.id}
          $isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </NavItem>
      ))}
    </NavContainer>
  );
};

export default Navbar;
