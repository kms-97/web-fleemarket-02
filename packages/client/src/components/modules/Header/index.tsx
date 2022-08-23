import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import LeftIcon from "@icons/LeftIcon";
import FloatButton from "../FloatButton";

interface Props {
  children?: React.ReactNode;
}

const Header = ({ children }: Props) => {
  const navigation = useNavigate();

  const moveToBack = () => {
    navigation(-1);
  };

  return (
    <Container>
      <FloatButton className="back" onClick={moveToBack}>
        <LeftIcon />
      </FloatButton>
      {children}
    </Container>
  );
};

export const Container = styled.header`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.COLOR.OFF_WHITE};

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 56px;
  padding: 17px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  & > .back:hover path {
    stroke: ${({ theme }) => theme.COLOR.PRIMARY1};
  }
`;

export default Header;
