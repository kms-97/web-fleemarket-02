import React from "react";
import { useNavigate } from "react-router-dom";

import styled from "@emotion/styled";
import MainHeader from "@components/modules/MainHeader";
import ProductItem from "@components/modules/ProductItem";
import MapPinIcon from "@icons/MapPinIcon";
import Text from "@base/Text";
import Fab from "@base/Fab";
import auth from "@hoc/auth";

const MainPage = auth(() => {
  const navigation = useNavigate();

  const moveToLocationPage = () => {
    navigation("/location");
  };

  const moveToProductWritePage = () => {
    navigation("/product/write");
  };

  return (
    <>
      <Container>
        <MainHeader>
          <button onClick={moveToLocationPage}>
            <MapPinIcon />
            <Text size="lg" fColor="WHITE">
              장곡동
            </Text>
          </button>
        </MainHeader>
        <ProductList>
          <ProductItem isActive={true} chatCount={1} wishCount={3} />
          <ProductItem isActive={false} chatCount={0} wishCount={0} />
          <ProductItem isActive={true} chatCount={1} wishCount={3} />
          <ProductItem isActive={false} chatCount={0} wishCount={0} />
        </ProductList>
        <Layer>
          <Fab onClick={moveToProductWritePage} />
        </Layer>
      </Container>
    </>
  );
});

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR.WHITE};
`;

const Layer = styled.div`
  position: absolute;
  right: 0px;
  bottom: 0px;
  z-index: 1;
`;

const ProductList = styled.div`
  overflow: auto;
`;

export default MainPage;
