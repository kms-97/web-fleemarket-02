import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@src/base/CustomException';
import { ErrorMessage } from '@src/constant/ErrorMessage';
import { Wish, WishRepository } from './entities/wish.entity';

const DEFAULT_LIMIT = 10;

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: WishRepository,
  ) {}

  findWishByUserId(id: number, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.wishRepository.query(
      `
      select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName,
        seller_id as sellerId, json_arrayagg(w.user_id) as likeUsers
      from wish w
      left join product p on w.product_id = p.id
      left join location l on p.location_id = l.id
      where w.user_id = ?
      group by p.id
      limit ?, ?;
      `,
      [id, offset, DEFAULT_LIMIT],
    );
  }

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
