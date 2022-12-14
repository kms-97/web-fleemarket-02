import { ICoreResponse } from "./core.type";

interface ILocation {
  id: number;
  sido: string;
  gungu: string;
  dong: string;
  code: string;
}

interface IUserLocation extends Pick<ILocation, "id" | "dong" | "code"> {
  isActive: number | boolean;
}

interface IAddUserLocation extends Pick<IUserLocation, "isActive"> {
  userId: number;
  locationId: number;
}

interface IResLocation extends ICoreResponse {
  location: ILocation;
}
interface IResLocations extends ICoreResponse {
  locations: ILocation[];
}

export type { ILocation, IUserLocation, IAddUserLocation, IResLocation, IResLocations };
