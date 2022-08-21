import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLocation } from './entites/UserLocation.entity';
import { UserLocationService } from './UserLocation.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserLocation])],
  controllers: [],
  providers: [UserLocationService],
  exports: [UserLocationService],
})
export class UserLocationModule {}
