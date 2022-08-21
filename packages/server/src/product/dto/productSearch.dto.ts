import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductSearchDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsNumberString()
  location!: number;

  @IsOptional()
  @IsNumber()
  page?: number;
}
