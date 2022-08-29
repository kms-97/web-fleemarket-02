import React from "react";
import ChatListForm from "@modules/Chat/CharListForm";
import { useQuery } from "@hooks/useQuery";
import { requestGetChatRoomsByLoginUser } from "@apis/chat";

const UserChatList = () => {
  const { data: rooms } = useQuery(["userChatList"], requestGetChatRoomsByLoginUser);

  return (
    <>
      <ChatListForm rooms={rooms} />
    </>
  );
};

export default UserChatList;
