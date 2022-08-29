import { BaseEntity } from '@base/BaseEntity';
import { Entity, Column, Repository, ManyToOne, JoinColumn } from 'typeorm';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ChatRoom } from './chatRoom.entity';

@Entity({ name: 'ChatLog' })
export class ChatLog extends BaseEntity {
  @Column({ type: 'text' })
  @IsString()
  content!: string;

  // 구매자
  @Column({ type: 'int' })
  @IsNumber()
  userId!: number;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.id, {
    onDelete: 'CASCADE',
  })
  @IsNumber()
  chatRoom: ChatRoom;
}

export type ChatLogRepository = Repository<ChatLog>;
