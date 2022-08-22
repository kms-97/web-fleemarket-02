import { CategoryService } from '@category/category.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@src/base/CustomException';
import { productStatus } from '@src/constant/enum';
import { ErrorMessage } from '@src/constant/ErrorMessage';
import { LocationService } from '@src/location/location.service';
import { UserService } from '@src/user/user.service';
import { WishService } from '@src/wish/wish.service';
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
    private readonly wishService: WishService,
  ) {}

  async findProduct(dto: ProductSearchDto) {
    const { category, location } = dto;
    const page = dto.page ?? 1;
    let products: Product[];

    if (category) {
      await this.categoryService.checkExistCategoryByName(category);
      await this.locationService.checkExistLocationById(location);
      products = await this.findProductByCategory(category, location, page);
    } else {
      await this.locationService.checkExistLocationById(location);
      products = await this.findProductByLocation(location, page);
    }

    return { products, page };
  }

  async getProductDetailById(id: number) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistProductById(id);

    const [product] = await this.productRepository.query(
      `
      select p.id as id, title, description, price, p.imgUrl as imgUrl, status, hits,
            json_object('id', l.id, 'code', l.code, 'dong', l.dong) as location,
            json_object('id', c.id, 'name', c.name) as category,
            json_object('id', u.id, 'userId', u.user_id, 'name', u.name) as seller,
            if(count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
      from Product p
      join location l on p.location_id = l.id
      join user u on u.id = p.seller_id
      join category c on c.name = p.category_name
      left join wish w on w.product_id = p.id
      where p.id = ?;
      `,
      [id],
    );

    return { product: product ?? null };
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

    await this.categoryService.checkExistCategoryByName(categoryName);
    await this.userService.checkExistUserById(sellerId);
    await this.locationService.checkExistLocationById(locationId);

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

  async insertProductWish(userId: number, productId: number) {
    if (isNaN(productId)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistProductById(productId);
    await this.wishService.insertWish(userId, productId);
  }

  async updateProduct(id: number, dto: ProductInsertDto) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistProductById(id);

    const {
      title,
      description,
      price,
      imgUrl,
      sellerId,
      categoryName,
      locationId,
    } = dto;

    await this.categoryService.checkExistCategoryByName(categoryName);
    await this.userService.checkExistUserById(sellerId);
    await this.locationService.checkExistLocationById(locationId);

    await this.productRepository.query(
      `
      update product
      set title = ?, description = ?, price = ?, imgUrl = ?, location_id = ?, seller_id = ?, category_name = ?
      where id = ?
      `,
      [
        title,
        description,
        price,
        JSON.stringify(imgUrl),
        locationId,
        sellerId,
        categoryName,
        id,
      ],
    );
  }

  async updateProductStatus(id: number, newStatus: productStatus) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Object.values(productStatus).includes(newStatus)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistProductById(id);

    await this.productRepository.query(
      `
      update product
      set status = ?
      where id = ?
      `,
      [newStatus, id],
    );
  }

  async deleteProduct(id: number) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistProductById(id);

    await this.productRepository.query(
      `
      delete from product where id = ?
      `,
      [id],
    );
  }

  async deleteProductWish(userId: number, productId: number) {
    if (isNaN(productId)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistProductById(productId);
    await this.wishService.deleteWish(userId, productId);
  }

  findProductByCategory(category: string, location: number, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.productRepository.query(
      `
      select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName, seller_id as sellerId,
        if (count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
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

  findProductByLocation(location: number, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.productRepository.query(
      `
      select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName, seller_id as sellerId,
        if (count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
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

  findProductBySellerId(id: number, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.productRepository.query(
      `
      select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName, seller_id as sellerId,
        if (count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
      from Product p
      join location l on p.location_id = l.id
      left join wish w on w.product_id = p.id
      where p.seller_id = ?
      group by p.id
      limit ?, ?;
      `,
      [id, offset, DEFAULT_LIMIT],
    );
  }

  async getProductById(id: number) {
    const [product] = await this.productRepository.query(
      `select * from product where id = ?`,
      [id],
    );

    return { product: product ?? null };
  }

  async checkExistProductById(id: number) {
    const { product } = await this.getProductById(id);
    if (!product) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_TARGET('상품')],
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
