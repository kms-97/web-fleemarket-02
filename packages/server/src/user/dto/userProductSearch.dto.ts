import { IsNumber, IsOptional } from 'class-validator';

export class UserProductSearchDto {
  @IsOptional()
  @IsNumber()
  page?: number;
}
