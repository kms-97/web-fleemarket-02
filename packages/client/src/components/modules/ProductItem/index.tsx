import React from "react";
import Text from "@base/Text";
import Image from "@base/Image";
import styled from "@emotion/styled";
import HeartIcon from "@icons/HeartIcon";
import MessageIcon from "@icons/MessageIcon";
import { IProductItem } from "types/product.type";
import { getExpriedTime } from "@utils/timeCalculate";
import { useNavigate } from "react-router-dom";

interface Props {
  product: IProductItem;
  isActive: boolean;
}

const ProductItem = ({ product, isActive }: Props) => {
  const navigation = useNavigate();
  const { id, title, locationName, createdAt, price, likeUsers, chatCount } = product;
  const wishCount = likeUsers.length;

  const moveToDetailPage = (id: number) => {
    navigation(`/product/${id}`);
  };

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
    <Container onClick={() => moveToDetailPage(id)}>
      <Image size="lg" src="empty.jpg" />
      <div className="description">
        <Text size="lg" isBold={true}>
          {title}
        </Text>
        <Text size="sm" fColor="GRAY1">
          {locationName} ∙ {getExpriedTime(createdAt)}
        </Text>
        <Text size="md" isBold={true}>
          {Number(price).toLocaleString()}원
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
