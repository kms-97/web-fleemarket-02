import { compare, hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationService } from '@location/location.service';
import { PaginationDto } from '@base/Pagination.dto';
import { UserLocationService } from '@userLocation/userLocation.service';
import { CustomException } from '@base/CustomException';
import { ErrorMessage } from '@constant/ErrorMessage';
import { ProductService } from '@product/product.service';
import { WishService } from '@wish/wish.service';
import { USER_QUERY } from '@constant/queries';
import { User, UserRepository } from './entities/user.entity';
import { UserLocationDto } from './dto/userLocation.dto';
import { UserInsertDto } from './dto/userInsert.dto';
import { UserSearchDto } from './dto/userSearch.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    private readonly locationService: LocationService,
    private readonly userLocationService: UserLocationService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    private readonly wishService: WishService,
    private readonly dataSource: DataSource,
  ) {}

  async insertUser(dto: UserInsertDto) {
    const { userId, name, password, locations } = dto;
    const hashedPassword = await this.hashPassword(password);

    this.checkExistUserByUserId(userId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { insertId } = await queryRunner.query(USER_QUERY.INSERT_USER, [
        userId,
        name,
        hashedPassword,
      ]);

      for (let i = 0; i < locations.length; i++) {
        await this.userLocationService.insertUserLocation(
          queryRunner,
          insertId,
          locations[i].locationId,
          locations[i].isActive,
        );
      }

      await queryRunner.commitTransaction();

      return;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }

  async insertUserLocationHandler(dto: UserLocationDto) {
    const { userId, locationId, isActive } = dto;
    if (isNaN(userId) || isNaN(locationId)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistUserById(userId);
    await this.locationService.checkExistLocationById(locationId);

    await this.userLocationService.checkExistUserLocation(userId, locationId);
    await this.userLocationService.checkUserLocationMax(userId);
    await this.userLocationService.insertUserLocation(
      null,
      userId,
      locationId,
      isActive,
    );
  }

  async updateActiveUserLocationHandler(userId: number, locationId: number) {
    if (isNaN(userId) || isNaN(locationId)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistUserById(userId);
    await this.locationService.checkExistLocationById(locationId);

    await this.userLocationService.checkNotExistUserLocation(
      userId,
      locationId,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userLocationService.activeUserLocation(
        queryRunner,
        userId,
        locationId,
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUserLocationHandler(userId: number, locationId: number) {
    if (isNaN(userId) || isNaN(locationId)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistUserById(userId);
    await this.locationService.checkExistLocationById(locationId);

    await this.userLocationService.checkUserLocationMin(userId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userLocationService.deleteUserLocation(
        queryRunner,
        userId,
        locationId,
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserByUserIdOrGithubEmail(dto: UserSearchDto) {
    const { githubEmail, userId } = dto;

    if (githubEmail && userId) {
      throw new CustomException(
        [ErrorMessage.EXCEED_ONE_SEARCH_CONDITION],
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!githubEmail && !userId) {
      throw new CustomException(
        [ErrorMessage.NEED_ONE_SEARCH_CONDITION],
        HttpStatus.BAD_REQUEST,
      );
    }

    if (githubEmail) {
      return this.getUserByGithubEmail(githubEmail);
    }
    if (userId) {
      return this.getUserByUserId(userId);
    }
  }

  async getUserById(id: number) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    const [user] = await this.userRepository.query(USER_QUERY.GET_USER_BY_ID, [
      id,
    ]);

    return { user: user ?? null };
  }

  async getUserByUserId(userId: string) {
    const [user] = await this.userRepository.query(
      USER_QUERY.GET_USER_BY_USER_ID,
      [userId],
    );

    return { user: user ?? null };
  }

  async getUserByGithubEmail(email: string) {
    const [user] = await this.userRepository.query(
      USER_QUERY.GET_USER_BY_GITHUB_EMAIL,
      [email],
    );

    return { user: user ?? null };
  }

  async getUserProductById(id: number, dto: PaginationDto) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistUserById(id);

    const page = dto.page ?? 1;
    const products = await this.productService.findProductBySellerId(id, page);

    return { products, page };
  }

  async getUserWishById(id: number, dto: PaginationDto) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkExistUserById(id);

    const page = dto.page ?? 1;
    const wishes = await this.wishService.findWishByUserId(id, page);

    return { wishes, page };
  }

  async updateUser(id: number, dto: UserUpdateDto) {
    if (isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    this.checkExistUserById(id);

    await this.userRepository.query(USER_QUERY.UPDATE_USER, [dto.name, id]);

    return true;
  }

  async comparePassword(aPassword: string, password: string) {
    const isCompare = await compare(aPassword, password);

    return isCompare;
  }

  private async hashPassword(password: string) {
    if (!password) {
      return null;
    }

    return await hash(password, 10);
  }

  async getUserWithHashPasswordByUserId(userId: string) {
    const user = await this.userRepository.query(
      USER_QUERY.GET_USER_WITH_HASH_PASSWORD,
      [userId],
    );

    return user[0] ?? null;
  }

  async getUserByGithubId(githubId: number) {
    const user = await this.userRepository.query(
      USER_QUERY.GET_USER_BY_GITHUB_ID,
      [githubId],
    );

    return user[0] ?? null;
  }

  async checkExistUserById(id: number) {
    const { user } = await this.getUserById(id);
    if (!user) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_TARGET('사용자')],
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async checkExistUserByUserId(UserId: string) {
    const { user } = await this.getUserByUserId(UserId);
    if (!user) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_TARGET('사용자')],
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
