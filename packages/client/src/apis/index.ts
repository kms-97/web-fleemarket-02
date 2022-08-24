import { BASE_URL } from "@constants/api";
import { ICoreResponse } from "types/core.type";

export const request = async <T extends ICoreResponse>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const result = (await response.json()) as T;

    const { success, message } = result;

    if (!success) {
      if (typeof message === "string") {
        throw new Error(message);
      } else {
        throw new Error(message?.[0]);
      }
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// const authenticationInterceptor = (res: Response) => {

// };
