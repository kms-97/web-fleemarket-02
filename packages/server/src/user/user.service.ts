import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { UserInsertDto } from './dto/userInsert.dto';
import { UserSearchDto } from './dto/userSearch.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { LocationService } from '@src/location/location.service';
import { UserLocationService } from '@src/userLocation/UserLocation.service';
import { User, UserRepository } from './entities/user.entity';
import { CustomException } from '@src/base/CustomException';
import { ErrorMessage } from '@src/constant/ErrorMessage';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    private readonly locationService: LocationService,
    private readonly userLocationService: UserLocationService,
  ) {}

  async insertUser(dto: UserInsertDto) {
    const { userId, name, password, locations } = dto;

    const hashedPassword = await this.hashPassword(password);

    const { user } = await this.getUserByUserId(userId);

    if (user) {
      throw new CustomException(
        [ErrorMessage.DUPLICATED_USER_ID],
        HttpStatus.CONFLICT,
      );
    }

    await this.userRepository.query(
      `
      insert into User (user_id, name, password)
      values (?, ?, ?)
      `,
      [userId, name, hashedPassword],
    );

    // todo: locations user_location 테이블 추가 (트랜잭션 처리)
    // todo: password bcrypt 암호화 필요 (완료)
  }

  async insertUserLocationHandler(userId: number, locationId: number) {
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
    await this.userLocationService.insertUserLocation(userId, locationId);
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
    await this.userLocationService.activeUserLocation(userId, locationId);
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

    const [user] = await this.userRepository.query(
      `
      select u.id, u.user_id as userId, u.name as name
      from User u
      where u.id = ?;
      `,
      [id],
    );

    // todo: locations, likes 조인 필요.
    return { user: user ?? null };
  }

  async getUserByUserId(userId: string) {
    const [user] = await this.userRepository.query(
      `
      select u.id, u.user_id as userId, u.name as name
      from User u
      where u.user_id = ?;
      `,
      [userId],
    );

    // todo: locations, likes 조인 필요.
    return { user: user ?? null };
  }

  async getUserByGithubEmail(email: string) {
    const [user] = await this.userRepository.query(
      `
      select u.id, u.user_id as userId, u.name as name
      from User u
      where u.github_email = ?;
      `,
      [email],
    );

    // todo: locations, likes 조인 필요.
    return { user: user ?? null };
  }

  async updateUser(id: number, dto: UserUpdateDto) {
    if (!isNaN(id)) {
      throw new CustomException(
        [ErrorMessage.NOT_VALID_FORMAT],
        HttpStatus.BAD_REQUEST,
      );
    }

    const { user } = await this.getUserById(id);
    if (!user) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_USER],
        HttpStatus.NOT_FOUND,
      );
    }

    let query = `update User set`;

    if (dto.name) {
      query = `${query} name = "${dto.name}"`;
    }

    await this.userRepository.query(
      `
      ${query}
      where id = ?
      `,
      [id],
    );

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
      `
      select u.id, u.user_id as userId, u.name as name, u.password as password
      from User u
      where u.user_id = ?;
      `,
      [userId],
    );

    return user[0] ?? null;
  }

  async getUserByGithubId(githubId: number) {
    const user = await this.userRepository.query(
      `
      select u.id, u.user_id as userId, u.name as name
      from User u
      where json_extract(u.github, '$.id') = ?;
      `,
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
}
