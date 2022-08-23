import styled from "@emotion/styled";
import React from "react";

interface Props {
  children?: React.ReactNode;
}

const Template = ({ children }: Props) => {
  return <StyledTemplate>{children}</StyledTemplate>;
};

const StyledTemplate = styled.div`
  width: 480px;
  height: 844px;

  border: 1px solid ${({ theme }) => theme.COLOR.GRAY3};
  background-color: ${({ theme }) => theme.COLOR.WHITE};
  border-radius: 8px;
  overflow-x: hidden;
  overflow-y: auto;

  .transition-group {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .fade-enter {
    position: absolute;
    top: 0;
    transform: translateX(-100%);
    z-index: 1;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .fade-enter-active {
    transform: translateX(0);
    transition: transform 0.35s ease-out;
  }

  .fade-exit {
    transform: translateX(0);
  }

  .fade-exit-active {
    transform: translateX(50%);
    transition: transform 0.35s ease-out;
  }
`;

export default Template;
