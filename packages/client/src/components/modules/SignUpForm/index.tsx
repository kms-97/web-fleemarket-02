import React, { useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

import InputBox from "@modules/InputBox";
import { useSignUpForm, useSignUpFormAction } from "@contexts/SignUpContext";
import { checkConfirmPassword, checkLengthByValue } from "@utils/validationHandler";
import Text from "@base/Text";
import Button from "@base/Button";
import { useMutation } from "@hooks/useMutation";
import { requestGetUserByUserId } from "@apis/user";

const SignUpForm = () => {
  const navigation = useNavigate();
  const {
    data: { userId, password, confirmPassword, name },
    isValid,
  } = useSignUpForm();
  const [error, setError] = useState<string | null>(null);
  const { handler } = useSignUpFormAction();
  const [getUserByUserIdMutation] = useMutation(requestGetUserByUserId, {
    onSuccess(data) {
      if (data?.id) {
        setError("이미 존재하는 아이디입니다.");
      } else {
        navigation("/signup/location");
      }
    },
    onError(error) {
      setError(error);
    },
  });

  const checkPassword = () => checkConfirmPassword(password.value, confirmPassword.value);

  const moveToLocation: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    getUserByUserIdMutation({ userId: userId.value });
  };

  return (
    <Container onSubmit={moveToLocation}>
      <InputBox
        name="name"
        defaultValue={name.value}
        placeholder="영문, 숫자 조합 20자 이하"
        maxLength={20}
        validator={checkLengthByValue}
        onChange={(e) => handler(e, checkLengthByValue)}
      >
        <Text isBold={true}>이름</Text>
      </InputBox>
      <InputBox
        name="userId"
        defaultValue={userId.value}
        placeholder="영문, 숫자 조합 20자 이하"
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
        placeholder="영문, 숫자 조합 20자 이하"
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
        placeholder="영문, 숫자 조합 20자 이하"
        maxLength={20}
        validator={checkPassword}
        onChange={(e) => handler(e, checkPassword)}
      >
        <Text isBold={true}>비밀번호 확인</Text>
      </InputBox>
      {error && (
        <Text size="xsm" fColor="ERROR">
          {error}
        </Text>
      )}
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
`;

export default SignUpForm;
