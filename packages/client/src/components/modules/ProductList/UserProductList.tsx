import React, { useState } from "react";
import { requestGetUserProduct } from "@apis/user";
import { useQuery } from "@hooks/useQuery";
import { requestGetLoginUserInfo } from "@apis/auth";
import ProductItem from "@modules/ProductItem";
import { useMutation } from "@hooks/useMutation";
import { requestAddWishProduct, requestDeleteWishProduct } from "@apis/product";
import { IProductItem } from "types/product.type";

const UserProductList = () => {
  const [userProducts, setUserProducts] = useState<IProductItem[]>([]);
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo, {
    cacheExpiredTime: Infinity,
  });
  const { data } = useQuery(
    ["userProduct", user?.id ?? -1],
    async () => {
      if (!user) return [];
      return requestGetUserProduct(user.id);
    },
    {
      onSuccess(data) {
        setUserProducts(data);
      },
      cacheExpiredTime: 0,
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
        if (!user || !userProducts) return;
        const [isWishProduct, setIsWishProduct, product] = args;
        const newUserProducts = [...userProducts];
        const index = newUserProducts.findIndex((p) => p.id === product.id);
        if (isWishProduct) {
          newUserProducts[index].likeUsers = newUserProducts[index].likeUsers.filter(
            (userId) => userId !== user.id,
          );
          setIsWishProduct(false);
        } else {
          newUserProducts[index].likeUsers.push(user.id);
          setIsWishProduct(true);
        }

        setUserProducts(newUserProducts);
      },
      cacheExpiredTime: 0,
    },
  );

  return (
    <>
      {userProducts?.map((product) => (
        <ProductItem key={product.id} product={product} toggleWish={toggleWish} />
      ))}
    </>
  );
};

export default UserProductList;
