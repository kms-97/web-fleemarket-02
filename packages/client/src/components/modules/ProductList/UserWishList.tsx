import React, { useState } from "react";
import { requestGetLoginUserInfo } from "@apis/auth";
import { requestGetUserProductByWish } from "@apis/user";
import { useQuery } from "@hooks/useQuery";
import ProductItem from "@modules/ProductItem";
import { useMutation } from "@hooks/useMutation";
import { requestAddWishProduct, requestDeleteWishProduct } from "@apis/product";
import { IProductItem } from "types/product.type";

const UserWishList = () => {
  const [userProducts, setUserProducts] = useState<IProductItem[]>([]);
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo, {
    cacheExpiredTime: Infinity,
  });
  const { data } = useQuery(
    ["userProductByWish", user?.id ?? -1],
    async () => {
      if (!user) return [];
      return requestGetUserProductByWish(user.id);
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

export default UserWishList;
