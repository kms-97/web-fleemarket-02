import React from "react";
import styled from "@emotion/styled";
import { requestGetLoginUserInfo, requestLogOut } from "@apis/auth";
import Button from "@base/Button";
import { useQuery } from "@hooks/useQuery";
import Text from "@base/Text";
import { useMutation } from "@hooks/useMutation";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);
  const [mutateLogout] = useMutation(requestLogOut, {
    cacheClear: true,
    onSuccess() {
      navigate("/");
    },
  });

  if (!user) return <></>;

  return (
    <Container>
      <Text isBold={true} size="lg">
        {user.name}
      </Text>
      <Text isBold={true} size="lg">
        GitHub: {user.github ? user.github.name : "연동안됨"}
      </Text>
      <Button size="lg" onClick={mutateLogout}>
        로그아웃
      </Button>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 34px;
  padding: 16px;
`;

export default UserProfile;
