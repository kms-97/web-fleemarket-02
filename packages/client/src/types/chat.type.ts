import { ICoreResponse } from "./core.type";
import { IProduct } from "./product.type";
import { IUser } from "./user.type";

type ChatUser = Pick<IUser, "id" | "name">;
type ChatProduct = Pick<IProduct, "id" | "title" | "price" | "imgUrl" | "status">;

interface IChat {
  id: number;
  content: string;
  userId: number;
  isRead: boolean;
  createdAt: Date;
}

interface IChatRoom {
  id: number;
  seller: ChatUser;
  buyer: ChatUser;
  product: ChatProduct;
  deletedAt: null | Date;
  chatLog: IChat[];
}

interface IProductChat {
  id: number;
  sellerId: number;
  buyerId: number;
  deleteUserId: number | null;
}

interface IResCreateRoom extends ICoreResponse {
  room: IChatRoom;
}

interface IResGetChatRooms extends ICoreResponse {
  rooms: IChatRoom[];
}

interface ICreateChatRoomDto {
  sellerId: number;
  buyerId: number;
  productId: number;
}

interface ICreateChatLogDto {
  userId: number;
  chatRoomId: number;
  content: string;
}

interface IJoinChatRoomDto {
  userId: number;
  chatRoomId: number;
}

interface IDeleteRoomDto {
  chatRoomId: number;
  userId: number;
}

export type {
  IChatRoom,
  IChat,
  IResCreateRoom,
  IResGetChatRooms,
  ICreateChatRoomDto,
  ICreateChatLogDto,
  IJoinChatRoomDto,
  ChatProduct,
  ChatUser,
  IDeleteRoomDto,
  IProductChat,
};
