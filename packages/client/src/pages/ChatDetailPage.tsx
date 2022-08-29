import React, { useRef } from "react";
import styled from "@emotion/styled";
import Header from "@modules/Header";
import Text from "@base/Text";
import LogoutIcon from "@icons/LogoutIcon";
import FloatButton from "@modules/FloatButton";
import ChatDetailFooter from "@modules/ChatDetail/ChatDetailFooter";
import ChatProductInfo from "@modules/ChatDetail/ChatProductInfo";
import ChatForm from "@modules/ChatDetail/ChatForm";
import { useQuery } from "@hooks/useQuery";
import { requestGetLoginUserInfo } from "@apis/auth";
import { useParams } from "react-router-dom";
import { requestGetChatRoomById } from "@apis/chat";
import { useChat, useChatAction } from "@hooks/useSocket";
import { useInput } from "@hooks/useInput";

const ChatDetailPage = () => {
  const [room, roomHandler, onSendMessage] = useChat();
  const [value, valueHandler, setValue] = useInput();
  const { chatRoomId } = useParams<"chatRoomId">();
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);
  const { onDeleteRoom } = useChatAction();

  useQuery(["room", Number(chatRoomId)], () => requestGetChatRoomById(Number(chatRoomId)), {
    onSuccess(data) {
      roomHandler(data);
    },
    cacheExpiredTime: 0,
  });

  if (!user || !room || !chatRoomId) {
    return <></>;
  }

  const { buyer, chatLog, product, seller } = room;

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    onSendMessage({ userId: user.id, chatRoomId: Number(chatRoomId), content: value });
    setValue("");
  };

  const deleteRoom = () => {
    onDeleteRoom({ chatRoomId: room.id, userId: user.id });
  };

  return (
    <Container>
      <Header>
        <Text>{user.id === buyer.id ? seller.name : buyer.name}</Text>
        <FloatButton fixedPos="right" className="quit" onClick={deleteRoom}>
          <LogoutIcon />
        </FloatButton>
      </Header>
      <ChatProductInfo product={product} />
      <ChatForm user={user} chatLog={chatLog} />
      <ChatDetailFooter value={value} onChange={valueHandler} onSubmit={onSubmit} />
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR.WHITE};

  & .quit path {
    stroke: ${({ theme }) => theme.COLOR.ERROR};
  }
`;

export default ChatDetailPage;
