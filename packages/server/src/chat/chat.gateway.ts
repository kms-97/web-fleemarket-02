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
import { ChatRoomByIdDto, InsertChatRoomDto } from './dto/chatRoom.dto';
import { ChatRoom } from './entities/chatRoom.entity';

@WebSocketGateway(8080, {
  namespace: 'chat',
  cors: true,
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

    socket.join(String(room.id));

    const socketSize = socket.rooms.size;

    if (socketSize > 1) {
      await Promise.all(
        room?.chatLog.map((chat) => {
          if (!chat.isRead && chat.userId !== chatRoomDto.userId)
            this.chatService.updateChatLogWithIsRead({
              id: chat.id,
              userId: chat.userId,
            });
        }),
      );
    }

    return room;
  }

  @SubscribeMessage('create-room')
  async handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatRoomDto: InsertChatRoomDto,
  ) {
    const room = await this.chatService.insertChatRoom(chatRoomDto);

    const { id } = room;

    socket.join(String(id));
    this.nsp.emit('create-room', room);

    return room;
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

    socket.broadcast.to(String(room.id)).emit('message', room);
    this.nsp.emit('refresh-room', room);

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
