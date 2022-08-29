import React, { useEffect, useState } from "react";
import Header from "@components/modules/Header";
import styled from "@emotion/styled";
import Text from "@base/Text";
import FloatButton from "@components/modules/FloatButton";
import VerticalIcon from "@icons/VerticalIcon";
import HeartIcon from "@icons/HeartIcon";
import Button from "@base/Button";
import ProductDetailContent from "@components/modules/ProductDetailContent";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@hooks/useQuery";
import { requestGetProduct } from "@src/apis/product";
import { IProduct } from "@src/types/product.type";
import { requestGetLoginUserInfo } from "@apis/auth";
import { useChatAction } from "@hooks/useSocket";

const ProductDetailPage = () => {
  const { onJoinRoom, onCreateChatRoom } = useChatAction();
  const { id } = useParams();
  const navigation = useNavigate();
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);
  const [product, setProduct] = useState<IProduct | null>(null);
  const isSeller = product?.seller.id === user?.id;
  const chatCountByDeletedAt = product?.chatRooms?.reduce((count, room) => {
    if (room.deleteUserId === null || room.deleteUserId !== user?.id) count += 1;

    return count;
  }, 0);

  const { refetch } = useQuery(["product", id!], requestGetProduct, {
    onSuccess: (data) => {
      setProduct(data);
    },
  });

  const onClickDotButton = () => {
    console.log("123");
  };

  useEffect(() => {
    refetch(id);
  }, []);

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

  return (
    <Container>
      <Header>
        <FloatButton fixedPos="right" onClick={onClickDotButton}>
          <VerticalIcon />
        </FloatButton>
      </Header>
      {product && <ProductDetailContent product={product} />}
      <Footer>
        <WishButton isActive={true}>
          <HeartIcon />
        </WishButton>
        <ChatButtonForm>
          <Text size="lg">{product && Number(product.price).toLocaleString()}원</Text>
          <Button onClick={moveToChatList}>
            {isSeller ? `채팅 목록 보기(${chatCountByDeletedAt})` : "문의하기"}
          </Button>
        </ChatButtonForm>
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

  overflow: hidden;

  * {
    flex-shrink: 0;
  }

  > header {
    background-color: transparent;
    border: none;
    position: absolute;
    z-index: 1;
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  padding: 16px;

  justify-content: space-between;

  border-top: solid 1px ${({ theme }) => theme.COLOR.GRAY3};

  > p {
    display: flex;
    column-gap: 8px;
  }
`;

const WishButton = styled.button<{ isActive: boolean }>`
  > svg {
    fill: ${({ theme, isActive }) => (isActive ? theme.COLOR.PRIMARY1 : "")};

    > path {
      stroke: ${({ theme }) => theme.COLOR.PRIMARY1};
    }
  }
`;

const ChatButtonForm = styled.div`
  display: flex;
  gap: 16px;
`;

export default ProductDetailPage;
