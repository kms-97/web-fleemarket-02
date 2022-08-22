import React from "react";
import styled from "@emotion/styled";

interface InputProps {
  iSize?: "lg" | "md";
}
interface Props extends React.InputHTMLAttributes<HTMLInputElement>, InputProps {}

const Input: React.FC<Props> = ({ iSize = "md", ...props }) => {
  return <StyledInput iSize={iSize} {...props} />;
};

const StyledInput = styled.input<InputProps>`
  width: 100%;
  min-height: ${({ iSize }) => (iSize === "lg" ? "40px" : "36px")};

  background-color: ${({ theme }) => theme.COLOR.WHITE};
  border: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  font-size: ${({ iSize }) => (iSize === "lg" ? "16px" : "14px")};
  padding: 8px ${({ iSize }) => (iSize === "lg" ? "16px" : "")};
  outline: none;

  &:focus,
  &:active {
    border-color: ${({ theme }) => theme.COLOR.PRIMARY1};
  }

  border-radius: 8px;
`;

export default Input;
