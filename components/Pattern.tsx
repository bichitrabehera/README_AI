"use client";

import styled from "styled-components";

const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="grid-background" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  background-color: #f8fafc;

  .grid-background {
    position: absolute;
    inset: 0;
    z-index: 0;

    background-image:
      linear-gradient(to right, #e2e8f0 1px, transparent 1px),
      linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);

    background-size: 24px 24px;

    
  }
`;

export default Pattern;
