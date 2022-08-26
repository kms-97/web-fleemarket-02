export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3065/api"
    : process.env.REACT_APP_BASE_URL;

export const END_POINT = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  GET_CATEGORY: "/category",
  GET_LOCATION: "/location",
  GET_PRODUCT: "/product",
  ADD_IMAGE: "/image",
  GET_USER: "/user",
  SIGNUP: "/user/signup",
  GET_USER_LOCATION: "/user/location",
  GET_USER_PRODUCT: (userId: number) => `/user/${userId}/product`,
  GET_USER_PRODUCT_BY_WISH: (userId: number) => `/user/${userId}/wish`,
};
