import { END_POINT } from "@constants/api";
import { IGetGetUser, ISignUpUser } from "types/user.type";
import { IAddUserLocation } from "types/location.type";
import { IResGetProducts } from "types/product.type";
import { request } from ".";

interface IUserLocationId {
  locationId: number;
}

interface IUpdateUser {
  name: string;
}

const { GET_USER, SIGNUP, GET_USER_LOCATION, GET_USER_PRODUCT, GET_USER_PRODUCT_BY_WISH } =
  END_POINT;

const requestGetUser = async () => {
  const result = await request<IGetGetUser>(GET_USER);

  const { user } = result;

  return user;
};

const requestGetUserById = async (userId: number) => {
  const result = await request<IGetGetUser>(`${GET_USER}/${userId}`);

  const { user } = result;

  return user;
};

const requestUpdateUser = async (data: IUpdateUser) => {
  const result = await request(GET_USER, { method: "POST", body: JSON.stringify(data) });

  const { success } = result;

  return success;
};

const requestGetUserProduct = async (userId: number) => {
  const result = await request<IResGetProducts>(GET_USER_PRODUCT(userId));

  const { products } = result;

  return products;
};

const requestGetUserProductByWish = async (userId: number) => {
  const result = await request<IResGetProducts>(GET_USER_PRODUCT_BY_WISH(userId));

  const { products } = result;

  return products;
};

const requestSignUp = async (data: ISignUpUser) => {
  const result = await request(SIGNUP, { method: "POST", body: JSON.stringify(data) });

  const { success } = result;

  return success;
};

const requestAddUserLocation = async (data: IAddUserLocation) => {
  const result = await request(GET_USER_LOCATION, { method: "POST", body: JSON.stringify(data) });

  const { success } = result;

  return success;
};

const requestDeleteUserLocation = async (data: IUserLocationId) => {
  const result = await request(GET_USER_LOCATION, { method: "DELETE", body: JSON.stringify(data) });

  const { success } = result;

  return success;
};

const requestUpdateUserLocation = async (data: IUserLocationId) => {
  const result = await request(GET_USER_LOCATION, { method: "PATCH", body: JSON.stringify(data) });

  const { success } = result;

  return success;
};

export {
  requestGetUser,
  requestSignUp,
  requestGetUserById,
  requestUpdateUser,
  requestGetUserProductByWish,
  requestGetUserProduct,
  requestAddUserLocation,
  requestDeleteUserLocation,
  requestUpdateUserLocation,
};
