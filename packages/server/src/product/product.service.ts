import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomException } from '@src/base/CustomException';
import { ErrorMessage } from '@src/constant/ErrorMessage';
import { DataSource } from 'typeorm';
import { Product } from './entities/product.entity';

const DEFAULT_LIMIT = 10;

@Injectable()
export class ProductService {
  constructor(private readonly datasource: DataSource) {}

  async findProduct(dto: any) {
    const { category, location } = dto;
    const page = dto.page ?? 1;
    let products: Product[];

    if (!location) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_ESSENTIAL],
        HttpStatus.BAD_REQUEST,
      );
    }

    if (category) {
      products = await this.findProductByCategory(category, location, page);
    } else {
      products = await this.findProductByLocation(location, page);
    }

    return { products, page };
  }

  private findProductByCategory(
    category: string,
    location: number,
    page: number,
  ) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.datasource.query(
      `
      select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName,
        seller_id as sellerId, json_arrayagg(w.user_id) as likeUsers
      from Product p
      join location l on p.location_id = l.id
      left join wish w on w.product_id = p.id
      where p.category_name = ? and p.location_id = ?
      group by p.id
      limit ?, ?;
      `,
      [category, location, offset, DEFAULT_LIMIT],
    );
  }

  private findProductByLocation(location: number, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.datasource.query(
      `
      select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName,
        seller_id as sellerId, json_arrayagg(w.user_id) as likeUsers
      from Product p
      join location l on p.location_id = l.id
      left join wish w on w.product_id = p.id
      where p.location_id = ?
      group by p.id
      limit ?, ?;
      `,
      [location, offset, DEFAULT_LIMIT],
    );
  }
}
