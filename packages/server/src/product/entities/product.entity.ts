import { Category } from '@category/entities/category.entity';
import { BaseEntity } from '@src/base/BaseEntity';
import { Location } from '@src/location/entities/location.entity';
import { User } from '@src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Repository } from 'typeorm';

enum status {
  onSale = '판매중',
  reserved = '예약중',
  soldOut = '거래완료',
}

@Entity({ name: 'Product' })
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 0, default: 0 })
  price!: number;

  @Column({ type: 'json' })
  imgUrl!: object;

  @Column({ type: 'int', default: 0 })
  hits!: number;

  @Column({ type: 'enum', enum: status, default: status.onSale })
  status!: status;

  @ManyToOne(() => Location, (location) => location.id)
  @JoinColumn({ name: 'location_id' })
  locationId: Location;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'seller_id' })
  sellerId: User;

  @ManyToOne(() => Category, (category) => category.name)
  @JoinColumn({ name: 'category_name', referencedColumnName: 'name' })
  categoryName: Category;
}

export type ProductRepository = Repository<Product>;
