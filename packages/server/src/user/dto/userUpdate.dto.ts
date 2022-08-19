import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UserUpdateDto extends PickType(User, ['name']) {}
