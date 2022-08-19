import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationDto } from './dto/location.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  async findLocation(@Query() dto: LocationDto) {
    return this.locationService.findLocation(dto);
  }

  @Get(':code')
  async getLocationByCode(@Param('code') code: string) {
    return this.locationService.getLocationByCode(code);
  }
}
