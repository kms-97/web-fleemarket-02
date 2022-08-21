import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface TokenUser {
  id: number;
}

export const User = createParamDecorator((_, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();

  if (!req.user) {
    return null;
  }

  return req.user;
});
