import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserProfileContent from "./UserProfileContent";
import UserTabList from "./UserTabList";

const TAB = ["내 정보", "판매목록", "관심목록", "채팅"];

export interface ITabState {
  isSelected: boolean;
  name: string;
}

const UserProfileForm = () => {
  const { search, pathname } = useLocation();
  const navigation = useNavigate();
  const query = new URLSearchParams(search).get("tab");
  const [tabs, setTabs] = useState<ITabState[]>(() =>
    TAB.map<ITabState>((tab) => ({ isSelected: tab === query, name: tab })),
  );

  useEffect(() => {
    const selectedTab = tabs.find((tab) => tab.name === query);

    if (!selectedTab && pathname === "/profile") {
      navigation(`/profile?tab=${TAB[0]}`, { replace: true });
    }

    const newTabs = tabs.map<ITabState>(({ name }) => ({ name, isSelected: query === name }));
    setTabs(newTabs);
  }, [query]);

  return (
    <Container>
      <UserTabList tabs={tabs} />
      <UserProfileContent tabs={tabs} />
    </Container>
  );
};

const Container = styled.section`
  flex: 1;
  width: 100%;

  display: flex;
  flex-direction: column;
`;

export default UserProfileForm;
