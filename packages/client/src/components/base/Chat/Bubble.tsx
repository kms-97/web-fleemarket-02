import React from "react";
import styled from "@emotion/styled";
import Text from "@base/Text";
import { ColorType } from "@theme/.";

interface Props {
  isSeller: boolean;
  children?: React.ReactNode;
}

const Bubble: React.FC<Props> = ({ isSeller, children }) => {
  const fColor: ColorType = isSeller ? "WHITE" : "TITLE_ACTIVE";

  return (
    <StyledBubble isSeller={isSeller}>
      <Text fColor={fColor} size="sm">
        {children}
      </Text>
    </StyledBubble>
  );
};

const StyledBubble = styled.div<{ isSeller: boolean }>`
  border: 1px solid ${({ theme }) => theme.COLOR.PRIMARY1};

  background-color: ${({ theme, isSeller }) =>
    isSeller ? theme.COLOR.PRIMARY1 : theme.COLOR.OFF_WHITE};
  border-radius: ${({ isSeller }) => (isSeller ? "8px 0px 8px 8px" : "0px 8px 8px 8px")};

  padding: 8px;
`;

export default Bubble;
