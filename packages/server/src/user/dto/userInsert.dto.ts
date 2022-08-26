import { PickType } from '@nestjs/mapped-types';
import { ErrorMessage } from '@constant/ErrorMessage';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GithubUser, User } from '../entities/user.entity';
import { UserLocationDto } from './userLocation.dto';

export class UserInsertDto extends PickType(User, [
  'userId',
  'password',
  'name',
]) {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: ErrorMessage.NOT_EMPTY_USER_LOCATION })
  @ArrayMaxSize(2, { message: ErrorMessage.EXCEED_USER_LOCATION_LIMIT })
  @Type(() => UserLocationDto)
  locations: UserLocationDto[];

  @IsObject()
  @IsOptional()
  github?: GithubUser;
}
