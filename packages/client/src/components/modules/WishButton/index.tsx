import styled from "@emotion/styled";
import HeartIcon from "@icons/HeartIcon";
import React from "react";

interface Props {
  isActive: boolean;
  className?: string;
  onClick: React.MouseEventHandler;
}

const WishButton = ({ isActive, className, onClick }: Props) => {
  return (
    <Container isActive={isActive} className={className} onClick={onClick}>
      <HeartIcon />
    </Container>
  );
};

const Container = styled.button<{ isActive: boolean }>`
  > svg {
    fill: ${({ theme, isActive }) => (isActive ? theme.COLOR.PRIMARY1 : "")};
    > path {
      stroke: ${({ theme, isActive }) => (isActive ? theme.COLOR.PRIMARY1 : theme.COLOR.GRAY1)};
    }
  }
`;

export default WishButton;
