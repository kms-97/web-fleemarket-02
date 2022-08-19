import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@src/base/CustomException';
import { ErrorMessage } from '@src/constant/ErrorMessage';
import { User, UserRepository } from './entities/user.entity';
import { UserInsertDto } from './dto/userInsert.dto';
import { UserSearchDto } from './dto/userSearch.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async insertUser(dto: UserInsertDto) {
    const { userId, name, password, locations } = dto;

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
      [userId, name, password],
    );

    // todo: locations user_location 테이블 추가 (트랜잭션 처리)
    // todo: password bcrypt 암호화 필요 ()
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

  async getUserById(id: string) {
    if (!Number(id)) {
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

  async updateUser(id: string, dto: UserUpdateDto) {
    if (!Number(id)) {
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
}
