import React from "react";
import styled from "@emotion/styled";
import Header from "@modules/Header";
import Text from "@base/Text";
import ChatListForm from "@modules/Chat/CharListForm";
import { useQuery } from "@hooks/useQuery";
import { requestGetChatRoomsByProductId } from "@apis/chat";
import { useParams } from "react-router-dom";
import { useChatList } from "@hooks/useSocket";

const ProductChatPage = () => {
  const { id } = useParams<"id">();
  useQuery(
    ["productRoom"],
    async () => {
      if (!id) return [];
      return requestGetChatRoomsByProductId(parseInt(id));
    },
    {
      onSuccess(data) {
        roomListHandler(data);
      },
      cacheExpiredTime: 0,
    },
  );

  const [rooms, roomListHandler] = useChatList();

  return (
    <Container>
      <Header>
        <Text>채팅하기</Text>
      </Header>
      <ChatListForm rooms={rooms} />
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
`;

export default ProductChatPage;
