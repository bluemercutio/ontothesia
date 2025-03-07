"use client";

import React, { memo } from "react";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { EmbeddingNetwork } from "../services/graph/interface";

interface NavItemProps {
  $isActive?: boolean;
}

interface NavContainerProps {
  $isVisible?: boolean;
}

const NavContainer = styled.nav<NavContainerProps>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--background);
  border-radius: 0px;
  border: 0.5px solid #fff;
  padding: 12px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 24px;
  z-index: 1000;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
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
  networkData?: EmbeddingNetwork;
}

const Navbar: React.FC<NavbarProps> = memo(
  ({ activeTab, onTabChange, networkData }) => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = React.useState(true);
    const [lastMouseMove, setLastMouseMove] = React.useState(Date.now());

    React.useEffect(() => {
      if (networkData) {
        console.log("Network data in Navbar:", {
          nodes: networkData.nodes?.length,
          edges: networkData.edges?.length,
        });
      }
    }, [networkData]);

    // Check if current path matches the pattern /gallery/{id}/network or /gallery/{id}/dome
    const shouldAutoHide = React.useMemo(() => {
      return pathname
        ? /^\/gallery\/[^/]+\/(network|dome)$/.test(pathname)
        : false;
    }, [pathname]);

    React.useEffect(() => {
      if (!shouldAutoHide) {
        setIsVisible(true);
        return;
      }

      const handleMouseMove = () => {
        setIsVisible(true);
        setLastMouseMove(Date.now());
      };

      const checkMouseIdle = () => {
        if (Date.now() - lastMouseMove > 2000) {
          // 2 seconds delay
          setIsVisible(false);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      const interval = setInterval(checkMouseIdle, 500);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        clearInterval(interval);
      };
    }, [shouldAutoHide, lastMouseMove]);

    const tabs = [
      { id: "home", label: "HOME" },
      { id: "gallery", label: "GALLERY" },
      // { id: "cinema", label: "CINEMA" },
      { id: "library", label: "LIBRARY" },
      { id: "project", label: "PROJECT" },
    ];

    return (
      <>
        <NavContainer $isVisible={!shouldAutoHide || isVisible}>
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
      </>
    );
  }
);

Navbar.displayName = "Navbar";

export default Navbar;
