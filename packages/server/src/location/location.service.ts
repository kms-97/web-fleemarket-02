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

  async findLocationByKeyword(keyword: string, page: number) {
    const allLocations = await this.locationRepository.query(
      `
      select id, sido, gungu, dong, code from Location l
      where l.sido like ? or l.gungu like ? or l.dong like ?
      `,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`],
    );
    const count = allLocations.length;
    const offset = (page - 1) * DEFAULT_LIMIT;
    const hasNext = offset + DEFAULT_LIMIT <= count;

    return { locations: allLocations.splice(offset, DEFAULT_LIMIT), hasNext };
  }

  async findLocationByCode(code: string, page: number) {
    const allLocations = await this.locationRepository.query(
      `
      select id, sido, gungu, dong, code from Location l
      where l.code like ?
      `,
      [`${code}%`],
    );
    const count = allLocations.length;
    const offset = (page - 1) * DEFAULT_LIMIT;
    const hasNext = offset + DEFAULT_LIMIT <= count;

    return { locations: allLocations.splice(offset, DEFAULT_LIMIT), hasNext };
  }

  async getLocationByCode(code: string): Promise<Location> {
    const location = this.locationRepository.query(
      `
      select id, sido, gungu, dong, code from Location l
      where l.code = ?
      `,
      [code],
    );

    return location[0] ?? null;
  }
}
