import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { locationDto } from './dto/location.dto';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  async findLocation(@Query() dto: locationDto) {
    const { keyword, code } = dto;
    const page = dto.page ?? 1;
    let locations: Location[];

    if (keyword && code) {
      throw new HttpException(
        '검색 조건은 하나만 가능합니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!keyword && !code) {
      throw new HttpException(
        '검색 조건이 하나 이상 존재해야 합니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (keyword) {
      locations = await this.locationService.findLocationByKeyword(
        keyword,
        page,
      );
    }
    if (code) {
      locations = await this.locationService.findLocationByCode(code, page);
    }

    return { locations, page };
  }

  @Get(':code')
  async getLocationByCode(@Param('code') code: string) {
    const location = await this.locationService.getLocationByCode(code);
    return { location };
  }
}
