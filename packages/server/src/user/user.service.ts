import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { UserInsertDto } from './dto/userInsert.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { User, UserRepository } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async insertUser(dto: UserInsertDto) {
    const { userId, name, password, locations } = dto;

    const hashedPassword = await this.hashPassword(password);

    await this.userRepository.query(
      `
      insert into User (user_id, name, password)
      values (?, ?, ?)
      `,
      [userId, name, hashedPassword],
    );

    // todo: locations user_location 테이블 추가 (트랜잭션 처리)
    // todo: password bcrypt 암호화 필요 (완료)

    return true;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.query(
      `
      select u.id, u.user_id as userId, u.name as name
      from User u
      where u.id = ?;
      `,
      [id],
    );

    // todo: locations, likes 조인 필요.
    return user[0] ?? null;
  }

  async getUserByUserId(userId: string) {
    const user = await this.userRepository.query(
      `
      select u.id, u.user_id as userId, u.name as name
      from User u
      where u.user_id = ?;
      `,
      [userId],
    );

    // todo: locations, likes 조인 필요.
    return user[0] ?? null;
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

  async getUserByGithubEmail(email: string) {
    const user = await this.userRepository.query(
      `
      select u.id, u.user_id as userId, u.name as name
      from User u
      where u.github_email = ?;
      `,
      [email],
    );

    // todo: locations, likes 조인 필요.
    return user[0] ?? null;
  }

  async updateUser(id: string, dto: UserUpdateDto) {
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
}
