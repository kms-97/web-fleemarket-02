import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

import Button from "@base/Button";
import Text from "@base/Text";
import Input from "@base/Input";
import GithubLoginButton from "@modules/GithubLoginButton";

import { useInput } from "@hooks/useInput";
import { useMutation } from "@hooks/useMutation";
import { requestLogIn } from "@apis/auth";
import { useToastMessageAction } from "@contexts/ToastMessageContext";

const LoginForm = () => {
  const navigation = useNavigate();
  const [userId, onChangeUserId] = useInput();
  const [password, onChangePassword] = useInput();
  const [error, setError] = useState<string | null>(null);
  const { addToastMessage } = useToastMessageAction();
  const [mutateSignIn] = useMutation(requestLogIn, {
    onSuccess() {
      navigation("/main");
    },
    onError(_error) {
      setError(_error);
      addToastMessage({ type: "error", message: _error, isVisible: true });
    },
    cacheClear: true,
  });

  const onSubmit: React.FormEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      mutateSignIn({ userId, password });
    },
    [userId, password],
  );

  const moveToSignUpPage = () => {
    navigation("/signup");
  };

  return (
    <Container onSubmit={onSubmit}>
      <Input
        value={userId}
        onChange={onChangeUserId}
        iSize="lg"
        placeholder="아이디를 입력하세요."
      />
      <Input
        value={password}
        type="password"
        onChange={onChangePassword}
        iSize="lg"
        placeholder="비밀번호를 입력하세요."
      />
      {error && (
        <Text size="xsm" fColor="ERROR">
          {error}
        </Text>
      )}
      <Button size="lg" disabled={!(userId && password)}>
        로그인
      </Button>
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
