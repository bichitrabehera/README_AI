"use client";

import styled from "styled-components";

const Pattern = () => {
  return (
    <Wrapper>
      <div className="grid" />
      <div className="fade" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;

  .grid {
    position: absolute;
    inset: 0;

    background-image:
      linear-gradient(to right, #111 1px, transparent 1px),
      linear-gradient(to bottom, #111 1px, transparent 1px);

    background-size: 40px 40px;
    opacity: 0.6;
  }

  /* soft vignette fade for nicer hero background */
  .fade {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      transparent 0%,
      rgba(0,0,0,0.6) 60%,
      rgba(0,0,0,0.95) 100%
    );
    pointer-events: none;
  }
`;

export default Pattern;