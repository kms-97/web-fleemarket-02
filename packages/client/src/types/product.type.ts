import { ICategory } from "./category.type";
import { ICoreResponse } from "./core.type";
import { ILocation } from "./location.type";
import { IUser } from "./user.type";

interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  imgUrl: string[];
  location: Pick<ILocation, "id" | "code" | "dong">;
  seller: Pick<IUser, "id" | "name" | "userId">;
  category: Pick<ICategory, "id" | "name">;
  status: "판매중" | "예약중" | "거래완료";
  likeUsers: number[];
  hits: number;
  chatCount: number;
  createdAt: Date;
}

interface IProductItem
  extends Pick<
    IProduct,
    "id" | "title" | "imgUrl" | "price" | "likeUsers" | "chatCount" | "createdAt"
  > {
  sellerId: number;
  locationName: string;
  categoryName: string;
}

interface IRequestProduct extends Pick<IProduct, "title" | "description" | "imgUrl" | "price"> {
  locationId: number;
  sellerId: number;
  categoryName: string;
}

interface IUpdateProductStatus {
  status: "판매중" | "예약중" | "거래완료";
}

interface IResGetProduct extends ICoreResponse {
  product: IProduct;
}

interface IResUpdateProduct extends ICoreResponse {
  productId: IProduct;
}

interface IResGetProducts extends ICoreResponse {
  products: IProductItem[];
}

interface IResAddImage extends ICoreResponse {
  imgUrls: string[];
}

export type {
  IProduct,
  IProductItem,
  IRequestProduct,
  IUpdateProductStatus,
  IResGetProducts,
  IResGetProduct,
  IResUpdateProduct,
  IResAddImage,
};
