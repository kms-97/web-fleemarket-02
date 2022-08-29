import { BaseEntity } from '@base/BaseEntity';
import {
  Entity,
  Column,
  Repository,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Product } from '@product/entities/product.entity';
import { ChatLog } from './chatMessage.entity';

@Entity({ name: 'ChatRoom' })
export class ChatRoom extends BaseEntity {
  // 구매자
  @Column({ type: 'int' })
  @IsNumber()
  sellerId!: number;

  // 판매자
  @Column({ type: 'int' })
  @IsNumber()
  buyerId!: number;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
  @IsString()
  product: Product;

  @IsArray()
  @OneToMany(() => ChatLog, (chatLog) => chatLog.chatRoom, { cascade: true })
  chatLog: ChatLog[];

  @IsNumber()
  @Column({ type: 'int', nullable: true, default: null })
  deleteUserId: number;

  @DeleteDateColumn()
  deletedAt: Date | null;
}

export type ChatRoomRepository = Repository<ChatRoom>;
