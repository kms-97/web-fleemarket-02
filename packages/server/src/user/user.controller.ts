import { AccessJwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { PaginationDto } from '@base/Pagination.dto';
import { TokenUser, User } from '@decorator/user.decorator';
import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  Patch,
  Query,
  HttpCode,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserInsertDto } from './dto/userInsert.dto';
import { UserLocationDto } from './dto/userLocation.dto';
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

  @UseGuards(AccessJwtAuthGuard)
  @Post('/location')
  @HttpCode(201)
  async insertUserLocation(@Body() dto: UserLocationDto) {
    await this.userService.insertUserLocationHandler(dto);
  }

  @Get()
  async getUserByUserIdOrGithubEmail(@Query() dto: UserSearchDto) {
    return this.userService.getUserByUserIdOrGithubEmail(dto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Get(':id/product')
  async getUserProductById(
    @Param('id') id: number,
    @Query() dto: PaginationDto,
  ) {
    return this.userService.getUserProductById(id, dto);
  }

  @Get(':id/wish')
  async getUserWishById(@Param('id') id: number, @Query() dto: PaginationDto) {
    return this.userService.getUserWishById(id, dto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch('location')
  async updateActiveUserLocation(
    @User() user: TokenUser,
    @Body('locationId') locationId: number,
  ) {
    const userId = user.id;
    await this.userService.updateActiveUserLocationHandler(userId, locationId);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() dto: UserUpdateDto) {
    await this.userService.updateUser(id, dto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete('location')
  async deleteUserLocation(
    @User() user: TokenUser,
    @Body('locationId') locationId: number,
  ) {
    const userId = user.id;
    await this.userService.deleteUserLocationHandler(userId, locationId);
  }
}
