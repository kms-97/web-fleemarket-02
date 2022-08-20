import { Category } from '@category/entities/category.entity';
import { BaseEntity } from '@src/base/BaseEntity';
import { productStatus } from '@src/constant/enum';
import { Location } from '@src/location/entities/location.entity';
import { User } from '@src/user/entities/user.entity';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, Repository } from 'typeorm';

@Entity({ name: 'Product' })
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  title!: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 0, default: 0 })
  @IsNotEmpty()
  price!: number;

  @Column({ type: 'json' })
  @IsArray()
  @IsString({ each: true })
  imgUrl!: string[];

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  hits!: number;

  @Column({ type: 'enum', enum: productStatus, default: productStatus.onSale })
  @IsEnum(productStatus)
  status!: productStatus;

  @ManyToOne(() => Location, (location) => location.id)
  @JoinColumn({ name: 'location_id' })
  @IsNumber()
  locationId: Location;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'seller_id' })
  @IsNumber()
  sellerId: User;

  @ManyToOne(() => Category, (category) => category.name)
  @JoinColumn({ name: 'category_name', referencedColumnName: 'name' })
  @IsString()
  categoryName: Category;
}

export type ProductRepository = Repository<Product>;
