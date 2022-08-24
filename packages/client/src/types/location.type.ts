interface ILocation {
  id: string;
  sido: string;
  gungu: string;
  dong: string;
  code: string;
}

interface IUserLocation extends Pick<ILocation, "id" | "dong" | "code"> {
  isActive: number;
}

interface IAddUserLocation extends Pick<IUserLocation, "isActive"> {
  userId: number;
  locationId: number;
}

export type { ILocation, IUserLocation, IAddUserLocation };
