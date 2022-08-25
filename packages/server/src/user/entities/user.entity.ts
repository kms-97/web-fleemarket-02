import { BaseEntity } from '@base/BaseEntity';
import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Column, Entity, Repository } from 'typeorm';

export interface GithubUser {
  id: number;
  name: string;
}
@Entity({ name: 'User' })
export class User extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'text', nullable: false })
  password!: string;

  @IsEmail()
  @Column({
    name: 'github_email',
    type: 'varchar',
    length: 255,
    default: null,
    unique: true,
  })
  githubEmail?: string;

  @IsObject()
  @Column({ type: 'json', default: null })
  github?: GithubUser;
}

export type UserRepository = Repository<User>;
