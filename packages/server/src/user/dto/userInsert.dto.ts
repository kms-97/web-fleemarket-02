import { PartialType } from '@nestjs/mapped-types';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserInsertDto extends PartialType(User) {
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  locations: number[];
}
