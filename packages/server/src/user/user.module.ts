import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '@product/product.module';
import { LocationModule } from '@src/location/location.module';
import { UserLocationModule } from '@src/userLocation/UserLocation.module';
import { WishModule } from '@src/wish/wish.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LocationModule,
    UserLocationModule,
    ProductModule,
    WishModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
