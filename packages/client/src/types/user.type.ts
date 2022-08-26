import { ICoreResponse } from "./core.type";
import { IUserLocation } from "./location.type";

interface IUser {
  id: number;
  name: string;
  userId: string;
  wises: number[];
  locations: IUserLocation[];
  github?: {
    id: number;
    name: string;
  };
}

interface ISignUpUser extends Pick<IUser, "userId" | "name" | "github"> {
  password: string;
  locations: ISignUpUserLocation[];
}

interface IGetGetUser extends ICoreResponse {
  user: IUser | null;
}

interface ISignUpUserLocation {
  locationId: number;
  isActive: boolean | number;
}

type ISignInUser = Pick<ISignUpUser, "userId" | "password">;

export type { IUser, ISignUpUser, ISignInUser, IGetGetUser, ISignUpUserLocation };
