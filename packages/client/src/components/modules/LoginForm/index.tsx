import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

import Button from "@base/Button";
import Text from "@base/Text";
import { useInput } from "@src/hooks/useInput";
import GithubLoginButton from "@modules/GithubLoginButton";
import InputBox from "../InputBox";

const LoginForm = () => {
  const navigation = useNavigate();
  const [userId, onChangeUserId] = useInput();
  const [password, onChangePassword] = useInput();

  const onSubmit: React.FormEventHandler = useCallback((e) => {
    e.preventDefault();
  }, []);

  const moveToSignUpPage = () => {
    navigation("/signup");
  };

  return (
    <Container onSubmit={onSubmit}>
      <InputBox
        value={userId}
        onChange={onChangeUserId}
        iSize="lg"
        placeholder="아이디를 입력하세요."
      />
      <InputBox
        value={password}
        onChange={onChangePassword}
        iSize="lg"
        placeholder="비밀번호를 입력하세요."
      />

      <Button size="lg">로그인</Button>
      <GithubLoginButton />
      <Text size="lg" isBold={true} onClick={moveToSignUpPage}>
        회원가입
      </Text>
    </Container>
  );
};

const Container = styled.form`
  flex: 1;
  width: 100%;
  padding: 24px 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  row-gap: 24px;

  & > p:last-child {
    cursor: pointer;
  }
`;

export default LoginForm;
