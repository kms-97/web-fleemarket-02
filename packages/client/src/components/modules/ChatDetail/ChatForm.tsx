import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Bubble from "@base/Chat/Bubble";
import { IChat } from "types/chat.type";
import { IUser } from "types/user.type";
import Text from "@base/Text";
import { getParsedDateWithHourMin } from "@utils/dateParser";

interface Props {
  chatLog: IChat[];
  user: IUser;
}

interface SubProps extends Pick<IChat, "createdAt"> {
  isValid: boolean;
}

const ChatForm = ({ chatLog, user }: Props) => {
  const chatFormRef = useRef<HTMLElement>(null);
  const sortedChats = chatLog.sort((a, b) => a.id - b.id);

  useEffect(() => {
    if (!chatFormRef.current) return;

    const chatContainer = chatFormRef.current;
    const { scrollHeight, clientHeight } = chatContainer;

    if (scrollHeight > clientHeight) {
      chatContainer.scrollTop = scrollHeight - clientHeight;
    }
  }, [chatLog.length]);

  return (
    <Container ref={chatFormRef}>
      {sortedChats.map((chat, idx) => {
        const { id, userId, content, createdAt } = chat;

        const nextChat = idx !== sortedChats.length - 1 ? sortedChats[idx + 1] : null;

        const isValid = !(
          nextChat?.userId === userId &&
          nextChat &&
          getParsedDateWithHourMin(createdAt) === getParsedDateWithHourMin(nextChat?.createdAt)
        );

        return (
          <ChatBox key={id} isSeller={user.id === userId}>
            {user.id === userId && <ChatDesc createdAt={createdAt} isValid={isValid} />}
            <Bubble isSeller={user.id === userId}>{content}</Bubble>
            {user.id !== userId && <ChatDesc createdAt={createdAt} isValid={isValid} />}
          </ChatBox>
        );
      })}
    </Container>
  );
};

const ChatDesc = ({ createdAt, isValid }: SubProps) => {
  return (
    <ChatInfo>{isValid && <Text size="xsm">{getParsedDateWithHourMin(createdAt)}</Text>}</ChatInfo>
  );
};

const Container = styled.section`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChatBox = styled.div<{ isSeller: boolean }>`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: ${({ isSeller }) => (isSeller ? "flex-end" : "flex-start")};
  gap: 8px;
`;

const ChatInfo = styled.div`
  width: fit-content;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
`;

export default ChatForm;
