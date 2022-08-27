import React from "react";
import { requestGetUserProduct } from "@apis/user";
import { useQuery } from "@hooks/useQuery";
import { requestGetLoginUserInfo } from "@apis/auth";
import ProductItem from "@modules/ProductItem";

const UserProductList = () => {
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo, {
    cacheExpiredTime: Infinity,
  });
  const { data: userProducts } = useQuery(["userProduct", user?.id ?? -1], async () => {
    if (!user) return;
    return requestGetUserProduct(user.id);
  });

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

export default UserProductList;
