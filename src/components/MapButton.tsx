import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Network } from "./Network";
import { EmbeddingNetwork } from "../services/graph/interface";

interface MapButtonProps {
  $isVisible?: boolean;
  onClick: () => void;
  data?: EmbeddingNetwork;
}

const StyledMapButton = styled.button<MapButtonProps>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--background);
  border: 0.5px solid #fff;
  padding: 12px 24px;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const NetworkContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: var(--background);
  border: 0.5px solid #fff;
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: ${(props) => (props.isVisible ? "block" : "none")};
  width: 400px;
  height: 300px;
  overflow: hidden;
`;

const MapButton: React.FC<MapButtonProps> = ({ $isVisible, onClick, data }) => {
  const [showNetwork, setShowNetwork] = useState(false);

  useEffect(() => {
    if (showNetwork) {
      console.log("Network should be visible", {
        hasData: !!data,
        dataNodes: data?.nodes?.length,
        dataEdges: data?.edges?.length,
      });
    }
  }, [showNetwork, data]);

  const handleClick = () => {
    setShowNetwork(!showNetwork);
    onClick();
  };

  return (
    <>
      <StyledMapButton $isVisible={$isVisible} onClick={handleClick}>
        {showNetwork ? "Hide Map" : "Show Map"}
      </StyledMapButton>
      <NetworkContainer isVisible={showNetwork}>
        {showNetwork && data && (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Network
              data={data}
              width={376}
              height={276}
              startingNode={data.nodes[0]?.id}
            />
          </div>
        )}
      </NetworkContainer>
    </>
  );
};

export default MapButton;
