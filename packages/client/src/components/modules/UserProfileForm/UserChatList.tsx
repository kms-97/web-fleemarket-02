import React, { useEffect } from "react";
import ChatListForm from "@modules/Chat/CharListForm";
import { useQuery } from "@hooks/useQuery";
import { requestGetChatRoomsByLoginUser } from "@apis/chat";
import { useChatList } from "@hooks/useSocket";

const UserChatList = () => {
  const { data } = useQuery(["userChatList"], requestGetChatRoomsByLoginUser);
  const [rooms, roomListHandler] = useChatList();

  useEffect(() => {
    if (!data) return;
    roomListHandler(data);
  }, [data]);

  return <ChatListForm rooms={rooms} />;
};

export default UserChatList;
