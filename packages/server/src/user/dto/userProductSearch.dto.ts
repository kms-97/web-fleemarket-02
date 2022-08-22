import { IsNumberString, IsOptional } from 'class-validator';

export class UserProductSearchDto {
  @IsOptional()
  @IsNumberString()
  page?: number;
}
