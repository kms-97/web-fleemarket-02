import { END_POINT } from "@constants/api";
import { IResGetCategory } from "types/category.type";
import { request } from ".";

const requestGetCategory = async () => {
  const result = await request<IResGetCategory>(END_POINT.GET_CATEGORY);

  const { categories } = result;

  return categories;
};

export { requestGetCategory };
