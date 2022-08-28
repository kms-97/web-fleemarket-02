import React from "react";
import Text from "@base/Text";
import styled from "@emotion/styled";

const EmptyList = ({ text }: { text: string }) => {
  return (
    <Container>
      <Text fColor="GRAY1">{text}</Text>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export default EmptyList;
