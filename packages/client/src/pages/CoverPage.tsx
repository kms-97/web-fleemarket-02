import React from "react";
import styled from "@emotion/styled";

import Button from "@base/Button";
import Text from "@base/Text";
import { useNavigate } from "react-router-dom";

const CoverPage = () => {
  const navigation = useNavigate();

  const moveToLoginPage = () => {
    navigation("/login");
  };

  const moveToSignUpPage = () => {
    navigation("/signup");
  };

  return (
    <Container>
      <TitleSection>
        <h2>우아</h2>
        <h1>마켓</h1>
      </TitleSection>
      <ButtonForm>
        <Button size="lg" onClick={moveToLoginPage}>
          로그인
        </Button>
        <Text size="lg" isBold={true} onClick={moveToSignUpPage}>
          회원가입
        </Text>
      </ButtonForm>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR.WHITE};

  padding: 20px;
`;

const TitleSection = styled.section`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  & > h1 {
    font-size: 55px;
    color: ${({ theme }) => theme.COLOR.PRIMARY1};
  }

  & > h2 {
    font-size: 45px;
    color: ${({ theme }) => theme.COLOR.TITLE_ACTIVE};
  }
`;

const ButtonForm = styled.section`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  row-gap: 20px;

  & > button {
    font-size: 24px;
    font-weight: 500;
  }
  & > p {
    cursor: pointer;
  }
`;

export default CoverPage;
