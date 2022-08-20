import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { WishService } from './wish.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wish])],
  controllers: [],
  providers: [WishService],
  exports: [WishService],
})
export class WishModule {}
