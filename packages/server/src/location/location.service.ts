import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location, LocationRepository } from './entities/location.entity';

const DEFAULT_LIMIT = 10;

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: LocationRepository,
  ) {}

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

  async getLocationByCode(code: string): Promise<Location> {
    const location = await this.locationRepository.query(
      `
      select id, sido, gungu, dong, code from Location l
      where l.code = ?
      `,
      [code],
    );

    return location[0] ?? null;
  }
}
