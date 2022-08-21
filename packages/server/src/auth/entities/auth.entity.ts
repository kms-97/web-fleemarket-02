import { BaseEntity } from '@src/base/BaseEntity';
import { Entity, Column, Repository } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

@Entity({ name: 'Auth' })
export class Auth extends BaseEntity {
  @Column({ name: 'refresh_token', type: 'text' })
  @IsString()
  refreshToken!: string;

  @Column({ name: 'user_id', type: 'int', unique: true })
  @IsNumber()
  userId!: string;
}

export type AuthRepository = Repository<Auth>;
