import { WISH_QUERY } from '@constant/queries';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@base/CustomException';
import { ErrorMessage } from '@constant/ErrorMessage';
import { Wish, WishRepository } from './entities/wish.entity';

const DEFAULT_LIMIT = 10;

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: WishRepository,
  ) {}

  findWishByUserId(id: number, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.wishRepository.query(WISH_QUERY.GET_WISH_BY_UID, [
      id,
      offset,
      DEFAULT_LIMIT,
    ]);
  }

  async insertWish(userId: number, productId: number) {
    await this.checkExistWish(userId, productId);
    await this.wishRepository.query(WISH_QUERY.INSERT_WISH, [
      userId,
      productId,
    ]);

    return true;
  }

  async deleteWish(userId: number, productId: number) {
    await this.wishRepository.query(WISH_QUERY.DELETE_WISH, [
      userId,
      productId,
    ]);

    return true;
  }

  async checkExistWish(userId: number, productId: number) {
    const [wish] = await this.wishRepository.query(
      WISH_QUERY.GET_WISH_BY_UID_PID,
      [userId, productId],
    );

    if (wish) {
      throw new CustomException(
        [ErrorMessage.DUPLICATED_WISH],
        HttpStatus.CONFLICT,
      );
    }
  }
}
