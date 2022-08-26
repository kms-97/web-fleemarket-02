import React from "react";
import styled from "@emotion/styled";

interface Props {
  children?: React.ReactNode;
}

const DropDown = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 165px;

  background-color: ${({ theme }) => theme.COLOR.OFF_WHITE};
  box-shadow: 0px 0px 4px rgba(204, 204, 204, 0.5), 0px 2px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  border-radius: 10px;
  overflow: hidden;

  & > li {
    width: 100%;
    padding: 16px;
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

export default DropDown;
