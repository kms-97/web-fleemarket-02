import { AuthService } from '@auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userId',
      passwordField: 'password',
    });
  }

  async validate(userId: string, password: string) {
    const user = await this.authService.validateUser(userId, password);

    if (!user) {
      // 커스텀 에러 생성도 가능할 것 같습니다.
      throw new UnauthorizedException();
    }

    return user;
  }
}
