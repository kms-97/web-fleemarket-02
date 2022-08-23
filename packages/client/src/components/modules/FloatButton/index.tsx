import styled from "@emotion/styled";
import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick: () => void;
  fixedPos?: "left" | "right";
}

const FloatButton = ({ fixedPos = "left", onClick, children, ...props }: Props) => (
  <StyleFloatButton {...props} fixedPos={fixedPos} onClick={onClick}>
    {children}
  </StyleFloatButton>
);

const StyleFloatButton = styled.button<{ fixedPos?: "left" | "right" }>`
  position: absolute;
  top: 16px;
  ${({ fixedPos }) => (fixedPos == "left" ? "left: 16px;" : "right: 16px;")}

  & path {
    transition: stroke 0.2s;
  }
`;

export default FloatButton;
