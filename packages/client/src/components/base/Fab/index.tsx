import React from "react";
import Button, { ButtonProps } from "@base/Button";
import styled from "@emotion/styled";
import PlusIcon from "@icons/PlusIcon";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonProps {}

const Fab = ({ ...props }: Props) => {
  return (
    <StyledButton {...props}>
      <PlusIcon />
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;
  border-radius: 50%;

  & svg,
  & path {
    stroke: ${({ theme }) => theme.COLOR.WHITE};
  }
`;

export default Fab;
