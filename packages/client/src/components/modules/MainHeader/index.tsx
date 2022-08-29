import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import FloatButton from "../FloatButton";
import CategoryIcon from "@icons/CategoryIcon";
import UserIcon from "@icons/UserIcon";

interface Props {
  children?: React.ReactNode;
}

const MainHeader = ({ children }: Props) => {
  const navigation = useNavigate();

  const moveToCategoryPage = () => {
    navigation("/category");
  };

  const moveToProfilePage = () => {
    navigation("/profile?tab=내 정보");
  };

  return (
    <Container>
      <FloatButton className="category" onClick={moveToCategoryPage}>
        <CategoryIcon />
      </FloatButton>
      {children}
      <FloatButton className="profile" fixedPos="right" onClick={moveToProfilePage}>
        <UserIcon />
      </FloatButton>
    </Container>
  );
};

export const Container = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: ${({ theme }) => theme.COLOR.PRIMARY1};

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 56px;
  padding: 17px;
  border-radius: 8px 8px 16px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  > button {
    display: flex;
    align-items: center;
    column-gap: 4px;
  }

  path,
  circle {
    stroke: ${({ theme }) => theme.COLOR.WHITE};
  }
`;

export default MainHeader;
