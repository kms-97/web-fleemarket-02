import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  Patch,
  Query,
  ConflictException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { UserInsertDto } from './dto/userInsert.dto';
import { UserSearchDto } from './dto/userSearch.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { User } from './entities/user.entity';
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
    return;
  }

  @Get()
  async getUserByUserIdOrGithubEmail(@Query() dto: UserSearchDto) {
    const { githubEmail, userId } = dto;
    let user: User;

    if (githubEmail && userId) {
      throw new BadRequestException('검색 조건은 하나만 가능합니다.');
    }
    if (!githubEmail && !userId) {
      throw new BadRequestException('검색 조건이 하나 이상 존재해야 합니다.');
    }

    if (githubEmail) {
      user = await this.userService.getUserByGithubEmail(githubEmail);
    }
    if (userId) {
      user = await this.userService.getUserByUserId(userId);
    }

    return { user };
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    if (!Number(id)) {
      throw new BadRequestException('적절하지 않은 ID입니다.');
    }

    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  async updateUser(@Param('id') id: string, @Body() dto: UserUpdateDto) {
    if (!Number(id)) {
      throw new BadRequestException('적절하지 않은 ID입니다.');
    }

    await this.userService.updateUser(id, dto);
  }
}
