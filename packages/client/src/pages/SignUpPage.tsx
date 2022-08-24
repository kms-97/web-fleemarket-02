import React from "react";
import styled from "@emotion/styled";

import Text from "@base/Text";

import Header from "@modules/Header";
import SignUpForm from "@modules/SignUpForm";
import { SignUpFormProvider } from "@contexts/SignUpContext";

const SignUpPage = () => {
  return (
    <SignUpFormProvider>
      <Container>
        <Header>
          <Text>회원가입</Text>
        </Header>
        <SignUpForm />
      </Container>
    </SignUpFormProvider>
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

export default SignUpPage;
