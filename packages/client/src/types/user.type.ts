import { IUserLocation } from "./location.type";

interface IUser {
  id: number;
  name: string;
  userId: string;
  wises: number[];
  locations: IUserLocation;
}

interface ISignUpUser extends Pick<IUser, "userId" | "name" | "locations"> {
  password: string;
}

type ISignInUser = Pick<ISignUpUser, "userId" | "password">;

export type { IUser, ISignUpUser, ISignInUser };
