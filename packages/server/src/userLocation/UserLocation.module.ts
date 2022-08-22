import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLocation } from './entites/userLocation.entity';
import { UserLocationService } from './userLocation.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserLocation])],
  controllers: [],
  providers: [UserLocationService],
  exports: [UserLocationService],
})
export class UserLocationModule {}
