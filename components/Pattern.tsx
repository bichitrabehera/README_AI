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

  background-color: #000000;

  .grid-background {
    position: absolute;
    inset: 0;
    z-index: 0;

    background-image:
      linear-gradient(to right, #111 1px, transparent 1px),
      linear-gradient(to bottom, #111 1px, transparent 1px);

    background-size: 40px 40px;

    
  }
`;

export default Pattern;
