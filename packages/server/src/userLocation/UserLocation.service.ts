import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@src/base/CustomException';
import { ErrorMessage } from '@src/constant/ErrorMessage';
import {
  UserLocation,
  UserLocationRepository,
} from './entites/UserLocation.entity';

@Injectable()
export class UserLocationService {
  constructor(
    @InjectRepository(UserLocation)
    private readonly userLocationRepository: UserLocationRepository,
  ) {}
  // 트랜잭션 도입해야함.
  async insertUserLocation(userId: number, locationId: number) {
    await this.setAllUserLocationToNotActive(userId);
    await this.userLocationRepository.query(
      `
      insert into userlocation (user_id, location_id)
      values (?, ?);
      `,
      [userId, locationId],
    );
  }

  async deleteUserLocation(userId: number, locationId: number) {
    await this.setAllUserLocationToActive(userId);
    await this.userLocationRepository.query(
      `
      delete userlocation
      where user_id = ? and location_id = ?;
      `,
      [userId, locationId],
    );
  }

  async activeUserLocation(userId: number, locationId: number) {
    await this.setAllUserLocationToNotActive(userId);
    await this.userLocationRepository.query(
      `
      update userlocation
      set is_active = true
      where user_id = ? and location_id = ?
      `,
      [userId, locationId],
    );
  }

  async countUserLocation(userId: number) {
    const [{ count }] = await this.userLocationRepository.query(
      `
      select count(*) as count
      from userlocation
      where user_id = ?
      `,
      [userId],
    );

    return Number(count);
  }

  setAllUserLocationToNotActive(userId: number) {
    return this.userLocationRepository.query(
      `
      update userlocation
      set is_active = false
      where user_id = ?
      `,
      [userId],
    );
  }

  setAllUserLocationToActive(userId: number) {
    return this.userLocationRepository.query(
      `
      update userlocation
      set is_active = true
      where user_id = ?
      `,
      [userId],
    );
  }

  async checkExistUserLocation(userId: number, locationId: number) {
    const [userLocation] = await this.userLocationRepository.query(
      `
      select user_id as userId, location_id as locationId
      from userlocation
      where user_id = ? and location_id = ?;
      `,
      [userId, locationId],
    );

    if (userLocation) {
      throw new CustomException(
        [ErrorMessage.DUPLICATED_USER_LOCATION],
        HttpStatus.CONFLICT,
      );
    }
  }

  async checkUserLocationMax(userId: number) {
    const count = await this.countUserLocation(userId);

    if (count >= 2) {
      throw new CustomException(
        [ErrorMessage.EXCEED_USER_LOCATION_LIMIT],
        HttpStatus.CONFLICT,
      );
    }
  }

  async checkUserLocationMin(userId: number) {
    const count = await this.countUserLocation(userId);

    if (count <= 1) {
      throw new CustomException(
        [ErrorMessage.NOT_EMPTY_USER_LOCATION],
        HttpStatus.CONFLICT,
      );
    }
  }
}
