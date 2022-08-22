import { BaseEntity } from '@base/BaseEntity';
import { Entity, Unique, Column, Repository } from 'typeorm';
import { IsString } from 'class-validator';

@Entity({ name: 'Category' })
@Unique(['name'])
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  @IsString()
  name!: string;

  @Column({ type: 'text' })
  @IsString()
  imgUrl!: string;
}

export type CategoryRepository = Repository<Category>;
