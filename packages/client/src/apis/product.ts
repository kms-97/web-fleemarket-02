import { END_POINT } from "@constants/api";
import { getQueryParams } from "@utils/queryStringHandler";
import {
  IRequestProduct,
  IResAddImage,
  IResGetProduct,
  IResGetProducts,
  IUpdateProductStatus,
} from "types/product.type";
import { request } from ".";

const { GET_PRODUCT, ADD_IMAGE } = END_POINT;

const requestGetProduct = async (productId: number) => {
  const result = await request<IResGetProduct>(`${GET_PRODUCT}/${productId}`);

  const { product } = result;

  return product;
};

const requestGetProducts = async (query: any) => {
  const queryParams = getQueryParams(query);

  const result = await request<IResGetProducts>(`${GET_PRODUCT}?${queryParams}`);

  const { products } = result;

  return products;
};

const requestAddProduct = async (data: IRequestProduct) => {
  const result = await request(`${GET_PRODUCT}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const { success } = result;

  return success;
};
const requestUpdateProduct = async (productId: number, data: IRequestProduct) => {
  const result = await request(`${GET_PRODUCT}/${productId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const { success } = result;

  return success;
};
const requestPatchProduct = async (productId: number, data: IUpdateProductStatus) => {
  const result = await request(`${GET_PRODUCT}/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const { success } = result;

  return success;
};

const requestDeleteProduct = async (productId: number) => {
  const result = await request(`${GET_PRODUCT}/${productId}`, {
    method: "DELETE",
  });

  const { success } = result;

  return success;
};

const requestAddProductImage = async (data: File[]) => {
  const result = await request<IResAddImage>(ADD_IMAGE, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "multipart/form-data" },
  });

  const { imgUrls } = result;

  return imgUrls;
};

export {
  requestGetProduct,
  requestGetProducts,
  requestAddProduct,
  requestUpdateProduct,
  requestPatchProduct,
  requestDeleteProduct,
  requestAddProductImage,
};
