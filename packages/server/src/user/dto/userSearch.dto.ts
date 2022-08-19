import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UserSearchDto extends PartialType(
  PickType(User, ['githubEmail', 'userId']),
) {}
