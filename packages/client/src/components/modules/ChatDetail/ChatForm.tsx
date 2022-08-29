import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Bubble from "@base/Chat/Bubble";
import { IChat } from "types/chat.type";
import { IUser } from "types/user.type";

interface Props {
  chatLog: IChat[];
  user: IUser;
}

const ChatForm = ({ chatLog, user }: Props) => {
  const chatFormRef = useRef<HTMLElement>(null);

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
      {chatLog
        .sort((a, b) => a.id - b.id)
        .map((chat) => (
          <ChatBox key={chat.id} isSeller={user.id === chat.userId}>
            <Bubble isSeller={user.id === chat.userId}>{chat.content}</Bubble>
          </ChatBox>
        ))}
    </Container>
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
`;

export default ChatForm;
