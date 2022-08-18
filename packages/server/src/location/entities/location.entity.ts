import { BaseEntity } from '@src/base/BaseEntity';
import { Entity, Unique, Column, Repository } from 'typeorm';
import { IsString } from 'class-validator';

@Entity({ name: 'Location' })
@Unique(['code'])
export class Location extends BaseEntity {
  @Column({ type: 'varchar', length: 10 })
  @IsString()
  sido!: string;

  @Column({ type: 'varchar', length: 10 })
  @IsString()
  gungu!: string;

  @Column({ type: 'varchar', length: 10 })
  @IsString()
  dong!: string;

  @Column({ type: 'char', length: 10 })
  @IsString()
  code!: string;
}

export type LocationRepository = Repository<Location>;
