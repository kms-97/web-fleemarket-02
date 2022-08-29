import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  IChat,
  IChatRoom,
  ICreateChatLogDto,
  ICreateChatRoomDto,
  IDeleteRoomDto,
  IJoinChatRoomDto,
} from "types/chat.type";

type ReturnUseChatList = [IChatRoom[], (rooms: IChatRoom[]) => void];
type ReturnUseChat = [
  IChatRoom | null,
  (room: IChatRoom) => void,
  (chatLog: ICreateChatLogDto) => void,
];
interface ReturnUseChatAction {
  onCreateChatRoom: (chatRoomDto: ICreateChatRoomDto) => void;
  onJoinRoom: (chatRoomDto: IJoinChatRoomDto) => void;
  onDeleteRoom: (deleteRoomDto: IDeleteRoomDto) => void;
  onLeaveRoom: (chatRoomId: number) => void;
}

const socket = io("http://localhost:81/chat");

const useChatList = (): ReturnUseChatList => {
  const [rooms, setRooms] = useState<IChatRoom[]>([]);

  useEffect(() => {
    const createRoom = (createdRoom: IChatRoom) => {
      setRooms((prev) => [...prev, createdRoom]);
    };

    const refreshRoom = (refreshedRoom: IChatRoom) => {
      setRooms((prev) => {
        const newRooms = prev.map((room) => {
          return room.id === refreshedRoom.id ? refreshedRoom : room;
        });

        return newRooms;
      });
    };

    // 채팅방 리스트를 가져옴

    // 새로운 메시지가 추가됐을때 채팅방 데이터를 업데이트
    socket.emit("refresh-room", refreshRoom);

    // 새로운 채팅방이 생겼을때 추가해줌
    socket.on("create-room", createRoom);

    return () => {
      socket.off("create-room", createRoom);
      socket.off("refresh-room", refreshRoom);
    };
  }, []);

  const roomListHandler = (rooms: IChatRoom[]) => {
    setRooms(rooms);
  };

  return [rooms, roomListHandler];
};

const useChat = (): ReturnUseChat => {
  const [room, setRoom] = useState<IChatRoom | null>(null);
  const { chatRoomId } = useParams<"chatRoomId">();

  useEffect(() => {
    socket.on("message", roomHandler);
    socket.on("delete-room", roomHandler);

    return () => {
      socket.emit("leave-room", chatRoomId);
      socket.off("delete-room", roomHandler);
      socket.off("message", roomHandler);
    };
  }, [chatRoomId]);

  const onSendMessage = useCallback((chatLog: ICreateChatLogDto) => {
    socket.emit("message", chatLog, (room: IChatRoom) => {
      setRoom(room);
    });
  }, []);

  const roomHandler = (room: IChatRoom) => {
    setRoom(room);
  };

  return [room, roomHandler, onSendMessage];
};

const useChatAction = (): ReturnUseChatAction => {
  const navigate = useNavigate();

  const onCreateChatRoom = useCallback((chatRoomDto: ICreateChatRoomDto) => {
    socket.emit("create-room", chatRoomDto, (chat: IChat) => {
      navigate(`/chat/${chat.id}`);
    });
  }, []);

  const onJoinRoom = useCallback(
    (chatRoomDto: IJoinChatRoomDto) => {
      socket.emit("join-room", chatRoomDto, (chat: IChatRoom) => {
        navigate(`/chat/${chat.id}`);
      });
    },
    [navigate],
  );

  const onDeleteRoom = useCallback((deleteRoomDto: IDeleteRoomDto) => {
    socket.emit("delete-room", deleteRoomDto, () => {
      navigate(-1);
    });
  }, []);

  const onLeaveRoom = useCallback((chatRoomId: number) => {
    socket.emit("leave-room", chatRoomId, () => {
      navigate(-1);
    });
  }, []);

  return { onCreateChatRoom, onJoinRoom, onDeleteRoom, onLeaveRoom };
};

export { socket, useChatList, useChat, useChatAction };
