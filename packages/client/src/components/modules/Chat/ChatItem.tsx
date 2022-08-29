import React, { useMemo } from "react";
import styled from "@emotion/styled";
import Image from "@base/Image";
import Text from "@base/Text";
import Badge from "@base/Chat/Badge";

import { getExpriedTime } from "@utils/timeCalculate";

import { IChatRoom } from "types/chat.type";
import { IUser } from "types/user.type";
import { useNavigate } from "react-router-dom";

interface Props {
  room: IChatRoom;
  user: IUser;
}

const ChatItem = ({ room, user }: Props) => {
  const navigate = useNavigate();

  const { buyer, product, chatLog } = room;
  const lastChat = chatLog.sort((a, b) => b.id - a.id)[0];

  const expiredTime = chatLog.length ? getExpriedTime(lastChat.createdAt) : "";
  const chatLogCount = useMemo(() => {
    const notReadChatCount = chatLog.reduce((count, chat) => {
      if (!chat.isRead && user.id !== chat.userId) count += 1;
      return count;
    }, 0);

    return notReadChatCount >= 999 ? "999+" : notReadChatCount;
  }, [chatLog]);

  const onClickItem = () => {
    navigate(`/chat/${room.id}`);
  };

  return (
    <Container onClick={onClickItem}>
      <ChatUserInfo>
        <Text size="sm" isBold={true}>
          {buyer.name}
        </Text>
        <Text size="sm" className="gr">
          {lastChat.content}
        </Text>
      </ChatUserInfo>
      <ChatDescLog>
        <Text size="xsm" className="gr">
          {expiredTime}
        </Text>
        {chatLogCount !== 0 && <Badge>{chatLogCount}</Badge>}
      </ChatDescLog>
      <Image size="sm" src={product.imgUrl[0]} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  padding: 16px;
  gap: 16px;

  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  & .gr {
    color: ${({ theme }) => theme.COLOR.GRAY1};
  }

  &:hover {
    background-color: ${({ theme }) => theme.COLOR.GRAY3};
  }
`;

const ChatUserInfo = styled.div`
  width: 250px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  overflow: hidden;
  gap: 8px;

  & > p {
    width: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const ChatDescLog = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 8px;
`;

export default ChatItem;
