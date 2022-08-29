import React from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { ITabState } from ".";
import Tab from "@base/Tab";

interface Props {
  tabs: ITabState[];
}

const UserTabList = ({ tabs }: Props) => {
  return (
    <Container>
      {tabs.map(({ isSelected, name }) => (
        <Link to={`/profile?tab=${name}`} key={name}>
          <Tab isActive={isSelected}>{name}</Tab>
        </Link>
      ))}
    </Container>
  );
};

const Container = styled.main`
  width: 100%;
  display: flex;
  background-color: ${({ theme }) => theme.COLOR.OFF_WHITE};

  & > * {
    flex: 1;
  }
`;

export default UserTabList;
