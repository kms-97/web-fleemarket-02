import React, { useCallback, useRef } from "react";
import Button from "@base/Button";
import Input from "@base/Input";
import styled from "@emotion/styled";
import Text from "@base/Text";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigation = useNavigate();
  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit: React.FormEventHandler = useCallback(
    (e) => {
      e.preventDefault();
    },
    [idRef, passwordRef],
  );

  const moveToSignupPape = () => {
    navigation("/signup");
  };

  return (
    <Container onSubmit={onSubmit}>
      <Input iSize="lg" ref={idRef} placeholder="아이디를 입력하세요." />
      <Input iSize="lg" ref={passwordRef} placeholder="비밀번호를를 입력하세요." type="password" />
      <Button size="lg">로그인</Button>
      <Text size="lg" isBold={true} onClick={moveToSignupPape}>
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
`;

export default LoginForm;
