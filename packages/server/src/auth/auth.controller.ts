import { Response } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenUser, User } from '@decorator/user.decorator';
import { UserService } from '@user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  AccessJwtAuthGuard,
  RefreshJwtAuthGuard,
} from './guards/jwt-auth.guard';

// 상수 (7일)
// 분리하면 좋을 것 같습니다.
const EXPIRED_ACCESS_TOKEN = 1000 * 60 * 5;
const EXPIRED_REFRESH_TOKEN = 1000 * 60 * 60 * 24 * 14;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AccessJwtAuthGuard)
  @Get('/')
  async getUserInfo(@User() _user: TokenUser) {
    return this.userService.getUserById(_user.id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @User() _user: TokenUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = await this.userService.getUserById(_user.id);

    if (!user) {
      throw new BadRequestException('존재하지 않는 유저입니다.');
    }

    const [accessToken, refreshToken] = await this.authService.login(_user.id);
    const config = this.configService;

    res.cookie(config.get('JWT_ACCESS_TOKEN'), accessToken, {
      httpOnly: true,
      maxAge: EXPIRED_ACCESS_TOKEN,
    });

    res.cookie(config.get('JWT_REFRESH_TOKEN'), refreshToken, {
      httpOnly: true,
      maxAge: EXPIRED_REFRESH_TOKEN,
    });

    return { user };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('/logout')
  async logout(
    @User() _user: TokenUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.updateRefreshToken(_user.id, null);

    const config = this.configService;

    res.clearCookie(config.get('JWT_ACCESS_TOKEN'));
    res.clearCookie(config.get('JWT_REFRESH_TOKEN'));

    return;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('/refresh')
  async refresh(
    @User() _user: TokenUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const [accessToken, refreshToken] = await this.authService.login(_user.id);
    const config = this.configService;

    res.cookie(config.get('JWT_ACCESS_TOKEN'), accessToken, {
      httpOnly: true,
      maxAge: EXPIRED_ACCESS_TOKEN,
    });

    res.cookie(config.get('JWT_REFRESH_TOKEN'), refreshToken, {
      httpOnly: true,
      maxAge: EXPIRED_REFRESH_TOKEN,
    });

    return true;
  }

  @Get('/github/callback')
  async githubAuthentication(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    if (!code) {
      return res.redirect('http://localhost:3000/login');
    }

    const aAccessToken = await this.authService.getGithubTokenByCode(code);
    const userInfo = await this.authService.getGithubUserByAccessToken(
      aAccessToken,
    );

    const user = await this.userService.getUserByGithubId(userInfo.id);

    if (user) {
      await this.login(user, res);
      return res.redirect('http://localhost:3000/main');
    }

    res.cookie('github', userInfo, {
      maxAge: EXPIRED_ACCESS_TOKEN,
    });

    return res.redirect('http://localhost:3000/signup');
  }
}
