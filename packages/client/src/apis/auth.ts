import { END_POINT } from "@constants/api";
import { IGetGetUser, ISignInUser } from "types/user.type";
import { request } from ".";

const { LOGIN, LOGOUT, REFRESH, GET_LOGIN_USER } = END_POINT;

const requestGetLoginUserInfo = async () => {
  const result = await request<IGetGetUser>(GET_LOGIN_USER);

  const { user } = result;

  return user;
};

const requestLogIn = async (data: ISignInUser) => {
  const result = await request(LOGIN, { method: "POST", body: JSON.stringify(data) });

  const { success } = result;

  return success;
};

const requestLogOut = async () => {
  const result = await request(LOGOUT, { method: "POST" });

  const { success } = result;

  return success;
};

const requestRefresh = async () => {
  const result = await request(REFRESH, { method: "POST" });

  const { success } = result;

  return success;
};

export { requestLogIn, requestLogOut, requestRefresh, requestGetLoginUserInfo };
