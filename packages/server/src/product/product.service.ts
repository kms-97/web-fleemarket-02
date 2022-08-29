import { CategoryService } from '@category/category.service';
import { PRODUCT_QUERY } from '@constant/queries';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@base/CustomException';
import { productStatus } from '@constant/enum';
import { ErrorMessage } from '@constant/ErrorMessage';
import { LocationService } from '@location/location.service';
import { UserService } from '@user/user.service';
import { WishService } from '@wish/wish.service';
import { ProductInsertDto } from './dto/productInsert.dto';
import { ProductSearchDto } from './dto/productSearch.dto';
import { Product, ProductRepository } from './entities/product.entity';

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
    let products: Product[];

    if (category) {
      await this.categoryService.checkExistCategoryByName(category);
      await this.locationService.checkExistLocationById(location);
      products = await this.findProductByCategory(category, location);
    } else {
      await this.locationService.checkExistLocationById(location);
      products = await this.findProductByLocation(location);
    }

    return { products };
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
    const result = await this.productRepository.query(
      PRODUCT_QUERY.INSERT_PRODUCT,
      values,
    );

    return { id: result.insertId };
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

  async updateProduct(userId: number, id: number, dto: ProductInsertDto) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistProductById(id);
    await this.checkAuthor(userId, id);

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

  async updateProductStatus(
    userId: number,
    id: number,
    newStatus: productStatus,
  ) {
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
    await this.checkAuthor(userId, id);
    await this.productRepository.query(PRODUCT_QUERY.UPDATE_PRODUCT_STATUS, [
      newStatus,
      id,
    ]);
  }

  async deleteProduct(userId: number, id: number) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistProductById(id);
    await this.checkAuthor(userId, id);
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

  findProductByCategory(category: string, location: number) {
    return this.productRepository.query(
      PRODUCT_QUERY.FIND_PRODUCT_BY_CATEGORY,
      [category, location],
    );
  }

  findProductByLocation(location: number) {
    return this.productRepository.query(
      PRODUCT_QUERY.FIND_PRODUCT_BY_LOCATION,
      [location],
    );
  }

  findProductBySellerId(id: number) {
    return this.productRepository.query(
      PRODUCT_QUERY.FIND_PRODUCT_BY_SELLER_ID,
      [id],
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
    return product;
  }

  async checkAuthor(userId: number, id: number) {
    const { product } = await this.getProductById(id);
    if (product.seller_id !== userId) {
      throw new CustomException(
        [ErrorMessage.NO_AUTHORITY],
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
