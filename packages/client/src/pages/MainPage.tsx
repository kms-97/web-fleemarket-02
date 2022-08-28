import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "@emotion/styled";
import MainHeader from "@components/modules/MainHeader";
import MapPinIcon from "@icons/MapPinIcon";
import Text from "@base/Text";
import Fab from "@base/Fab";

import {
  requestAddWishProduct,
  requestDeleteWishProduct,
  requestGetProducts,
  requestDeleteProduct,
} from "@apis/product";

import { useQuery } from "@hooks/useQuery";
import { useSearchParam } from "@hooks/useSearchParam";
import { requestGetLoginUserInfo } from "@apis/auth";
import { IUser } from "types/user.type";
import { useMutation } from "@hooks/useMutation";
import { IProductItem } from "types/product.type";
import ProductList from "@modules/ProductList";

const MainPage = () => {
  const navigation = useNavigate();
  const params = useSearchParam();
  const [products, setProducts] = useState<IProductItem[]>([]);
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);
  const { data, updateCache } = useQuery(
    ["products", user?.id ?? -1],
    async () => {
      if (!user) {
        return [];
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
      cacheExpiredTime: 0,
    },
  );
  const [deleteProduct] = useMutation(
    async (product: IProductItem) => {
      return await requestDeleteProduct(product.id);
    },
    {
      onSuccess: (data, ...args) => {
        if (!user || !products) return;
        const [product] = args;
        const newProducts = [...products];
        const index = newProducts.findIndex((p) => p.id === product.id);
        if (index >= 0) newProducts.splice(index, 1);

        updateCache(["products", user?.id ?? -1], newProducts);
        setProducts(newProducts);
      },
      cacheClear: true,
    },
  );
  const [toggleWish] = useMutation(
    async (
      isWishProduct: boolean,
      setIsWishProduct: React.Dispatch<React.SetStateAction<boolean>>,
      product: IProductItem,
    ) => {
      if (isWishProduct) return requestDeleteWishProduct(product.id);
      else return requestAddWishProduct(product.id);
    },
    {
      onSuccess(data, ...args) {
        if (!user || !products) return;
        const [isWishProduct, setIsWishProduct, product] = args;
        const newProducts = [...products];
        const index = newProducts.findIndex((p) => p.id === product.id);
        if (isWishProduct) {
          newProducts[index].likeUsers = newProducts[index].likeUsers.filter(
            (id) => id !== user.id,
          );
          setIsWishProduct(false);
        } else {
          newProducts[index].likeUsers.push(user.id);
          setIsWishProduct(true);
        }

        updateCache(["products", user?.id ?? -1], newProducts);
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
        {products && (
          <ProductList products={products} toggleWish={toggleWish} deleteProduct={deleteProduct} />
        )}
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

export default MainPage;
