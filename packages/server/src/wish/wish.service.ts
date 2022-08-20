import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish, WishRepository } from './entities/wish.entity';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: WishRepository,
  ) {}

  async insertWish(userId: number, productId: number) {
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
      delete wish where user_id = ? and product_id = ?
      `,
      [userId, productId],
    );

    return true;
  }
}
