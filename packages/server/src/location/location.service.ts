import { LOCATION_QUERY } from '@constant/queries';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@src/base/CustomException';
import { ErrorMessage } from '@src/constant/ErrorMessage';
import { LocationDto } from './dto/location.dto';
import { Location, LocationRepository } from './entities/location.entity';

const DEFAULT_LIMIT = 10;

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: LocationRepository,
  ) {}

  async findLocation(dto: LocationDto) {
    const { keyword, code } = dto;
    const page = dto.page ?? 1;
    let locations: Location;

    if (keyword && code) {
      throw new CustomException(
        [ErrorMessage.EXCEED_ONE_SEARCH_CONDITION],
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!keyword && !code) {
      throw new CustomException(
        [ErrorMessage.NEED_ONE_SEARCH_CONDITION],
        HttpStatus.BAD_REQUEST,
      );
    }

    if (keyword) {
      locations = await this.findLocationByKeyword(keyword, page);
    }
    if (code) {
      locations = await this.findLocationByCode(code, page);
    }

    return { locations, page };
  }

  findLocationByKeyword(keyword: string, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.locationRepository.query(
      LOCATION_QUERY.FIND_LOCATION_BY_KEYWORD,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, offset, DEFAULT_LIMIT],
    );
  }

  findLocationByCode(code: string, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.locationRepository.query(LOCATION_QUERY.FIND_LOCATION_BY_CODE, [
      `${code}%`,
      offset,
      DEFAULT_LIMIT,
    ]);
  }

  async getLocationByCode(code: string) {
    const [location] = await this.locationRepository.query(
      LOCATION_QUERY.GET_LOCATION_BY_CODE,
      [code],
    );

    return { location: location ?? null };
  }

  async getLocationById(id: number) {
    const [location] = await this.locationRepository.query(
      LOCATION_QUERY.GET_LOCATION_BY_ID,
      [id],
    );

    return { location: location ?? null };
  }

  async checkExistLocationById(id: number) {
    const { location } = await this.getLocationById(id);
    if (!location) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_TARGET('지역')],
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
