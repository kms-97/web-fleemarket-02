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
      return { locations: this.findLocationByKeyword(keyword, page), page };
    }
    if (code) {
      return { locations: this.findLocationByCode(code, page), page };
    }
  }

  findLocationByKeyword(keyword: string, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.locationRepository.query(
      `
      select id, sido, gungu, dong, code from Location l
      where l.sido like ? or l.gungu like ? or l.dong like ?
      limit ?, ?
      `,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, offset, DEFAULT_LIMIT],
    );
  }

  findLocationByCode(code: string, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.locationRepository.query(
      `
      select id, sido, gungu, dong, code from Location l
      where l.code like ?
      limit ?, ?
      `,
      [`${code}%`, offset, DEFAULT_LIMIT],
    );
  }

  async getLocationByCode(code: string) {
    const [location] = await this.locationRepository.query(
      `
      select id, sido, gungu, dong, code from Location l
      where l.code = ?
      `,
      [code],
    );

    return { location: location ?? null };
  }
}
