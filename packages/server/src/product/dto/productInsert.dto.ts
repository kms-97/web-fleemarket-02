import { PickType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';
import { Product } from '../entities/product.entity';

export class ProductInsertDto extends PickType(Product, [
  'title',
  'description',
  'price',
  'imgUrl',
]) {
  @IsString()
  categoryName: string;

  @IsNumber()
  sellerId: number;

  @IsNumber()
  locationId: number;
}
