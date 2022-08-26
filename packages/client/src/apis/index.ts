import { BASE_URL } from "@constants/api";
import { ICoreResponse } from "types/core.type";
import { END_POINT } from "@constants/api";
import { requestRefresh } from "./auth";

const { REFRESH } = END_POINT;

export const request = async <T extends ICoreResponse>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      ...options,
    });

    const result = (await response.json()) as T;

    const { success, message } = result;

    if (!success) {
      if (typeof message === "string") {
        throw new Error(message);
      } else {
        throw new Error(message?.[0] ?? "");
      }
    }

    return result;
  } catch (error: any) {
    if (error.message === "No auth token") {
      const result = interceptors<T>(url, options);

      return result;
    } else {
      throw new Error(error.message);
    }
  }
};

const interceptors = async <T extends ICoreResponse>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  try {
    const refreshed = await request(REFRESH, { method: "POST" });

    const { success, message } = refreshed;

    if (!success) {
      if (typeof message === "string") {
        throw new Error(message);
      } else {
        throw new Error(message?.[0] ?? "");
      }
    }

    const result = await request<T>(url, options);

    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
