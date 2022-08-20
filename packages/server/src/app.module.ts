import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from '@category/category.module';
import { DatabaseModule } from '@database/database.module';
import { ImageModule } from './image/image.module';
import { LocationModule } from './location/location.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { WishModule } from './wish/wish.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    CategoryModule,
    ImageModule,
    LocationModule,
    UserModule,
    ProductModule,
    WishModule,
  ],
})
export class AppModule {}
