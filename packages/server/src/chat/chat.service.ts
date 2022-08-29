import { CustomException } from '@base/CustomException';
import { CHAT_QUERY } from '@constant/queries';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from '@product/product.service';
import { InsertChatLogDto, UpdateChatLogDto } from './dto/chatLog.dto';
import {
  ChatRoomByIdDto,
  GetChatRoomsByProductIdDto,
  InsertChatRoomDto,
} from './dto/chatRoom.dto';
import { ChatLog, ChatLogRepository } from './entities/chatMessage.entity';
import { ChatRoom, ChatRoomRepository } from './entities/chatRoom.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepo: ChatRoomRepository,
    @InjectRepository(ChatLog) private readonly chatLogRepo: ChatLogRepository,
    private readonly productService: ProductService,
  ) {}

  async insertChatLog(chatLogDto: InsertChatLogDto) {
    const { chatRoomId, content, userId } = chatLogDto;
    const { insertId } = await this.chatLogRepo.query(
      CHAT_QUERY.INSERT_CHATLOG,
      [userId, chatRoomId, content],
    );

    const [chat] = await this.chatLogRepo.query(CHAT_QUERY.GET_CAHTLOG_BY_ID, [
      insertId,
    ]);

    return chat;
  }

  async updateChatLogWithIsRead(updateChatLogDto: UpdateChatLogDto) {
    const { id, userId } = updateChatLogDto;

    return await this.chatLogRepo.query(
      CHAT_QUERY.UPDATE_CHATLOG_WITH_IS_READ,
      [id, userId],
    );
  }

  async insertChatRoom(chatRoomDto: InsertChatRoomDto) {
    const { buyerId, productId, sellerId } = chatRoomDto;
    const { insertId } = await this.chatRoomRepo.query(
      CHAT_QUERY.INSERT_CHATROOM,
      [sellerId, buyerId, productId],
    );

    const room = await this.getChatRoomById({
      chatRoomId: insertId,
      userId: sellerId,
    });

    return room;
  }

  async getChatRoomsByProductId(chatRoomDto: GetChatRoomsByProductIdDto) {
    const { productId, sellerId } = chatRoomDto;

    const product = await this.productService.checkExistProductById(productId);

    if (product.seller_id !== sellerId) {
      throw new CustomException(
        ['접근할 수 없는 페이지입니다.'],
        HttpStatus.FORBIDDEN,
      );
    }

    // 상품에 등록된 채팅방 리스트를 가져온다
    // 채팅방의 상품이며 해당 상품을 등록한 유저여야 하고 유저가 삭제한 채팅이 아니여야 한다.
    const rooms = await this.chatRoomRepo.query(
      CHAT_QUERY.GET_CHATROOMS_BY_PRODUCT_ID,
      [productId, sellerId, sellerId],
    );

    return rooms;
  }
  async getChatRoomsByUserId(userId: number) {
    const rooms = await this.chatRoomRepo.query(
      CHAT_QUERY.GET_CHATROOMS_BY_USER_ID,
      [userId, userId, userId],
    );

    return rooms;
  }

  async getChatRoomById(chatRoomDto: ChatRoomByIdDto) {
    const { chatRoomId, userId } = chatRoomDto;

    await this.isExistChatRoomById(chatRoomId);

    const [room] = await this.chatRoomRepo.query(
      CHAT_QUERY.GET_CHATROOM_BY_ID,
      [chatRoomId],
    );

    if (!room) {
      throw new CustomException(
        ['존재하지 않는 채팅방입니다.'],
        HttpStatus.NOT_FOUND,
      );
    }

    if (room.seller.id !== userId && room.buyer.id !== userId) {
      throw new CustomException(
        ['접근할 수 없는 페이지입니다.'],
        HttpStatus.FORBIDDEN,
      );
    }

    if (room.deleteUserId === userId) {
      throw new CustomException(
        ['종료된 채팅방입니다.'],
        HttpStatus.BAD_REQUEST,
      );
    }

    return room;
  }

  async softDeleteChatRoomById(chatRoomDto: ChatRoomByIdDto) {
    const { chatRoomId, userId } = chatRoomDto;

    await this.isExistChatRoomById(chatRoomId);

    await this.chatRoomRepo.query(CHAT_QUERY.SOFT_DELETE_CHATROOM_BY_ID, [
      userId,
      userId,
      chatRoomId,
    ]);

    return;
  }

  async deleteChatRoomById(chatRoomDto: ChatRoomByIdDto) {
    const { chatRoomId, userId } = chatRoomDto;

    await this.isExistChatRoomById(chatRoomId);

    await this.chatRoomRepo.query(CHAT_QUERY.DELETE_CHATROOM_BY_ID, [
      chatRoomId,
      userId,
    ]);

    return true;
  }

  async isExistChatRoomById(chatRoomId: number) {
    const [existedRoom] = await this.chatRoomRepo.query(
      CHAT_QUERY.CHECK_CHATROOM_BY_ID,
      [chatRoomId],
    );

    if (!existedRoom) {
      throw new CustomException(
        ['존재하지 않는 채팅방입니다.'],
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

// 현재 상품의 채팅 리스트
// product/:id/chat - userid: 로그인한 유저, productId: query param

// 현재 채팅방의 상세 정보
// chat/:id - chatId: query param (유저 접근시 해당 채팅에 포함된 유저인지 검증해야함)
