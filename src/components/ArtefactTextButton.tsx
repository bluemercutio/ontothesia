import React, { useState } from "react";
import styled from "styled-components";
import { Artefact } from "@arkology-studio/ontothesia-types/artefact";

interface ArtefactTextButtonProps {
  isVisible?: boolean;
  artefact: Artefact;
}

const StyledButton = styled.button<{ $isVisible?: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 20px;
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

const TextContainer = styled.div<{
  $isVisible: boolean;
  $border?: boolean;
  $rounded?: boolean;
}>`
  position: fixed;
  bottom: 80px;
  left: 20px;
  background: var(--background);
  border: ${(props) => (props.$border ? "0.5px solid #fff" : "none")};
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: ${(props) => (props.$isVisible ? "block" : "none")};
  width: 400px;
  height: 300px;
  overflow-y: auto;
  border-radius: ${(props) => (props.$rounded ? "12px" : "0px")};
  pointer-events: ${(props) => (props.$isVisible ? "auto" : "none")};
`;

const ArtefactTextButton: React.FC<ArtefactTextButtonProps> = ({
  isVisible,
  artefact,
}) => {
  const [showText, setShowText] = useState<boolean>(false);

  return (
    <>
      <StyledButton
        $isVisible={isVisible}
        onClick={() => setShowText((prev) => !prev)}
      >
        {showText ? "Hide Text" : "Show Text"}
      </StyledButton>
      <TextContainer
        $isVisible={showText}
        $border={true}
        $rounded={true}
        onClick={(e) => e.stopPropagation()}
      >
        {showText && artefact && (
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              padding: "10px",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#fff" }}>{artefact.title}</h3>
            <p
              style={{
                color: "#aaa",
                fontStyle: "italic",
                fontSize: "0.9em",
                marginTop: "10px",
              }}
            >
              {artefact.approx_date}
            </p>
            <p
              style={{
                color: "#aaa",
                fontStyle: "italic",
                fontSize: "0.9em",
              }}
            >
              {artefact.region}
            </p>
            <br />
            <p style={{ color: "#fff", lineHeight: "1.6" }}>{artefact.text}</p>
          </div>
        )}
      </TextContainer>
    </>
  );
};

export default ArtefactTextButton;
