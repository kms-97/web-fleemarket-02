import { AuthService } from '@auth/auth.service';
import { jwtConstants } from '@constant/jwt';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { decryptValue } from '@utils/crypto';
import { setAuth } from '@utils/setAuth';

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private config: ConfigService) {
    super();
  }

  handleRequest(err, user, info) {
    if (!user || err) {
      throw new UnauthorizedException(info.message);
    }

    return user;
  }

  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const config = this.config;

    return setAuth(
      req,
      config.get('JWT_ACCESS_TOKEN'),
      config.get('LOGIN_SECRET_KEY'),
    );
  }
}

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService,
  ) {
    super();
  }

  handleRequest(err, user, info) {
    if (!user || err) {
      throw new UnauthorizedException(info.message);
    }

    return user;
  }

  async getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const refreshToken = req.cookies[jwtConstants.refreshToken];
    const config = this.config;

    const isValid = await this.authService.verifyRefresh(
      decryptValue(refreshToken, config.get('LOGIN_SECRET_KEY')),
    );

    if (isValid) {
      throw new UnauthorizedException('다시 로그인해주세요.');
    }

    return setAuth(
      req,
      config.get('JWT_REFRESH_TOKEN'),
      config.get('LOGIN_SECRET_KEY'),
    );
  }
}
