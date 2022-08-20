import { verify } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { UserService } from '@user/user.service';
import { encryptValue } from '@utils/crypto';

import { Auth, AuthRepository } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(Auth) private readonly authRepository: AuthRepository,
  ) {}

  async login(userId: number) {
    const payload = { id: userId };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '5m' });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '14d',
    });

    const isExist = await this.isExistRefreshTokenByUserId(userId);

    if (isExist) {
      await this.updateRefreshToken(userId, refreshToken);
    } else {
      await this.insertRefreshToken(userId, refreshToken);
    }

    const enKey = this.configService.get('LOGIN_SECRET_KEY');

    return [
      encryptValue(accessToken, enKey),
      encryptValue(refreshToken, enKey),
    ];
  }

  async validateUser(userId: string, password: string) {
    const user = await this.userService.getUserWithHashPasswordByUserId(userId);
    const isCompare = await this.userService.comparePassword(
      password,
      user?.password ?? '',
    );

    if (!user || !isCompare) {
      return null;
    }

    const result = await this.userService.getUserById(user.id);

    return result;
  }

  async verifyRefresh(aRefreshToken: string) {
    const row = await this.authRepository.query(
      `
      select a.refresh_token as refreshToken
      from Auth a
      where a.refresh_token = ?
      `,
      [aRefreshToken],
    );

    if (!row[0]) {
      return false;
    }

    const result = verify(
      row[0].refreshToken,
      this.configService.get('JWT_SECRET_KEY'),
    );

    return Boolean(result);
  }

  async isExistRefreshTokenByUserId(userId: number) {
    const row = await this.authRepository.query(
      `
      select a.refresh_token as refreshToken
      from Auth a 
      where a.user_id = ?
      `,
      [userId],
    );

    return Boolean(row[0]);
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    return await this.authRepository.query(
      `
        update Auth set refresh_token = "${refreshToken}"
        where user_id = ?
        `,
      [userId],
    );
  }

  async insertRefreshToken(userId: number, refreshToken: string) {
    return await this.authRepository.query(
      `
        insert into Auth (user_id, refresh_token) 
        values (?, ?)
        `,
      [userId, refreshToken],
    );
  }

  async getGithubTokenByCode(code: string) {
    const config = this.configService;

    const client_id = config.get('GITHUB_CLIENT_ID');
    const client_secret = config.get('GITHUB_CLIENT_SECRET');
    const url = `https://github.com/login/oauth/access_token`;

    const { data } = await this.httpService.axiosRef.get(url, {
      params: {
        client_id,
        client_secret,
        code,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    return data.access_token;
  }

  async getGithubUserByAccessToken(accessToken: string) {
    const url = ` https://api.github.com/user`;

    const { data } = await this.httpService.axiosRef.get(url, {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
      params: {
        scope: 'user',
      },
    });

    return data;
  }
}
