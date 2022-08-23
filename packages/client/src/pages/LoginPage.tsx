import React from "react";
import Header from "@components/modules/Header";
import styled from "@emotion/styled";
import Text from "@base/Text";
import LoginForm from "@components/modules/LoginForm";

const LoginPage = () => {
  return (
    <Container>
      <Header>
        <Text>로그인</Text>
      </Header>
      <LoginForm />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR.WHITE};
`;

export default LoginPage;
