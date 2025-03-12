import React, { useState } from "react";
import styled from "styled-components";
import { Network } from "./Network";
import { EmbeddingNetwork, GraphNode } from "../services/graph/interface";
import { Artefact } from "@ontothesia/types/artefact";

interface MapButtonProps {
  isVisible?: boolean;
  data: EmbeddingNetwork;
  currentNodeId: string;
  setSelectedNode: (node: GraphNode) => void;
  artefact: Artefact;
}

const StyledMapButton = styled.button<{ $isVisible?: boolean }>`
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

const NetworkContainer = styled.div<{
  $isVisible: boolean;
  $border?: boolean;
  $rounded?: boolean;
}>`
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: var(--background);
  border: ${(props) => (props.$border ? "0.5px solid #fff" : "none")};
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: ${(props) => (props.$isVisible ? "block" : "none")};
  width: 400px;
  height: 300px;
  overflow: hidden;
  border-radius: ${(props) => (props.$rounded ? "12px" : "0px")};
  pointer-events: ${(props) =>
    props.$isVisible ? "auto" : "none"}; /* Only capture events when visible */
`;

const MapButton: React.FC<MapButtonProps> = ({
  isVisible,
  data,
  currentNodeId,
  setSelectedNode,
  artefact,
}) => {
  const [showNetwork, setShowNetwork] = useState<boolean>(false);

  return (
    <>
      <StyledMapButton
        $isVisible={isVisible}
        onClick={() => setShowNetwork((prev) => !prev)}
      >
        {showNetwork ? "Hide Map" : "Show Map"}
      </StyledMapButton>
      <NetworkContainer
        $isVisible={showNetwork}
        $border={true}
        $rounded={true}
        onClick={(e) => e.stopPropagation()}
      >
        {showNetwork && data && (
          <div
            style={{ width: "100%", height: "100%", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Network
              data={data}
              width={376}
              height={276}
              currentNodeId={currentNodeId}
              handleSelectedNode={setSelectedNode}
              artefact={artefact}
            />
          </div>
        )}
      </NetworkContainer>
    </>
  );
};

export default MapButton;
