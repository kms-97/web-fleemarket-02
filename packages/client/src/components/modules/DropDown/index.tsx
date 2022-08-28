import React, { MouseEventHandler } from "react";
import styled from "@emotion/styled";

interface Props {
  children?: React.ReactNode;
  onClick?: MouseEventHandler;
}

const DropDown = ({ children, onClick }: Props, ref: React.ForwardedRef<HTMLUListElement>) => {
  return (
    <Container ref={ref} onClick={onClick}>
      {children}
    </Container>
  );
};

const Container = styled.ul`
  position: absolute;
  width: 165px;

  background-color: ${({ theme }) => theme.COLOR.OFF_WHITE};
  box-shadow: 0px 0px 4px rgba(204, 204, 204, 0.5), 0px 2px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  border-radius: 10px;
  overflow: hidden;

  z-index: 1;

  & > li {
    width: 100%;
    padding: 10px;
    text-decoration: none;
    list-style: none;
    cursor: pointer;
    transition: background-color 0.3s;

    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};
    }

    &:hover {
      background-color: ${({ theme }) => theme.COLOR.GRAY3};
    }
  }
`;

export default React.forwardRef(DropDown);
