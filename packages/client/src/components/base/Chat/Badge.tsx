import React from "react";
import styled from "@emotion/styled";
import Text from "@base/Text";

interface Props {
  children?: React.ReactNode;
}

const Badge: React.FC<Props> = ({ children }) => {
  return (
    <StyledBadge>
      <Text size="xsm" fColor="WHITE">
        {children}
      </Text>
    </StyledBadge>
  );
};

const StyledBadge = styled.div`
  min-width: 22.5px;
  min-height: 22.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  font-weight: 400;
  background-color: ${({ theme }) => theme.COLOR.PRIMARY3};
  border-radius: 999px;
  text-align: center;
`;

export default Badge;
