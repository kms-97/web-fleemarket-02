import React from "react";
import styled from "@emotion/styled";
import Header from "@modules/Header";
import Text from "@base/Text";
import UserProfileForm from "@modules/UserProfileForm";

const UserProfilePage = () => {
  return (
    <Container>
      <Header backPath="/main">
        <Text>프로필</Text>
      </Header>
      <UserProfileForm />
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

export default UserProfilePage;
