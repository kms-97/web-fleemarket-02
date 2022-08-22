import { CategoryService } from '@category/category.service';
import { PRODUCT_QUERY } from '@constant/queries';
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
      PRODUCT_QUERY.GET_PRODUCT_DETAIL_BY_ID,
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

    const values = [
      title,
      description,
      price,
      JSON.stringify(imgUrl),
      locationId,
      sellerId,
      categoryName,
    ];
    await this.productRepository.query(PRODUCT_QUERY.INSERT_PRODUCT, values);
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

    const values = [
      title,
      description,
      price,
      JSON.stringify(imgUrl),
      locationId,
      sellerId,
      categoryName,
      id,
    ];
    await this.productRepository.query(PRODUCT_QUERY.UPDATE_PRODUCT, values);
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

    await this.productRepository.query(PRODUCT_QUERY.UPDATE_PRODUCT_STATUS, [
      newStatus,
      id,
    ]);
  }

  async deleteProduct(id: number) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistProductById(id);

    await this.productRepository.query(PRODUCT_QUERY.DELETE_PRODUCT, [id]);
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
      PRODUCT_QUERY.FIND_PRODUCT_BY_CATEGORY,
      [category, location, offset, DEFAULT_LIMIT],
    );
  }

  findProductByLocation(location: number, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.productRepository.query(
      PRODUCT_QUERY.FIND_PRODUCT_BY_LOCATION,
      [location, offset, DEFAULT_LIMIT],
    );
  }

  findProductBySellerId(id: number, page: number) {
    const offset = (page - 1) * DEFAULT_LIMIT;
    return this.productRepository.query(
      PRODUCT_QUERY.FIND_PRODUCT_BY_SELLER_ID,
      [id, offset, DEFAULT_LIMIT],
    );
  }

  async getProductById(id: number) {
    const [product] = await this.productRepository.query(
      PRODUCT_QUERY.GET_PRODUCT_BY_ID,
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
