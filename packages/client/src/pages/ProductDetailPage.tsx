import React, { useEffect, useState } from "react";
import Header from "@components/modules/Header";
import styled from "@emotion/styled";
import Text from "@base/Text";
import FloatButton from "@components/modules/FloatButton";
import VerticalIcon from "@icons/VerticalIcon";
import HeartIcon from "@icons/HeartIcon";
import Button from "@base/Button";
import ProductDetailContent from "@components/modules/ProductDetailContent";
import { useParams } from "react-router-dom";
import { useQuery } from "@hooks/useQuery";
import { requestGetProduct } from "@src/apis/product";
import { IProduct } from "@src/types/product.type";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
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
        <Text size="lg">
          {product && Number(product.price).toLocaleString()}원<Button>문의하기</Button>
        </Text>
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

export default ProductDetailPage;
