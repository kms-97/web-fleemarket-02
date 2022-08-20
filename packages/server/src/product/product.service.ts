import { CategoryService } from '@category/category.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@src/base/CustomException';
import { ErrorMessage } from '@src/constant/ErrorMessage';
import { LocationService } from '@src/location/location.service';
import { UserService } from '@src/user/user.service';
import { ProductInsertDto } from './dto/productInsert.dto';
import { ProductSearchDto } from './dto/productSearch.dto';
import { Product, ProductRepository } from './entities/product.entity';

const DEFAULT_LIMIT = 10;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly locationService: LocationService,
  ) {}

  async findProduct(dto: ProductSearchDto) {
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

  async insertProduct(dto: ProductInsertDto) {
    const {
      title,
      description,
      price,
      imgUrl,
      sellerId,
      categoryName,
      locationId,
    } = dto;

    const { category } = await this.categoryService.getCategoryByName(
      categoryName,
    );
    if (!category) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_TARGET('카테고리')],
        HttpStatus.NOT_FOUND,
      );
    }

    const { user } = await this.userService.getUserById(sellerId);
    if (!user) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_TARGET('사용자')],
        HttpStatus.NOT_FOUND,
      );
    }

    const { location } = await this.locationService.getLocationById(locationId);
    if (!location) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_TARGET('지역')],
        HttpStatus.NOT_FOUND,
      );
    }

    await this.productRepository.query(
      `
      insert into Product (title, description, price, imgUrl, location_id, seller_id, category_name)
      values (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        description,
        price,
        JSON.stringify(imgUrl),
        locationId,
        sellerId,
        categoryName,
      ],
    );
  }

  private findProductByCategory(
    category: string,
    location: number,
    page: number,
  ) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.productRepository.query(
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
    return this.productRepository.query(
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
