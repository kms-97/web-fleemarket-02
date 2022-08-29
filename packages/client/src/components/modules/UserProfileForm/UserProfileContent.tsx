import React from "react";
import styled from "@emotion/styled";
import UserProductList from "@modules/ProductList/UserProductList";
import UserWishList from "@modules/ProductList/UserWishList";
import { useQuery } from "@hooks/useQuery";
import { requestGetLoginUserInfo } from "@apis/auth";
import UserChatList from "./UserChatList";
import UserProfile from "./UserProfile";
import { ITabState } from ".";

interface Props {
  tabs: ITabState[];
}

const UserProfileContent = ({ tabs }: Props) => {
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo, {
    cacheExpiredTime: Infinity,
  });
  const selectedTab = tabs.find((tabState) => tabState.isSelected);

  const element = () => {
    if (!selectedTab || !user) {
      return;
    }

    switch (selectedTab.name) {
      case "판매목록":
        return <UserProductList />;
      case "관심목록":
        return <UserWishList />;
      case "채팅":
        return <UserChatList />;
      case "내 정보":
        return <UserProfile />;
      default:
        return <></>;
    }
  };

  return <Container>{element()}</Container>;
};

const Container = styled.section`
  flex: 1;
  width: 100%;

  overflow-y: auto;
`;

export default UserProfileContent;
