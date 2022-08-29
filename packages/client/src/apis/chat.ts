import { request } from ".";
import { ICreateChatRoomDto, IResCreateRoom, IResGetChatRooms } from "types/chat.type";

const requestCreateRoom = async (data: ICreateChatRoomDto) => {
  const result = await request<IResCreateRoom>("/chat/room", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const { room } = result;

  return room;
};

const requestDeleteRoom = async (chatRoomId: number) => {
  const result = await request<IResCreateRoom>(`/chat/${chatRoomId}`, {
    method: "DELETE",
  });

  const { room } = result;

  return room;
};

const requestGetChatRoomsByProductId = async (productId: number) => {
  const result = await request<IResGetChatRooms>(`/chat/product/${productId}`);

  const { rooms } = result;

  return rooms;
};

const requestGetChatRoomsByLoginUser = async () => {
  const result = await request<IResGetChatRooms>(`/chat/user`);

  const { rooms } = result;

  return rooms;
};

const requestGetChatRoomById = async (chatId: number) => {
  const result = await request<IResCreateRoom>(`/chat/${chatId}`);

  const { room } = result;

  return room;
};

export {
  requestCreateRoom,
  requestGetChatRoomsByProductId,
  requestGetChatRoomsByLoginUser,
  requestGetChatRoomById,
  requestDeleteRoom,
};
