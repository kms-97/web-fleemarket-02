import { AccessJwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { TokenUser, User } from '@decorator/user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { InsertChatLogDto } from './dto/chatLog.dto';
import {
  ChatRoomByIdDto,
  GetChatRoomsByProductIdDto,
  InsertChatRoomDto,
} from './dto/chatRoom.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AccessJwtAuthGuard)
  @Post('room')
  async insertChatRoom(@Body() chatRoomDto: InsertChatRoomDto) {
    const chatRoom = await this.chatService.insertChatRoom(chatRoomDto);

    return { room: chatRoom };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('room/:chatRoomId')
  async insertChatLog(@Body() chatRoomDto: InsertChatLogDto) {
    const chatRoom = await this.chatService.insertChatLog(chatRoomDto);

    return { room: chatRoom };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('/product/:productId')
  async getChatRoomsByProductId(
    @User() _user: TokenUser,
    @Param('productId') productId: number,
  ) {
    const chatRoomDto: GetChatRoomsByProductIdDto = {
      sellerId: _user.id,
      productId,
    };

    const rooms = await this.chatService.getChatRoomsByProductId(chatRoomDto);

    return { rooms };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('/user')
  async getChatRoomsByUserId(@User() _user: TokenUser) {
    const rooms = await this.chatService.getChatRoomsByUserId(_user.id);

    return { rooms };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('/:chatRoomId')
  async getChatRoomById(
    @Param('chatRoomId') chatRoomId: number,
    @User() _user: TokenUser,
  ) {
    const chatRoomDto: ChatRoomByIdDto = {
      chatRoomId,
      userId: _user.id,
    };

    const room = await this.chatService.getChatRoomById(chatRoomDto);

    return { room };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete('/:chatRoomId')
  async deleteChatRoomById(
    @User() _user: TokenUser,
    @Param('chatRoomId') chatRoomId: number,
  ) {
    const chatRoomDto: ChatRoomByIdDto = {
      chatRoomId,
      userId: _user.id,
    };

    const room = await this.chatService.getChatRoomById(chatRoomDto);

    if (room.deletedAt) {
      await this.chatService.deleteChatRoomById(chatRoomDto);
    } else {
      await this.chatService.softDeleteChatRoomById(chatRoomDto);
    }
  }
}
