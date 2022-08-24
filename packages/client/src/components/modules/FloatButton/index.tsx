import React from "react";
import styled from "@emotion/styled";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  fixedPos?: "left" | "right";
}

const FloatButton = ({ fixedPos = "left", children, type = "button", ...props }: Props) => (
  <StyleFloatButton {...props} fixedPos={fixedPos} type={type}>
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

  &:disabled & path {
    stroke: ${({ theme }) => theme.COLOR.GRAY1};
  }
`;

export default FloatButton;
