import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { InsertChatLogDto } from './dto/chatLog.dto';
import {
  ChatRoomByIdDto,
  GetChatRoomsByProductIdDto,
  InsertChatRoomDto,
} from './dto/chatRoom.dto';
import { ChatRoom } from './entities/chatRoom.entity';

@WebSocketGateway(81, {
  namespace: 'chat',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  private logger = new Logger('Gateway');

  @WebSocketServer() nsp: Namespace;

  afterInit() {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatRoomDto: ChatRoomByIdDto,
  ) {
    const room = (await this.chatService.getChatRoomById(
      chatRoomDto,
    )) as ChatRoom;

    await Promise.all(
      room?.chatLog.map((chat) => {
        if (!chat.isRead)
          this.chatService.updateChatLogWithIsRead({
            id: chat.id,
            userId: chat.userId,
          });
      }),
    );

    socket.join(String(room.id));

    return room;
  }

  @SubscribeMessage('create-room')
  async handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatRoomDto: InsertChatRoomDto,
  ) {
    const room = await this.chatService.insertChatRoom(chatRoomDto);

    const { id } = room;

    socket.join(id);
    socket.emit('create-room', id);

    return room;
  }

  @SubscribeMessage('room-list')
  async handleRoomList(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatRoomsDto: GetChatRoomsByProductIdDto,
  ) {
    const rooms = await this.chatService.getChatRoomsByProductId(chatRoomsDto);

    socket.emit('room-list', rooms);

    return rooms;
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatLogDto: InsertChatLogDto,
  ) {
    const chat = await this.chatService.insertChatLog(chatLogDto);

    const socketSize = socket.rooms.size;

    if (socketSize > 1) {
      await this.chatService.updateChatLogWithIsRead({
        id: chat.id,
        userId: chat.userId,
      });
    }

    const room = await this.chatService.getChatRoomById({
      chatRoomId: chat.chatRoomId,
      userId: chat.userId,
    });

    room;

    socket.broadcast.to(String(chat.chatRoomId)).emit('message', room);
    socket.emit('refresh-room', room);

    return room;
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatRoomId: number,
  ) {
    socket.leave(String(chatRoomId));

    return true;
  }

  @SubscribeMessage('delete-room')
  async handleDeleteRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatRoomDto: ChatRoomByIdDto,
  ) {
    const result = await this.chatService.deleteChatRoomById(chatRoomDto);

    if (result) socket.leave(String(chatRoomDto.chatRoomId));

    return result;
  }
}

// 1. DB를 사용하여 나갔다 들어와도 기존 채팅이 유지가 되어있어야 함 ✅

// 2. 읽음표시 기능(실시간) ✅

// 3. 카톡처럼 같은 시간에(분 단위)적히면 마지막 채팅만 시각이 적혀야함, ✅

// 4. 채팅방 목록에 안읽은 채팅 개수와 마지막 채팅 , 마지막 채팅 시간 ✅

// 5. 상대방에게도 메시지가 바뀌어 보여야함 (실시간) ✅
