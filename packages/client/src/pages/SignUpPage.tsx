import React, { useEffect } from "react";
import styled from "@emotion/styled";

import Text from "@base/Text";

import Header from "@modules/Header";
import SignUpForm from "@modules/SignUpForm";
import { SignUpFormProvider } from "@contexts/SignUpContext";
import { useToastMessageAction } from "@contexts/ToastMessageContext";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";

const SignUpPage = () => {
  const [cookie, removeCookie] = useCookies();
  const { pathname } = useLocation();
  const { addToastMessage } = useToastMessageAction();

  useEffect(() => {
    const githubToken = cookie["github"];

    if (!githubToken) return;
    console.log(githubToken);

    addToastMessage({
      isVisible: true,
      type: "notice",
      message: "github 연동 회원가입 진행중입니다.",
    });
    return () => {
      if (pathname === "/signup/location" || pathname === "/signup") {
        return;
      }

      removeCookie("github", null);
    };
  }, []);

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
