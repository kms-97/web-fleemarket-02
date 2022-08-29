import React from "react";
import styled from "@emotion/styled";
import { IChatRoom } from "types/chat.type";
import ChatItem from "./ChatItem";
import { useQuery } from "@hooks/useQuery";
import { requestGetLoginUserInfo } from "@apis/auth";

interface Props {
  rooms: IChatRoom[] | null;
}

const ChatListForm = ({ rooms }: Props) => {
  const isValid = rooms && rooms.length !== 0;
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);

  if (!user) return <></>;

  return (
    <Container>
      {isValid &&
        rooms.map(
          (item, i) =>
            item.chatLog.length > 0 && <ChatItem key={`${i} ${item.id}`} room={item} user={user} />,
        )}
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;

  overflow-y: scroll;
`;

export default ChatListForm;
