import React, { useEffect, useState } from "react";
import Text from "@base/Text";
import Image from "@base/Image";
import styled from "@emotion/styled";
import HeartIcon from "@icons/HeartIcon";
import MessageIcon from "@icons/MessageIcon";
import { IProductItem } from "types/product.type";
import { getExpriedTime } from "@utils/timeCalculate";
import { useNavigate } from "react-router-dom";
import WishButton from "@modules/WishButton";
import { useQuery } from "@hooks/useQuery";
import { requestGetLoginUserInfo } from "@apis/auth";
import DotDropdown from "@modules/DropDown/Dot";

interface Props {
  product: IProductItem;
  toggleWish: any;
  deleteProduct: (...arg: any) => Promise<boolean | undefined>;
}

const ProductItem = ({ product, toggleWish, deleteProduct }: Props) => {
  const navigation = useNavigate();
  const { id, title, locationName, createdAt, price, likeUsers, chatCount, imgUrl } = product;
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);
  const [isMyProduct, setIsMyProduct] = useState<boolean>(false);
  const [isWishProduct, setIsWishProduct] = useState<boolean>(false);
  const wishCount = likeUsers.length;

  useEffect(() => {
    if (!user) return;
    setIsWishProduct(product.likeUsers.includes(user.id));
    setIsMyProduct(product.sellerId === user.id);
  }, [user]);

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

  const PriceSection = () => {
    const numberPrice = Number(price);
    return (
      <Text size="md" isBold={true}>
        {numberPrice ? `${numberPrice.toLocaleString()} 원` : `가격 미정`}
      </Text>
    );
  };

  const onClickWishButton: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    toggleWish(isWishProduct, setIsWishProduct, product);
  };

  return (
    <Container onClick={() => moveToDetailPage(id)}>
      <Image size="lg" src={imgUrl[0]} />
      <div className="description">
        <Text size="lg" isBold={true}>
          {title}
        </Text>
        <Text size="sm" fColor="GRAY1">
          {locationName} ∙ {getExpriedTime(createdAt)}
        </Text>
        <PriceSection />
      </div>
      <ButtonContainer>
        <WishButton isActive={isWishProduct} className="heart" onClick={onClickWishButton} />
        {isMyProduct && <DotDropdown product={product} deleteProduct={deleteProduct} />}
      </ButtonContainer>
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
  cursor: pointer;

  > .description {
    display: flex;
    flex-flow: column;
    row-gap: 4px;

    align-items: flex-start;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 19px;
  right: 18px;

  display: flex;
  column-gap: 8px;
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
