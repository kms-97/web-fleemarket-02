import { ICoreResponse } from "./core.type";

interface ICategory {
  id: number;
  name: number;
  img: string;
}

interface IResGetCategory extends ICoreResponse {
  categories: ICategory[];
}

export type { ICategory, IResGetCategory };
