import { PickType } from '@nestjs/mapped-types';
import { ErrorMessage } from '@src/constant/ErrorMessage';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserInsertDto extends PickType(User, [
  'userId',
  'password',
  'name',
]) {
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1, { message: ErrorMessage.NOT_EMPTY_USER_LOCATION })
  @ArrayMaxSize(2, { message: ErrorMessage.EXCEED_USER_LOCATION_LIMIT })
  locations: number[];
}
