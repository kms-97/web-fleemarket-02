import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@src/base/CustomException';
import { ErrorMessage } from '@src/constant/ErrorMessage';
import { Wish, WishRepository } from './entities/wish.entity';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: WishRepository,
  ) {}

  async insertWish(userId: number, productId: number) {
    await this.checkExistWish(userId, productId);
    await this.wishRepository.query(
      `
      insert into wish (user_id, product_id)
      values (?, ?)
      `,
      [userId, productId],
    );

    return true;
  }

  async deleteWish(userId: number, productId: number) {
    await this.wishRepository.query(
      `
      delete from wish where user_id = ? and product_id = ?
      `,
      [userId, productId],
    );

    return true;
  }

  async checkExistWish(userId: number, productId: number) {
    const [wish] = await this.wishRepository.query(
      `
      select user_id as userId, product_id as productId
      from wish
      where user_id = ? and product_id = ?
      `,
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
