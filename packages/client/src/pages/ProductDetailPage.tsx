import React, { useEffect, useState } from "react";
import Header from "@components/modules/Header";
import styled from "@emotion/styled";
import Text from "@base/Text";
import Button from "@base/Button";
import ProductDetailContent from "@components/modules/ProductDetailContent";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@hooks/useQuery";
import {
  requestAddWishProduct,
  requestDeleteProduct,
  requestDeleteWishProduct,
  requestGetProduct,
} from "@src/apis/product";
import { useMutation } from "@hooks/useMutation";
import WishButton from "@modules/WishButton";
import DotDropdown from "@modules/DropDown/Dot";
import { IProduct } from "types/product.type";
import { requestGetLoginUserInfo } from "@apis/auth";
import { useChatAction } from "@hooks/useSocket";
import { useToastMessageAction } from "@contexts/ToastMessageContext";

const ProductDetailPage = () => {
  const { onJoinRoom, onCreateChatRoom } = useChatAction();
  const { addToastMessage } = useToastMessageAction();
  const navigation = useNavigate();
  const { id } = useParams();
  const [isMyProduct, setIsMyProduct] = useState<boolean>(false);
  const [isWishProduct, setIsWishProduct] = useState<boolean>(false);
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);
  const { data: product, updateCache } = useQuery(
    ["product", Number(id)],
    async () => requestGetProduct(Number(id)),
    {
      onError(error) {
        navigation(-1);
        addToastMessage({ type: "error", message: error, isVisible: true });
      },
    },
  );
  const isSeller = product?.seller.id === user?.id;
  const chatCountByDeletedAt = product?.chatRooms?.reduce((count, room) => {
    if (room.deleteUserId === null || room.deleteUserId !== user?.id) count += 1;

    return count;
  }, 0);

  const [deleteProduct] = useMutation(
    async (product: IProduct) => {
      return await requestDeleteProduct(product.id);
    },
    {
      onSuccess: () => {
        navigation(-1);
        addToastMessage({ type: "notice", message: "삭제되었습니다.", isVisible: true });
      },
      onError(error) {
        addToastMessage({ type: "error", message: error, isVisible: true });
      },
      cacheClear: true,
    },
  );
  const [toggleWish] = useMutation(
    async () => {
      if (!product) return;
      if (isWishProduct) return requestDeleteWishProduct(product.id);
      else return requestAddWishProduct(product.id);
    },
    {
      onSuccess() {
        if (!user || !product) return;
        const newProduct = { ...product };

        let message: string;
        if (isWishProduct) {
          newProduct.likeUsers = newProduct.likeUsers.filter((id) => id !== user.id);
          setIsWishProduct(false);
          message = "관심 목록에서 게시글을 제외하였습니다.";
        } else {
          newProduct.likeUsers.push(user.id);
          setIsWishProduct(true);
          message = "관심 목록에 게시글을 추가하였습니다.";
        }

        updateCache(["product", Number(id)], newProduct);
        addToastMessage({ type: "notice", message, isVisible: true });
      },
      onError(error) {
        addToastMessage({ type: "error", message: error, isVisible: true });
      },
      cacheClear: true,
    },
  );

  useEffect(() => {
    if (!user || !product) return;
    setIsWishProduct(product.likeUsers.includes(user.id));
    setIsMyProduct(product.seller.id === user.id);
  }, [user, product]);

  const onClickWishButton: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    toggleWish();
  };

  const PriceSection = ({ price }: { price: string | number }) => {
    const numberPrice = Number(price);
    return (
      <Text size="md" isBold={true}>
        {numberPrice ? `${numberPrice.toLocaleString()} 원` : `가격 미정`}
      </Text>
    );
  };

  const moveToChatList = () => {
    if (isSeller) {
      navigation(`/product/${id}/chat`);
      return;
    }
    const chatRooms = product?.chatRooms;

    const room = chatRooms?.find((room) => room.buyerId === user?.id);

    if (room) {
      onJoinRoom({ chatRoomId: room.id, userId: Number(user?.id) });
    } else {
      onCreateChatRoom({
        productId: Number(product?.id),
        buyerId: Number(user?.id),
        sellerId: Number(product?.seller.id),
      });
    }
  };

  if (!product) return <></>;

  return (
    <Container>
      <Header>
        {isMyProduct && <DotDropdown product={product} deleteProduct={deleteProduct} />}
      </Header>
      <ProductDetailContent product={product} isMyProduct={isMyProduct} />
      <Footer>
        <WishButton isActive={isWishProduct} onClick={onClickWishButton} />
        <FlexContainer>
          <PriceSection price={product.price} />
          <Button onClick={moveToChatList}>
            {isSeller ? `채팅 목록 보기(${chatCountByDeletedAt})` : "문의하기"}
          </Button>
        </FlexContainer>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR.WHITE};

  * {
    flex-shrink: 0;
  }

  > header {
    background-color: transparent;
    border: none;
    position: absolute;
    z-index: 1;
    justify-content: flex-end;
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  padding: 16px;

  justify-content: space-between;

  border-top: solid 1px ${({ theme }) => theme.COLOR.GRAY3};
`;

const FlexContainer = styled.div`
  display: flex;
  column-gap: 8px;
`;

export default ProductDetailPage;
