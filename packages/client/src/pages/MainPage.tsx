import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "@emotion/styled";
import MainHeader from "@components/modules/MainHeader";
import ProductItem from "@components/modules/ProductItem";
import MapPinIcon from "@icons/MapPinIcon";
import Text from "@base/Text";
import Fab from "@base/Fab";

import { requestGetProducts } from "@apis/product";

import { useQuery } from "@hooks/useQuery";
import { useSearchParam } from "@hooks/useSearchParam";
import { IProductItem } from "types/product.type";
import { requestGetLoginUserInfo } from "@apis/auth";
import { IUser } from "types/user.type";

const MainPage = () => {
  const navigation = useNavigate();
  const params = useSearchParam();
  const [products, setProducts] = useState<IProductItem[]>();
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);

  const { refetch } = useQuery(
    ["products", user?.id ?? 0],
    async () => {
      if (!user) {
        return;
      }

      const activeLocation = getActiveLocation(user);

      if (params.category) {
        return await requestGetProducts({ category: params.category, location: activeLocation.id });
      } else {
        return await requestGetProducts({ location: activeLocation.id });
      }
    },
    {
      onSuccess(data) {
        setProducts(data);
      },
    },
  );

  const moveToLocationPage = () => {
    navigation("/location");
  };

  const moveToProductWritePage = () => {
    navigation("/product/write");
  };

  const getActiveLocation = (user: IUser) => {
    const locations = user.locations;
    return locations.filter(({ isActive }) => isActive)[0];
  };

  return (
    <>
      <Container>
        <MainHeader>
          <button onClick={moveToLocationPage}>
            <MapPinIcon />
            <Text size="lg" fColor="WHITE">
              {user && getActiveLocation(user).dong}
            </Text>
          </button>
        </MainHeader>
        <ProductList>
          {products &&
            products.map((product) => <ProductItem key={product.id} product={product} />)}
        </ProductList>
        <Layer>
          <Fab onClick={moveToProductWritePage} />
        </Layer>
      </Container>
    </>
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
