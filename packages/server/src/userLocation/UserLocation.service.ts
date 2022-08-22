import { USER_LOCATION_QUERY } from '@constant/queries';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@src/base/CustomException';
import { ErrorMessage } from '@src/constant/ErrorMessage';
import {
  UserLocation,
  UserLocationRepository,
} from './entites/userLocation.entity';

@Injectable()
export class UserLocationService {
  constructor(
    @InjectRepository(UserLocation)
    private readonly userLocationRepository: UserLocationRepository,
  ) {}
  // 트랜잭션 도입해야함.
  async insertUserLocation(
    userId: number,
    locationId: number,
    isActive: boolean,
  ) {
    if (isActive) await this.setAllUserLocationToNotActive(userId);
    await this.userLocationRepository.query(USER_LOCATION_QUERY.INSERT_U_L, [
      userId,
      locationId,
      isActive,
    ]);
  }

  async deleteUserLocation(userId: number, locationId: number) {
    await this.setAllUserLocationToActive(userId);
    await this.userLocationRepository.query(USER_LOCATION_QUERY.DELETE_U_L, [
      userId,
      locationId,
    ]);
  }

  async activeUserLocation(userId: number, locationId: number) {
    await this.setAllUserLocationToNotActive(userId);
    await this.userLocationRepository.query(USER_LOCATION_QUERY.UPDATE_U_L, [
      userId,
      locationId,
    ]);
  }

  async countUserLocation(userId: number) {
    const [{ count }] = await this.userLocationRepository.query(
      USER_LOCATION_QUERY.GET_COUNT_U_L,
      [userId],
    );

    return Number(count);
  }

  setAllUserLocationToNotActive(userId: number) {
    return this.userLocationRepository.query(
      USER_LOCATION_QUERY.UPDATE_ALL_U_L_TO_FALSE,
      [userId],
    );
  }

  setAllUserLocationToActive(userId: number) {
    return this.userLocationRepository.query(
      USER_LOCATION_QUERY.UPDATE_ALL_U_L_TO_TRUE,
      [userId],
    );
  }

  async checkExistUserLocation(userId: number, locationId: number) {
    const [userLocation] = await this.userLocationRepository.query(
      USER_LOCATION_QUERY.GET_U_L_BY_UID_LID,
      [userId, locationId],
    );

    if (userLocation) {
      throw new CustomException(
        [ErrorMessage.DUPLICATED_USER_LOCATION],
        HttpStatus.CONFLICT,
      );
    }
  }

  async checkNotExistUserLocation(userId: number, locationId: number) {
    const [userLocation] = await this.userLocationRepository.query(
      USER_LOCATION_QUERY.GET_U_L_BY_UID_LID,
      [userId, locationId],
    );

    if (!userLocation) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_TARGET('관심 지역')],
        HttpStatus.NOT_FOUND,
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
