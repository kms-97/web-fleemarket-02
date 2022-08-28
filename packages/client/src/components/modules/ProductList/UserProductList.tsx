import React, { useState } from "react";
import { requestGetUserProduct } from "@apis/user";
import { useQuery } from "@hooks/useQuery";
import { requestGetLoginUserInfo } from "@apis/auth";
import { useMutation } from "@hooks/useMutation";
import {
  requestAddWishProduct,
  requestDeleteProduct,
  requestDeleteWishProduct,
} from "@apis/product";
import { IProductItem } from "types/product.type";
import ProductList from "./";
import { useToastMessageAction } from "@contexts/ToastMessageContext";
import EmptyList from "./EmptyList";

const UserProductList = () => {
  const { addToastMessage } = useToastMessageAction();
  const [userProducts, setUserProducts] = useState<IProductItem[]>();
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo, {
    cacheExpiredTime: Infinity,
  });
  const { data } = useQuery(
    ["userProduct", user?.id ?? -1],
    async () => {
      if (!user) return;
      return requestGetUserProduct(user.id);
    },
    {
      onSuccess(data) {
        setUserProducts(data);
      },
      onError() {
        addToastMessage({ type: "error", message: "정보를 불러올 수 없습니다.", isVisible: true });
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
        if (!user || !userProducts) return;
        const [product] = args;
        const newUserProducts = [...userProducts];
        const index = newUserProducts.findIndex((p) => p.id === product.id);
        if (index >= 0) newUserProducts.splice(index, 1);

        setUserProducts(newUserProducts);
        addToastMessage({ type: "notice", message: "삭제되었습니다.", isVisible: true });
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
        if (!user || !userProducts) return;
        const [isWishProduct, setIsWishProduct, product] = args;
        const newUserProducts = [...userProducts];
        const index = newUserProducts.findIndex((p) => p.id === product.id);

        let message: string;
        if (isWishProduct) {
          newUserProducts[index].likeUsers = newUserProducts[index].likeUsers.filter(
            (userId) => userId !== user.id,
          );
          setIsWishProduct(false);
          message = "관심 목록에서 게시글을 제외하였습니다.";
        } else {
          newUserProducts[index].likeUsers.push(user.id);
          setIsWishProduct(true);
          message = "관심 목록에 게시글을 추가하였습니다.";
        }

        setUserProducts(newUserProducts);
        addToastMessage({ type: "notice", message, isVisible: true });
      },
      onError(error) {
        addToastMessage({ type: "error", message: error, isVisible: true });
      },
      cacheExpiredTime: 0,
    },
  );

  if (userProducts && !userProducts.length) {
    return <EmptyList text="작성한 게시글이 없습니다." />;
  }
  return (
    <>
      {userProducts && (
        <ProductList
          products={userProducts}
          toggleWish={toggleWish}
          deleteProduct={deleteProduct}
        />
      )}
    </>
  );
};

export default UserProductList;
