import { AccessJwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { PaginationDto } from '@base/Pagination.dto';
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
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() dto: UserUpdateDto) {
    await this.userService.updateUser(id, dto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch(':userId/location/:locationId')
  async updateActiveUserLocation(
    @Param('userId') userId: number,
    @Param('locationId') locationId: number,
  ) {
    await this.userService.updateActiveUserLocationHandler(userId, locationId);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete(':userId/location/:locationId')
  async deleteUserLocation(
    @Param('userId') userId: number,
    @Param('locationId') locationId: number,
  ) {
    await this.userService.deleteUserLocationHandler(userId, locationId);
  }
}
