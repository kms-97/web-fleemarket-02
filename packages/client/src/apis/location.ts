import { END_POINT } from "@constants/api";
import { getQueryParams } from "@utils/queryStringHandler";
import { IResLocation, IResLocations } from "types/location.type";
import { request } from ".";

const { GET_LOCATION } = END_POINT;

const requestGetLocations = async (query: any) => {
  const locationParams = getQueryParams(query);

  const result = await request<IResLocations>(
    `${GET_LOCATION}${query ? `?${locationParams}` : ""}`,
  );

  const { locations } = result;

  return locations;
};

const requestGetLocationByCode = async (params: any) => {
  const result = await request<IResLocation>(`${GET_LOCATION}/${params}}`);

  const { location } = result;

  return location;
};

export { requestGetLocations, requestGetLocationByCode };
