import React from "react";
import styled from "@emotion/styled";
import Text from "@base/Text";
import GithubIcon from "@icons/GithubIcon";
import { AUTH } from "@constants/auth";

const GithubLoginButton = () => {
  const onClick = () => {
    window.location.href = AUTH.GITHUB_LOGIN;
  };

  return (
    <StyledButton onClick={onClick}>
      <Text size="lg" isBold={true} fColor="WHITE">
        깃허브로 로그인
      </Text>
      <GithubIcon />
    </StyledButton>
  );
};

const StyledButton = styled.button`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  padding: 10px 16px;

  background-color: ${({ theme }) => theme.COLOR.TITLE_ACTIVE};

  border-radius: 8px;

  & svg {
    fill: ${({ theme }) => theme.COLOR.WHITE};
  }
`;

export default GithubLoginButton;
