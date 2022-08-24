import React from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

import InputBox from "@modules/InputBox";
import { useSignUpForm, useSignUpFormAction } from "@contexts/SignUpContext";
import { checkConfirmPassword, checkLengthByValue } from "@utils/validationHandler";
import Text from "@base/Text";
import Button from "@base/Button";

const SignUpForm = () => {
  const navigation = useNavigate();
  const {
    data: { userId, password, confirmPassword },
    isValid,
  } = useSignUpForm();
  const { handler } = useSignUpFormAction();

  const checkPassword = () => checkConfirmPassword(password.value, confirmPassword.value);

  const moveToLocation: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    navigation("/signup/location");
  };

  return (
    <Container onSubmit={moveToLocation}>
      <InputBox
        name="userId"
        defaultValue={userId.value}
        maxLength={20}
        validator={checkLengthByValue}
        onChange={(e) => handler(e, checkLengthByValue)}
      >
        <Text isBold={true}>아이디</Text>
      </InputBox>
      <InputBox
        type="password"
        name="password"
        defaultValue={password.value}
        maxLength={20}
        validator={checkLengthByValue}
        onChange={(e) => handler(e, checkLengthByValue)}
      >
        <Text isBold={true}>비밀번호</Text>
      </InputBox>
      <InputBox
        type="password"
        name="confirmPassword"
        defaultValue={confirmPassword.value}
        maxLength={20}
        validator={checkPassword}
        onChange={(e) => handler(e, checkPassword)}
      >
        <Text isBold={true}>비밀번호 확인</Text>
      </InputBox>
      <Button size="lg" disabled={!isValid}>
        지역선택
      </Button>
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

  & > button {
    margin-top: auto;
  }
`;

export default SignUpForm;
