import { PaginationDto } from '@base/Pagination.dto';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ProductSearchDto extends PaginationDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsNumberString()
  location!: number;
}
