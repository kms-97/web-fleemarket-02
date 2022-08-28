import styled from "@emotion/styled";
import DownIcon from "@icons/DownIcon";
import React from "react";

type Props = React.HTMLAttributes<HTMLButtonElement>;

const SButton = ({ children, ...props }: Props) => {
  return (
    <StyledButton {...props}>
      {children}
      <DownIcon />
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;

  border: 1px solid ${({ theme }) => theme.COLOR.GRAY1};
  border-radius: 8px;

  padding: 10px 16px;
  column-gap: 8px;
`;

export default SButton;
