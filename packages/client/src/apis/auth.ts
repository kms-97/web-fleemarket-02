import { END_POINT } from "@constants/api";
import { ISignInUser } from "types/user.type";
import { request } from ".";

const { LOGIN, LOGOUT, REFRESH } = END_POINT;

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

export { requestLogIn, requestLogOut, requestRefresh };
