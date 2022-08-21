import { BaseEntity } from '@src/base/BaseEntity';
import { Product } from '@src/product/entities/product.entity';
import { User } from '@src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, Repository } from 'typeorm';

@Entity({ name: 'Wish' })
export class Wish extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  productId!: number;
}

export type WishRepository = Repository<Wish>;
