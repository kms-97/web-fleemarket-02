import React from "react";
import Image from "@base/Image";
import Text from "@base/Text";
import styled from "@emotion/styled";
import { ChatProduct } from "types/chat.type";

interface Props {
  product: ChatProduct;
}

const ChatProductInfo = ({ product }: Props) => {
  const { imgUrl, price, status, title } = product;
  return (
    <Container>
      <ProductDesc>
        <Image size="sm" src={imgUrl[0]} />
        <ProductDescTextBox>
          <Text size="sm">{title}</Text>
          <Text size="sm">{price.toLocaleString()}원</Text>
        </ProductDescTextBox>
      </ProductDesc>
      <ProductStatus>
        <Text size="sm">{status}</Text>
      </ProductStatus>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  gap: 16px;

  border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};
`;

const ProductDesc = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ProductDescTextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
`;

const ProductStatus = styled.div`
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.COLOR.GRAY4};
  border-radius: 8px;
`;

export default ChatProductInfo;
