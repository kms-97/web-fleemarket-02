import React from "react";
import Text from "@base/Text";
import Image from "@base/Image";
import styled from "@emotion/styled";
import HeartIcon from "@icons/HeartIcon";
import MessageIcon from "@icons/MessageIcon";

interface Props {
  title?: string;
  location?: string;
  timestamp?: string;
  price?: number;
  chatCount: number;
  wishCount: number;
  isActive: boolean;
}

const ProductItem = ({ isActive, chatCount, wishCount }: Props) => {
  const ChatIcon = () => {
    return (
      <IconBox>
        <MessageIcon />
        <Text size="md" fColor="GRAY1">
          {chatCount}
        </Text>
      </IconBox>
    );
  };

  const WishIcon = () => {
    return (
      <IconBox>
        <HeartIcon />
        <Text size="md" fColor="GRAY1">
          {wishCount}
        </Text>
      </IconBox>
    );
  };

  return (
    <Container>
      <Image size="lg" src="empty.jpg" />
      <div className="description">
        <Text size="lg" isBold={true}>
          파랑 선풍기
        </Text>
        <Text size="sm" fColor="GRAY1">
          역삼동 ∙ 2시간 전
        </Text>
        <Text size="md" isBold={true}>
          24,500원
        </Text>
      </div>
      <WishButton isActive={isActive}>
        <HeartIcon />
      </WishButton>
      <ChatLike>
        {chatCount ? <ChatIcon /> : ""}
        {wishCount ? <WishIcon /> : ""}
      </ChatLike>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: row;
  padding: 16px;
  column-gap: 16px;

  border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  > .description {
    display: flex;
    flex-flow: column;
    row-gap: 4px;

    align-items: flex-start;
  }
`;

const WishButton = styled.button<{ isActive: boolean }>`
  position: absolute;
  top: 19px;
  right: 18px;

  > svg {
    fill: ${({ theme, isActive }) => (isActive ? theme.COLOR.PRIMARY1 : "")};

    > path {
      stroke: ${({ theme }) => theme.COLOR.PRIMARY1};
    }
  }
`;

const ChatLike = styled.div`
  position: absolute;
  bottom: 17px;
  right: 17px;

  display: flex;
  flex-flow: row;
  column-gap: 17px;
`;

const IconBox = styled.div`
  display: flex;
  flex-flow: row;
  column-gap: 6px;

  > svg {
    width: 20px;
    height: 20px;

    > path {
      stroke: ${({ theme }) => theme.COLOR.GRAY1};
    }
  }
`;

export default ProductItem;
