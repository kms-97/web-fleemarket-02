import React from "react";
import styled from "@emotion/styled";

interface Props {
  totalIndex: number;
  currentIndex: number;
}

const Indicator = ({ totalIndex, currentIndex }: Props) => {
  return (
    <Container>
      {Array(totalIndex)
        .fill(0)
        .map((_, idx) => {
          if (idx === currentIndex) return <li key={idx} className="filled" />;
          else return <li key={idx} />;
        })}
    </Container>
  );
};

const Container = styled.ul`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  column-gap: 8px;

  li {
    width: 16px;
    height: 16px;
    border-radius: 99px;

    border: 1px solid ${({ theme }) => theme.COLOR.WHITE};

    &.filled {
      background-color: ${({ theme }) => theme.COLOR.WHITE};
    }
  }
`;

export default Indicator;
