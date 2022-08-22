import { PaginationDto } from '@base/Pagination.dto';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class LocationDto extends PaginationDto {
  @IsOptional()
  @IsNumberString()
  code?: string;

  @IsOptional()
  @IsString()
  keyword?: string;
}
