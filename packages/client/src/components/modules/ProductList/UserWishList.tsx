import React from "react";
import { requestGetLoginUserInfo } from "@apis/auth";
import { requestGetUserProductByWish } from "@apis/user";
import { useQuery } from "@hooks/useQuery";
import ProductItem from "@modules/ProductItem";

const UserWishList = () => {
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo, {
    cacheExpiredTime: Infinity,
  });
  const { data: userProducts } = useQuery(
    ["userProductByWish", user?.id ?? -1],
    async () => {
      if (!user) return;
      return requestGetUserProductByWish(user.id);
    },
    {
      isCacheSave: true,
    },
  );

  return (
    <>
      {userProducts?.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          isActive={user?.wishes.includes(product.id) ?? false}
        />
      ))}
    </>
  );
};

export default UserWishList;
