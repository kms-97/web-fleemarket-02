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
    await this.userService.insertUser(dto);
  }

  @Get()
  async getUserByUserIdOrGithubEmail(@Query() dto: UserSearchDto) {
    return this.userService.getUserByUserIdOrGithubEmail(dto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() dto: UserUpdateDto) {
    await this.userService.updateUser(id, dto);
  }
}
