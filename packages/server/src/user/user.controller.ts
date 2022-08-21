import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  Patch,
  Query,
  HttpCode,
} from '@nestjs/common';
import { UserInsertDto } from './dto/userInsert.dto';
import { UserSearchDto } from './dto/userSearch.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(201)
  async insertUser(@Body() dto: UserInsertDto) {
    const { userId, name, password, locations } = dto;
    if (!name || !userId || !password || !locations) {
      throw new BadRequestException('필수 파라미터가 누락되었습니다.');
    }

    const duplicateIdUser = await this.userService.getUserByUserId(userId);

    if (duplicateIdUser) {
      throw new ConflictException('이미 존재하는 ID입니다.');
    }

    await this.userService.insertUser(dto);
  }

  @Get()
  async getUserByUserIdOrGithubEmail(@Query() dto: UserSearchDto) {
    return this.userService.getUserByUserIdOrGithubEmail(dto);
  }


  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() dto: UserUpdateDto) {
    await this.userService.updateUser(id, dto);
  }
}
