import Text from "@base/Text";
import styled from "@emotion/styled";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
}

const Tab: React.FC<Props> = ({ children, isActive = false, ...props }) => {
  return (
    <StyledTab className={isActive ? "active" : ""} {...props}>
      <Text size="sm" fColor={isActive ? "PRIMARY1" : "GRAY1"}>
        {children}
      </Text>
    </StyledTab>
  );
};

const StyledTab = styled.div`
  padding: 12px 8px;
  cursor: pointer;

  &:hover {
    & > p {
      color: ${({ theme }) => theme.COLOR.PRIMARY1};
    }
  }
  border-bottom: 2px solid ${({ theme }) => theme.COLOR.GRAY3};

  &.active {
    border-bottom: 2px solid ${({ theme }) => theme.COLOR.PRIMARY1};
  }
`;

export default Tab;
