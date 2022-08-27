import React, { useState } from "react";
import Header from "@components/modules/Header";
import styled from "@emotion/styled";
import Text from "@base/Text";
import FloatButton from "@components/modules/FloatButton";
import VerticalIcon from "@icons/VerticalIcon";
import Button from "@base/Button";
import ProductDetailContent from "@components/modules/ProductDetailContent";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@hooks/useQuery";
import { requestDeleteProduct, requestGetProduct } from "@src/apis/product";
import DropDown from "@modules/DropDown";
import { useMutation } from "@hooks/useMutation";

const ProductDetailPage = () => {
  const navigation = useNavigate();
  const { id } = useParams();
  const [showDotDropdown, setShowDotDropdown] = useState<boolean>(false);
  const { data: product } = useQuery(["product", id!], async () => requestGetProduct(Number(id)));

  const [deleteMutate] = useMutation(requestDeleteProduct, {
    onSuccess: () => {
      navigation("/main");
    },
    cacheClear: true,
  });

  const onClickDotButton = () => {
    setShowDotDropdown((prev) => !prev);
  };

  const onClickDeleteButton = () => {
    deleteMutate(id);
  };

  const onClickUpdateButton = () => {
    navigation(`/product/update/${id}`);
  };

  const DotDropdown = () => {
    if (!showDotDropdown) return <></>;
    return (
      <DropDown>
        <li onClick={onClickUpdateButton}>수정하기</li>
        <li onClick={onClickDeleteButton}>삭제하기</li>
      </DropDown>
    );
  };

  if (!product) return <></>;
  return (
    <Container>
      <Header>
        <FloatButton fixedPos="right" onClick={onClickDotButton}>
          <VerticalIcon />
        </FloatButton>
        <DotDropdown />
      </Header>
      <ProductDetailContent product={product} />
      <Footer>
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

    ul {
      top: 50px;
      right: 0px;
    }
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

export default ProductDetailPage;
