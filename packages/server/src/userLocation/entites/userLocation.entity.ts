import { BaseEntity } from '@base/BaseEntity';
import { Entity, Column, Repository, ManyToOne, JoinColumn } from 'typeorm';
import { IsBoolean } from 'class-validator';
import { User } from '@user/entities/user.entity';
import { Location } from '@location/entities/location.entity';

@Entity({ name: 'UserLocation' })
export class UserLocation extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => Location, (location) => location.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'location_id' })
  locationId!: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  @IsBoolean()
  isActive!: boolean;
}

export type UserLocationRepository = Repository<UserLocation>;
