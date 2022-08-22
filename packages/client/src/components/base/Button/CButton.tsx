import React from "react";
import styled from "@emotion/styled";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const CButton: React.FC<Props> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

const StyledButton = styled.button`
  display: flex;
  padding: 4px 16px;

  background-color: ${({ theme }) => theme.COLOR.PRIMARY1};
  border-radius: 999px;
`;

export default CButton;
