import React from "react";
import styled from "@emotion/styled";
import { FontSizeType } from "@theme/.";

export interface ButtonProps {
  size?: FontSizeType;
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonProps {}

const Button: React.FC<Props> = ({ children, size = "md", ...props }) => {
  return (
    <StyledButton size={size} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<ButtonProps>`
  width: ${({ size }) => (size === "lg" ? "100%" : "auto")};

  background-color: ${({ theme }) => theme.COLOR.PRIMARY1};
  border: 1px solid ${({ theme }) => theme.COLOR.PRIMARY1};
  color: ${({ theme }) => theme.COLOR.WHITE};

  font-size: ${({ size }) => (size === "lg" ? "16px" : "14px")};
  padding: ${({ size }) => (size === "lg" ? "10px" : "8px")} 16px;

  border-radius: 8px;

  transition: background-color 0.2s;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.COLOR.PRIMARY3};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.COLOR.PRIMARY2};
  }
  &:focus {
    border: 1px solid ${({ theme }) => theme.COLOR.PRIMARY2};
  }
`;

export default Button;
